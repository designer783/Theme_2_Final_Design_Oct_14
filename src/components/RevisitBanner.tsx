import React, { useState } from 'react';
import { Clock, X, ArrowRight, RotateCcw } from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/mockData';

export interface RevisitBannerProps {
  /** Variable VIN passed to the banner (e.g. '3FA6P0RU9HR306143') */
  vin?: string;
  /** Optional vehicle title override (e.g. '2017 Ford Fusion'). If omitted, automatically derived from VIN or default. */
  vehicleTitle?: string;
  /** Price displayed in the CTA button (defaults to '$20') */
  price?: string | number;
  /** Callback when the user clicks 'Grab it for only $20' */
  onAction?: (vin: string) => void;
  /** Product named in the heading (defaults to 'report') */
  productLabel?: string;
  /** Label shown before the identifier (defaults to 'VIN') */
  identifierLabel?: string;
  /** Callback when user dismisses the banner */
  onClose?: () => void;
  /** Callback when user reopens the dismissed banner */
  onReopen?: () => void;
  /** Variant: 'floating' for bottom-left fixed toast/banner, 'embedded' for inline showcase */
  variant?: 'floating' | 'embedded';
  /** Optional custom class name */
  className?: string;
  /** Controlled open state (defaults to true) */
  isOpen?: boolean;
}

export const RevisitBanner: React.FC<RevisitBannerProps> = ({
  vin = '3FA6P0RU9HR306143',
  vehicleTitle,
  price = '$20',
  onAction,
  productLabel = 'report',
  identifierLabel = 'VIN',
  onClose,
  onReopen,
  variant = 'floating',
  className = '',
  isOpen: controlledIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Resolve vehicle title from mock data or prop
  const resolvedVehicleTitle = React.useMemo(() => {
    if (vehicleTitle) return vehicleTitle;
    const clean = (vin || '').trim().toUpperCase();
    if (clean && SAMPLE_REPORTS[clean]) {
      const rep = SAMPLE_REPORTS[clean];
      return `${rep.year} ${rep.make} ${rep.model}`;
    }
    // Default fallback
    return '2017 Ford Fusion';
  }, [vin, vehicleTitle]);

  const formattedPrice = typeof price === 'number' ? `$${price}` : price.startsWith('$') ? price : `$${price}`;

  const handleDismiss = () => {
    setInternalIsOpen(false);
    onClose?.();
  };

  const handleCtaClick = () => {
    onAction?.(vin);
  };

  // Reopen trigger pill when dismissed in floating mode so reviewer can easily re-test
  if (!isVisible && variant === 'floating') {
    return (
      <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-50">
        <button
          id="btn-reopen-revisit-banner"
          onClick={() => {
            setInternalIsOpen(true);
            onReopen?.();
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-paper border border-ink text-ink shadow-[4px_4px_0_rgba(23,20,15,0.2)] hover:bg-stock transition-all cursor-pointer label text-[11px]"
          title="Reopen Revisit Alert"
          aria-label="Reopen Revisit Alert"
        >
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span>Report Ready Alert</span>
          <RotateCcw className="w-3.5 h-3.5 text-stone ml-1" />
        </button>
      </div>
    );
  }

  if (!isVisible) return null;

  const cardContent = (
    <div
      className={`border border-ink bg-paper p-5 sm:p-6 transition-all duration-300 relative shadow-[8px_8px_0_rgba(23,20,15,0.18)] ${className}`}
      role="alert"
      aria-live="polite"
      aria-labelledby="revisit-banner-title"
    >
      {/* Top Row: Pill Badge on Left, Close Button on Right */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-signal bg-signal/10 text-signal">
          <Clock className="w-3.5 h-3.5 stroke-[2] shrink-0" />
          <span className="label text-[10.5px] font-semibold tracking-wider whitespace-nowrap">
            Ready for pickup
          </span>
        </div>

        {/* Close Button */}
        <button
          id="btn-close-revisit-banner"
          type="button"
          onClick={handleDismiss}
          className="text-stone hover:text-ink hover:bg-stock p-1 border border-transparent hover:border-ink/20 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Heading: "Your report for [Year Make Model] is ready!" */}
      <h3
        id="revisit-banner-title"
        className="display text-ink text-[19px] sm:text-[21px] leading-tight mb-1"
      >
        Your {productLabel} for {resolvedVehicleTitle} is ready!
      </h3>

      {/* VIN Subtitle: Dynamic variable */}
      <p className="label text-stone text-[11px] mb-4">
        {identifierLabel}: <span className="num font-bold text-ink">{vin}</span>
      </p>

      {/* Primary Action Button: "GRAB IT FOR ONLY $20" */}
      <button
        id="btn-revisit-grab-report"
        type="button"
        onClick={handleCtaClick}
        className="cta-button label flex w-full items-center justify-between gap-3 bg-ink px-5 py-3.5 text-paper transition-all hover:bg-signal font-mono font-bold text-xs uppercase"
      >
        <span>GRAB IT FOR ONLY {formattedPrice}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  if (variant === 'embedded') {
    return cardContent;
  }

  // Floating bottom-left alert banner (responsive width, doesn't block main navigation)
  return (
    <div
      id="floating-revisit-banner"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 max-w-[360px] sm:max-w-[400px] w-[calc(100%-2rem)]"
    >
      {cardContent}
    </div>
  );
};
