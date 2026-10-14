import React, { useEffect, useState } from 'react';
import { MessageSquareText, X, ExternalLink, Headphones, Loader2 } from 'lucide-react';
import { SITE } from '../config/site';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  useEffect(() => {
    // Listen for custom open event triggered from buttons across the site
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-live-chat', handleOpen);
    return () => window.removeEventListener('open-live-chat', handleOpen);
  }, []);

  const handleToggleChat = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).LiveChatWidget) {
        (window as any).LiveChatWidget.call('maximize');
      }
    } catch {
      // Continue with embedded dialog
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      id="custom-livechat-bottom-right"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[65] flex flex-col items-end"
    >
      {/* Live Chat Dialogue Box */}
      {isOpen && (
        <div
          id="livechat-dialogue-box"
          role="dialog"
          aria-label="Live Chat Support"
          className="mb-3 w-[calc(100vw-32px)] sm:w-[390px] h-[540px] max-h-[calc(100vh-100px)] bg-paper rounded-sm shadow-2xl border border-ink overflow-hidden flex flex-col transition-all duration-200"
        >
          {/* Header */}
          <div className="bg-ink text-paper px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-ink/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-signal/20 border border-signal/40 text-signal">
                <Headphones className="w-4 h-4 text-signal" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-ink" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-paper leading-none">
                    Live Chat Support
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-stone mt-1 leading-none">
                  Automotive specialists ready to help
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Pop out to full window */}
              <a
                href={SITE.liveChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in standalone window"
                className="p-1.5 text-paper/70 hover:text-paper hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              {/* Close dialogue box */}
              <button
                id="btn-close-livechat-dialog"
                onClick={() => setIsOpen(false)}
                title="Close chat dialogue box"
                className="p-1.5 text-paper/70 hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Frame Content */}
          <div className="relative flex-1 w-full h-full bg-stock/50 overflow-hidden">
            {isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper gap-3 text-stone z-10">
                <Loader2 className="w-7 h-7 text-signal animate-spin" />
                <span className="label text-[11px]">Connecting to Live Chat Agent...</span>
              </div>
            )}
            <iframe
              id="livechat-iframe"
              src={SITE.liveChatUrl}
              title="Live Chat Support Window"
              onLoad={() => setIsLoadingIframe(false)}
              className="w-full h-full border-0"
              allow="microphone; camera; clipboard-write; autoplay"
            />
          </div>
        </div>
      )}

      {/* Floating Action Launcher Button & Tooltip */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <div
            className={`hidden sm:flex items-center gap-2 bg-ink text-paper px-3 py-1.5 text-[11px] font-mono uppercase shadow-lg border border-ink/40 transition-all duration-300 pointer-events-none select-none ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-85 translate-x-1'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat With Us</span>
          </div>
        )}

        <button
          id="btn-livechat-launcher"
          onClick={handleToggleChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={isOpen ? "Close Live Chat" : "Open Live Chat"}
          aria-expanded={isOpen}
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full text-paper shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-2 ${
            isOpen
              ? 'bg-ink border-paper shadow-lg'
              : 'bg-signal border-paper shadow-signal/40 hover:shadow-2xl'
          }`}
        >
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-paper" />
            </span>
          )}

          {isOpen ? (
            <X className="w-5 h-5 text-paper transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <MessageSquareText className="w-5 h-5 text-paper transition-transform duration-200 group-hover:scale-110" />
          )}
        </button>
      </div>
    </div>
  );
};
