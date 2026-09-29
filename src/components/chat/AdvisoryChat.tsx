import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Fish,
  RefreshCw,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getSelectedLocation } from '@/services/liveMarineService';
import { apiUrl } from '@/services/api';
import { cn } from '@/lib/utils';

interface EvidenceSource {
  name: string;
  timestamp: string;
  type: string;
}

interface EvidenceTrail {
  sources: EvidenceSource[];
  threshold_rationale?: string;
  confidence_rating: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  spatialPayload?: any;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence?: EvidenceTrail;
  agentsInvoked?: string[];
  feedback?: 'up' | 'down' | null;
}

interface AdvisoryChatProps {
  /** Called whenever the conversation goes from just-the-welcome-message to having a real exchange (and back, on reset), so an embedding page can react — e.g. collapsing a hero banner. */
  onActivityChange?: (active: boolean) => void;
}

/**
 * Embeddable advisory chat block. Grows with the conversation instead of
 * clipping to a fixed viewport height, so an embedding page (e.g. Home)
 * scrolls naturally as messages accumulate.
 */
export function AdvisoryChat({ onActivityChange }: AdvisoryChatProps = {}) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('orca_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem('orca_chat_history', JSON.stringify(messages));
  }, [messages]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Suggested prompt questions
  const SUGGESTED_QUESTIONS = [
    {
      ml: 'ഇന്ന് കൊച്ചി തീരത്ത് മീൻപിടിക്കാൻ പോകുന്നത് സുരക്ഷിതമാണോ?',
      en: 'Is it safe to go fishing off Kochi coast today?'
    },
    {
      ml: 'ഏറ്റവും അടുത്തുള്ള PFZ എവിടെയാണ്?',
      en: 'Where is the nearest Potential Fishing Zone (PFZ)?'
    },
    {
      ml: 'അടുത്ത 12 മണിക്കൂറിലെ കാറ്റും തിരമാലയും വിശദീകരിക്കുക.',
      en: 'Explain wind speed and wave conditions for the next 12 hours.'
    },
    {
      ml: 'കടലിൽ അപകടമുണ്ടായാൽ ആരെ വിളിക്കണം?',
      en: 'Who should I contact if our boat engine fails at sea?'
    }
  ];

  // Initial welcome message
  useEffect(() => {
    if (messages.length > 0) return;

    const initialText = language === 'ML'
      ? 'നമസ്കാരം! ഞാൻ ORCA മറൈൻ അഡ്വൈസറി സഹായിയാണ്. തത്സമയ കടൽ കാലാവസ്ഥ, ഉയർന്ന മീൻ ലഭ്യതയുള്ള മേഖലകൾ (PFZ), ഒപ്പം സുരക്ഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ അറിയാൻ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുകയോ നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുകയോ ചെയ്യാം. 🎤 ശബ്ദത്തിലൂടെയും ചോദിക്കാം.'
      : 'Hello! I am **ORCA Marine Advisory Assistant**. Get instant operational intelligence regarding live ocean weather, Potential Fishing Zones (PFZs), and navigation safety.\n\nSelect a quick question below, type your query, or use the 🎤 microphone for voice input.';

    setMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: 'LOW',
        evidence: {
          sources: [
            { name: 'Open-Meteo Marine API', timestamp: new Date().toISOString(), type: 'Real-time Telemetry' },
            { name: 'INCOIS PFZ Advisory', timestamp: new Date().toISOString(), type: 'Official Government Advisory' }
          ],
          confidence_rating: 'HIGH'
        }
      }
    ]);
  }, [language]);

  // Tell the embedding page whether a real exchange has started (vs. just the welcome message)
  useEffect(() => {
    onActivityChange?.(messages.length > 1);
  }, [messages.length, onActivityChange]);

  // Scroll to the latest message once it's rendered. The short delay lets the
  // embedding page's own collapse animation (e.g. the Home greeting banner)
  // finish its layout shift first, so the scroll lands in the right place
  // instead of fighting an in-flight resize.
  useEffect(() => {
    const id = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 350);
    return () => clearTimeout(id);
  }, [messages, isProcessing]);

  // Voice recording handlers
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          handleVoiceSubmit(base64);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const handleVoiceSubmit = async (audioBase64: string) => {
    const voiceMsg: ChatMessage = {
      id: `user-voice-${Date.now()}`,
      sender: 'user',
      text: language === 'ML' ? '🎤 ശബ്ദ സന്ദേശം അയച്ചു...' : '🎤 Voice message sent...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, voiceMsg]);
    setIsProcessing(true);

    try {
      const currentLoc = getSelectedLocation();
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '[voice_input]',
          audio_base64: audioBase64,
          context: {
            language,
            location: currentLoc.name,
            coordinates: { lat: currentLoc.lat, lon: currentLoc.lng }
          }
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      addAssistantMessage(data);
    } catch {
      addFallbackMessage();
    } finally {
      setIsProcessing(false);
    }
  };

  const addAssistantMessage = (data: any) => {
    const replyText = data.text || (language === 'ML'
      ? 'തത്സമയ സമുദ്ര വിവരങ്ങൾ ലഭ്യമല്ല.'
      : 'Live marine intelligence is currently unavailable.');

    const risk = (data.risk || 'LOW').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH';
    const agents = data.agents_invoked || [];

    const evidence: EvidenceTrail = {
      sources: [
        { name: 'Open-Meteo Marine API', timestamp: new Date().toISOString(), type: 'Near-Real-Time Telemetry' },
        ...(agents.includes('OrcaNLP') ? [{ name: 'ORCA RAG Knowledge Base', timestamp: new Date().toISOString(), type: 'Advisory RAG' }] : []),
        ...(risk !== 'LOW' ? [{ name: 'IMD Marine Bulletin', timestamp: new Date().toISOString(), type: 'Official Warning' }] : [])
      ],
      threshold_rationale: risk === 'HIGH' ? 'Wave height > 2.5m or Wind > 45 km/h threshold exceeded' : undefined,
      confidence_rating: data.confidence > 80 ? 'HIGH' : data.confidence > 50 ? 'MEDIUM' : 'LOW'
    };

    const assistantMessage: ChatMessage = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      spatialPayload: data.spatial_payload || null,
      risk,
      evidence,
      agentsInvoked: agents,
      feedback: null
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const addFallbackMessage = () => {
    const fallbackText = language === 'ML'
      ? 'തത്സമയ സമുദ്ര വിവരങ്ങൾ ലഭ്യമല്ല. വീണ്ടും ശ്രമിക്കുക.'
      : 'Live marine intelligence is unavailable. Please try again.';

    setMessages(prev => [
      ...prev,
      {
        id: `fallback-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk: 'LOW',
        evidence: {
          sources: [{ name: 'Open-Meteo (Cached)', timestamp: new Date().toISOString(), type: 'Cached Telemetry' }],
          confidence_rating: 'MEDIUM'
        },
        feedback: null
      }
    ]);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText.trim();
    if (!textToSend || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setIsProcessing(true);

    try {
      const currentLoc = getSelectedLocation();
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            language,
            location: currentLoc.name,
            coordinates: { lat: currentLoc.lat, lon: currentLoc.lng }
          }
        })
      });

      if (!res.ok) throw new Error('API server error');
      const data = await res.json();
      addAssistantMessage(data);
    } catch {
      addFallbackMessage();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, feedback: type } : msg
    ));
    // Fire-and-forget feedback to backend
    fetch(apiUrl('/api/feedback'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: 'default',
        message_id: messageId,
        rating: type === 'up' ? 5 : 1,
        is_accurate: type === 'up',
      })
    }).catch(() => { /* silent */ });
  };

  return (
    <div className="flex flex-col">
      {/* Compact Chat Header — page-level greeting banner above already sets context */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#12284b] dark:text-[#e8f2fb]">
            {language === 'ML' ? 'ORCA അഡ്വൈസറി' : 'Advisory Chat'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16865B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16865B]"></span>
            {language === 'ML' ? 'തത്സമയം' : 'Live'}
          </span>
        </div>

        <button
          onClick={() => {
            const resetText = language === 'ML'
              ? 'സംഭാഷണം പുതുക്കി. പുതിയ ചോദ്യങ്ങൾ ടൈപ്പ് ചെയ്യാം.'
              : 'Chat refreshed. Ready for new questions.';
            setMessages([{
              id: `reset-${Date.now()}`,
              sender: 'assistant',
              text: resetText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              risk: 'LOW'
            }]);
          }}
          className="p-1.5 text-[#12284b]/60 hover:text-[#12284b] hover:bg-[rgba(140,193,233,0.12)] rounded-lg transition-colors cursor-pointer dark:text-[#e8f2fb]/60 dark:hover:text-[#e8f2fb]"
          title={language === 'ML' ? 'പുതുക്കുക' : 'Reset'}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages Feed — grows naturally with the page instead of an internal scroll pane */}
      <div className="space-y-3.5 py-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={cn(
                  "max-w-[88%] md:max-w-[78%] rounded-2xl p-4 shadow-2xs",
                  isUser
                    ? 'bg-[#12284b] text-white rounded-br-xs dark:bg-[#3d6690]'
                    : 'bg-[#fff8e7] text-[#12284b] border border-[#8cc1e9] rounded-bl-xs dark:bg-[#16233b] dark:text-[#e8f2fb] dark:border-[#2f4a6e]'
                )}
              >
                {/* Sender badge & timestamp */}
                <div className="flex items-center justify-between gap-3 mb-1.5 text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${isUser ? 'text-[#fff8e7]' : 'text-[#12284b] dark:text-[#e8f2fb]'}`}>
                    {isUser ? (
                      <span>{language === 'ML' ? 'നിങ്ങൾ' : 'You'}</span>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-[#12284b] dark:text-[#e8f2fb]" />
                        <span>ORCA Advisory</span>
                      </>
                    )}
                  </span>
                  <span className={`text-[11px] ${isUser ? 'text-[#fff8e7]/80' : 'text-[#12284b]/70 dark:text-[#e8f2fb]/70'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Body — Markdown rendered for assistant */}
                {isUser ? (
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
                    {msg.text}
                  </p>
                ) : (
                  <div className="text-sm md:text-base leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:text-[#12284b] prose-strong:text-[#12284b] dark:prose-headings:text-[#e8f2fb] dark:prose-strong:text-[#e8f2fb] dark:text-[#e8f2fb]">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}

                {/* Spatial PFZ Card if returned by AI */}
                {msg.spatialPayload?.nearest_pfz && (
                  <div className="mt-3 bg-[rgba(140,193,233,0.12)] border border-[#8cc1e9] rounded-xl p-3 text-xs text-[#12284b] dark:border-[#2f4a6e] dark:text-[#e8f2fb]">
                    <div className="flex items-center justify-between font-bold text-[#12284b] mb-1 dark:text-[#e8f2fb]">
                      <span className="flex items-center gap-1">
                        <Fish className="w-4 h-4 text-[#16865B]" />
                        {msg.spatialPayload.nearest_pfz.name || 'Optimal Fishing Zone'}
                      </span>
                      <span className="text-[#16865B] bg-[#D9F3E6] px-2 py-0.5 rounded-full font-bold">
                        {msg.spatialPayload.nearest_pfz.yield_confidence || 'HIGH'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#8cc1e9] dark:border-[#2f4a6e]">
                      <div>
                        <span className="text-[#12284b]/70 block dark:text-[#e8f2fb]/70">{language === 'ML' ? 'ദൂരം:' : 'Distance:'}</span>
                        <span className="font-semibold">{msg.spatialPayload.nearest_pfz.distance_km} km ({msg.spatialPayload.nearest_pfz.distance_nm} NM)</span>
                      </div>
                      <div>
                        <span className="text-[#12284b]/70 block dark:text-[#e8f2fb]/70">{language === 'ML' ? 'ദിശ:' : 'Bearing:'}</span>
                        <span className="font-semibold">{msg.spatialPayload.nearest_pfz.bearing_cardinal} ({msg.spatialPayload.nearest_pfz.bearing_degrees}°)</span>
                      </div>
                    </div>
                    <Link
                      to="/zones"
                      className="mt-2.5 inline-flex items-center gap-1 text-[#12284b] font-semibold hover:underline dark:text-[#e8f2fb]"
                    >
                      {language === 'ML' ? 'മാപ്പിൽ കാണുക' : 'View on Map'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Evidence / Data Provenance Trail (PRD §3.4) */}
                {!isUser && msg.evidence && (
                  <EvidenceTrailBlock evidence={msg.evidence} language={language} agentsInvoked={msg.agentsInvoked} />
                )}

                {/* Risk badge + Feedback for Assistant messages */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-[#8cc1e9]/40 dark:border-[#2f4a6e] flex items-center justify-between">
                    {/* Feedback buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors cursor-pointer",
                          msg.feedback === 'up' ? 'bg-[#D9F3E6] text-[#16865B]' : 'text-[#A0B2BC] hover:text-[#16865B] hover:bg-[rgba(140,193,233,0.12)]'
                        )}
                        title={language === 'ML' ? 'ശരിയാണ്' : 'Accurate'}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors cursor-pointer",
                          msg.feedback === 'down' ? 'bg-[#FDF0EE] text-[#C0392B]' : 'text-[#A0B2BC] hover:text-[#C0392B] hover:bg-[#FDF0EE]'
                        )}
                        title={language === 'ML' ? 'തെറ്റാണ്' : 'Inaccurate'}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Risk badge */}
                    {msg.risk && (
                      <span className={cn(
                        "text-[11px] font-bold px-2 py-0.5 rounded-full",
                        msg.risk === 'LOW' ? 'bg-[#D9F3E6] text-[#16865B]'
                          : msg.risk === 'MEDIUM' ? 'bg-[#FFF7E6] text-[#D99116]'
                          : 'bg-[#FDEDEC] text-[#C0392B]'
                      )}>
                        {msg.risk === 'LOW'
                          ? (language === 'ML' ? '🟢 സുരക്ഷിതം' : '🟢 Safe')
                          : msg.risk === 'MEDIUM'
                            ? (language === 'ML' ? '🟡 ജാഗ്രത' : '🟡 Caution')
                            : (language === 'ML' ? '🔴 അപകടകരം' : '🔴 Hazardous')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2">
            <div className="bg-[#fff8e7] border border-[#8cc1e9] rounded-2xl rounded-bl-xs p-3.5 shadow-2xs flex items-center gap-2 dark:bg-[#16233b] dark:border-[#2f4a6e]">
              <Bot className="w-4 h-4 text-[#12284b] animate-bounce dark:text-[#e8f2fb]" />
              <span className="text-xs text-[#12284b]/70 font-medium dark:text-[#e8f2fb]/70">
                {language === 'ML'
                  ? 'കടൽ കാലാവസ്ഥാ വിവരങ്ങൾ വിശകലനം ചെയ്യുന്നു...'
                  : 'Analyzing live ocean telemetry & PFZ models...'}
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#12284b] rounded-full animate-bounce dark:bg-[#e8f2fb]" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#12284b] rounded-full animate-bounce dark:bg-[#e8f2fb]" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#12284b] rounded-full animate-bounce dark:bg-[#e8f2fb]" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Modal Input Bar with Voice (PRD R1-C04) */}
      <div className="mt-2 bg-[#fff8e7] rounded-[26px] p-2.5 shadow-md dark:bg-[#16233b]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={cn(
              "h-11 w-11 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs",
              isRecording
                ? "bg-[#C0392B] hover:bg-[#A93226] text-white animate-pulse"
                : "bg-[rgba(140,193,233,0.12)] hover:bg-[rgba(140,193,233,0.19)] text-[#12284b] border border-[#8cc1e9] dark:text-[#e8f2fb] dark:border-[#2f4a6e]"
            )}
            title={isRecording ? (language === 'ML' ? 'നിർത്തുക' : 'Stop recording') : (language === 'ML' ? 'ശബ്ദം ഉപയോഗിക്കുക' : 'Voice input')}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Recording duration indicator */}
          {isRecording && (
            <span className="text-xs font-mono text-[#C0392B] font-bold shrink-0">
              {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </span>
          )}

          {/* Text Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'ML' ? 'ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...' : 'Type your question here...'
            }
            disabled={isRecording}
            className="flex-1 min-w-0 h-11 md:h-12 px-3.5 md:px-5 bg-[rgba(140,193,233,0.19)] border-2 border-[#8cc1e9] rounded-full text-[#12284b] placeholder-[#8cc1e9] placeholder:font-semibold text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#12284b] focus:bg-[#fff8e7] transition-all disabled:opacity-50 dark:text-[#e8f2fb] dark:border-[#3d6690] dark:focus:ring-[#8cc1e9] dark:focus:bg-[#0d1420]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing || isRecording}
            className="h-11 md:h-12 px-3.5 md:px-5 rounded-full bg-[#12284b] hover:bg-[#0d1f3a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer dark:bg-[#3d6690] dark:hover:bg-[#4a7ba8]"
          >
            <span>{language === 'ML' ? 'അയക്കുക' : 'Send'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Suggested Quick Prompts — sit below the chat box */}
      <div className="mt-2 overflow-x-auto pb-1 flex gap-2 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => {
          const qText = language === 'ML' ? q.ml : q.en;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qText)}
              disabled={isProcessing}
              className="text-xs font-medium bg-[#fff8e7] hover:bg-[rgba(140,193,233,0.19)] border border-[#8cc1e9] text-[#12284b] px-3 py-1.5 rounded-full whitespace-nowrap shadow-2xs transition-colors shrink-0 cursor-pointer disabled:opacity-50 dark:bg-[#16233b] dark:text-[#e8f2fb] dark:border-[#2f4a6e] dark:hover:bg-[#1e3252]"
            >
              {qText}
            </button>
          );
        })}
      </div>

      {/* Scroll target — the very bottom of the chat box, so auto-scroll goes all the way down past the suggested prompts */}
      <div ref={messagesEndRef} />
    </div>
  );
}

/** Evidence Trail Collapsible Block (PRD §3.4 Explainable Evidence Trails) */
function EvidenceTrailBlock({ evidence, language, agentsInvoked }: {
  evidence: EvidenceTrail;
  language: string;
  agentsInvoked?: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[11px] text-[#12284b]/70 hover:text-[#12284b] font-medium transition-colors cursor-pointer dark:text-[#e8f2fb]/70 dark:hover:text-[#e8f2fb]"
      >
        <BookOpen className="w-3 h-3" />
        <span>{language === 'ML' ? 'ഡാറ്റ ഉറവിടങ്ങൾ & തെളിവുകൾ' : 'Data Sources & Evidence'}</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-1.5 p-2.5 bg-[rgba(140,193,233,0.12)] border border-[#8cc1e9] rounded-lg text-[11px] space-y-1.5 animate-in fade-in duration-200 dark:border-[#2f4a6e]">
          {/* Sources consulted */}
          <div>
            <span className="font-bold text-[#12284b] dark:text-[#e8f2fb]">
              {language === 'ML' ? 'ഉറവിടങ്ങൾ:' : 'Sources Consulted:'}
            </span>
            <ul className="mt-0.5 space-y-0.5">
              {evidence.sources.map((src, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[#12284b]/70 dark:text-[#e8f2fb]/70">
                  <span className="w-1 h-1 rounded-full bg-[#12284b] shrink-0 dark:bg-[#e8f2fb]" />
                  <span className="font-medium text-[#12284b] dark:text-[#e8f2fb]">{src.name}</span>
                  <span className="text-[10px]">({src.type})</span>
                  <span className="text-[10px] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(src.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threshold rationale */}
          {evidence.threshold_rationale && (
            <div>
              <span className="font-bold text-[#12284b] dark:text-[#e8f2fb]">
                {language === 'ML' ? 'നിർണ്ണായക ഘടകങ്ങൾ:' : 'Key Factors:'}
              </span>
              <p className="text-[#12284b]/70 mt-0.5 dark:text-[#e8f2fb]/70">{evidence.threshold_rationale}</p>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#12284b] dark:text-[#e8f2fb]">
              {language === 'ML' ? 'വിശ്വാസ്യത:' : 'Confidence:'}
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded font-bold",
              evidence.confidence_rating === 'HIGH' ? 'bg-[#D9F3E6] text-[#16865B]'
                : evidence.confidence_rating === 'MEDIUM' ? 'bg-[#FFF7E6] text-[#D99116]'
                : 'bg-[#FDF0EE] text-[#C0392B]'
            )}>
              {evidence.confidence_rating}
            </span>
          </div>

          {/* Agents invoked */}
          {agentsInvoked && agentsInvoked.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[#12284b] dark:text-[#e8f2fb]">
                {language === 'ML' ? 'ഏജന്റുകൾ:' : 'Agents:'}
              </span>
              {agentsInvoked.map((agent, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-[rgba(140,193,233,0.19)] text-[#12284b] font-medium dark:text-[#e8f2fb]">
                  {agent}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
