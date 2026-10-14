import { useState } from "react";
import { PRICING, type Plan } from "../data/content";
import { SITE } from "../config/site";
import { Reveal } from "./Ui";
import { useNav } from "../nav";
import { Lock, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export function PlanCard({ plan, delay = 0, onSelect }: { plan: Plan; delay?: number; onSelect: () => void }) {
  const featured = Boolean(plan.badge);
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`flex h-full flex-col p-6 sm:p-8 ${
          featured ?"bg-ink text-paper" :"bg-paper text-ink"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`display leading-[1.1] sm:${
              featured ?"text-paper" :"text-ink"
            }`}
          >
            {plan.name}
          </h3>
          {plan.badge && (
            <span className="label shrink-0 bg-signal px-2 py-1 text-paper">
              {plan.badge}
            </span>
          )}
        </div>

        {plan.rate && (
          <div
            className={`num mt-2 text-[17px] tracking-[0.1em] ${
              featured ?"text-marker" :"text-signal"
            }`}
          >
            {plan.rate}
          </div>
        )}

        {plan.tagline && (
          <p
            className={`mt-3 leading-[1.55] ${
              featured ?"text-paper/75" :"text-inksoft"
            }`}
          >
            {plan.tagline}
          </p>
        )}
        {plan.body && (
          <p
            className={`mt-3 leading-[1.55] ${
              featured ?"text-paper/80" :"text-inksoft"
            }`}
          >
            {plan.body}
          </p>
        )}

        <div
          className={`mt-7 border-t pt-5 ${
            featured ?"border-paper/35" :"border-ink/25"
          }`}
        >
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <span
              className={`display text-[clamp(2.6rem,5vw,3.4rem)] leading-[0.9] ${
                featured ?"text-paper" :"text-ink"
              }`}
            >
              {plan.price}
            </span>
            {plan.unit && (
              <span
                className={`label pb-1.5 ${
                  plan.unit.startsWith("/") ?"" :"ml-1"
                } ${featured ?"text-paper/70" :"text-stone"}`}
              >
                {plan.unit}
              </span>
            )}
          </div>
        </div>

        {plan.features && (
          <ul className="mt-6 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-[9px] h-1.5 w-1.5 shrink-0 ${
                    featured ?"bg-marker" :"bg-signal"
                  }`}
                />
                <span
                  className={`leading-[1.45] ${
                    featured ?"text-paper/85" :"text-inksoft"
                  }`}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div aria-hidden="true" className="h-8 shrink-0" />
        <button
          type="button"
          onClick={onSelect}
          className={`label mt-auto flex w-full items-center justify-between gap-3 px-5 py-4 transition-colors duration-200 ${
            featured
              ? "plan-cta-featured cta-button bg-paper text-ink hover:bg-signal hover:text-paper"
              : "plan-cta-standard bg-ink text-paper hover:bg-signal"
          }`}
        >
          {plan.cta}
          <span aria-hidden="true">→</span>
        </button>
      </article>
    </Reveal>
  );
}

export function PricingNotes() {
  return (
    <div className="mt-8 grid gap-px border border-ink bg-ink/25 sm:grid-cols-3">
      {PRICING.notes.map((n, i) => (
        <div
          key={n.title}
          className="bg-paper p-5 transition-colors duration-200 hover:bg-stock/80 sm:p-6"
        >
          <span className="num text-[10px] tracking-[0.2em] text-signal">
            {String(i + 1).padStart(2,"0")}
          </span>
          <h4 className="display mt-2.5 text-[16px] leading-[1.25] text-ink sm:text-[17px]">
            {n.title}
          </h4>
          <p className="mt-2 leading-[1.55] text-inksoft">{n.body}</p>
        </div>
      ))}
    </div>
  );
}

export function CheckoutModal({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const [vin, setVin] = useState("2T1BURHE0FC320645");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [simulateMode, setSimulateMode] = useState(false);
  const [orderId] = useState(() => `DBS-${Math.floor(100000 + Math.random() * 900000)}`);
  const { go, openReport } = useNav();

  const isValidEmail = /^\S+@\S+\.\S+$/.test(email.trim());

  const handleProceedToCheckout = () => {
    if (!isValidEmail || isProcessing) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsProcessing(true);
    setError("");

    try {
      const fields = [
        { name: "email", value: email.trim() },
        { name: "cart_plan", value: plan.code || plan.id },
        { name: "vin", value: "CREDIT" },
        { name: "phone", value: "" },
        { name: "user_type", value: "user" },
        { name: "payment_gateway", value: "default" },
      ];
      const bytes = new TextEncoder().encode(JSON.stringify(fields));
      const newData = btoa(String.fromCharCode(...bytes));
      const wpPage = window.location.pathname.replace(/^\/+|\/+$/g, "").replace(/\.html$/, "") || "home";
      const checkoutType = plan.checkoutType || (plan.kind === "report" ? "vhr" : "sticker");
      const params = new URLSearchParams({ "new-data": newData, wpPage, type: checkoutType });
      window.location.href = `${SITE.url}/members/checkout?${params.toString()}`;
    } catch {
      setIsProcessing(false);
      setError("Unable to initialize checkout redirect. Try the simulated order below.");
    }
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsProcessing(true);
    setError("");

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1100);
  };

  const modalTitle = plan.checkoutType === "sticker" || plan.kind === "sticker"
    ? "Get Your Sticker"
    : "Get Your Report";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-ink/75 p-3 sm:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-[560px] border border-ink bg-paper shadow-[12px_12px_0_rgba(23,20,15,0.3)] text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/20 bg-stock/50 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-signal shrink-0" />
            <div>
              <span className="label text-[10px] text-signal block leading-none">
                256-Bit SSL Encrypted Checkout
              </span>
              <h3 className="display text-[17px] text-ink leading-tight mt-0.5">
                {modalTitle} — {plan.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center border border-ink/40 text-lg hover:bg-ink hover:text-paper transition-colors"
            aria-label="Close checkout"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7">
          {!isSuccess ? (
            <div className="space-y-5">
              {/* Order summary box */}
              <div className="flex items-center justify-between border border-ink/20 bg-stock/40 p-3.5">
                <div>
                  <span className="display text-sm text-ink block">{plan.name}</span>
                  {plan.badge && (
                    <span className="label text-[9.5px] bg-signal text-paper px-1.5 py-0.5 inline-block mt-0.5">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="display text-xl text-ink">{plan.price}</span>
                  <span className="label text-[10.5px] text-stone block">{plan.unit || "one-time"}</span>
                </div>
              </div>

              {error && (
                <div className="border border-red-500/50 bg-red-500/10 p-3 text-red-600 text-xs">
                  {error}
                </div>
              )}

              {/* Enter Email input matching Oct13_Final */}
              <div>
                <label className="label text-stone block mb-1.5 font-bold">
                  Enter Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (!simulateMode ? handleProceedToCheckout() : undefined)}
                  placeholder="Enter Your Email"
                  className="field w-full"
                  autoFocus
                  required
                />
              </div>

              {simulateMode && (
                <form onSubmit={handleSimulatePayment} className="space-y-4 border-t border-ink/20 pt-4 animate-in fade-in">
                  <div>
                    <label className="label text-stone block mb-1.5 font-bold">Vehicle VIN</label>
                    <input
                      type="text"
                      value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())}
                      placeholder="e.g. 2T1BURHE0FC320645"
                      className="field w-full font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="label text-stone block mb-1.5 font-bold">Demo Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="field w-full font-mono text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="cta-button label flex w-full items-center justify-between gap-3 bg-signal px-5 py-4 text-paper transition-all hover:bg-ink disabled:opacity-60 cursor-pointer"
                  >
                    <span>{isProcessing ? "Processing..." : `Simulate Payment ${plan.price}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {!simulateMode && (
                <div>
                  {/* Primary CTA button matching Oct13_Final */}
                  <button
                    id="btn-proceed-checkout"
                    type="button"
                    onClick={handleProceedToCheckout}
                    disabled={!isValidEmail || isProcessing}
                    className="cta-button label flex w-full items-center justify-between gap-3 bg-signal px-6 py-4.5 text-paper transition-all hover:bg-ink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                  >
                    <span>{isProcessing ? "Processing..." : "Proceed to Checkout"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-3">
                    <p className="text-[12px] leading-relaxed text-inksoft">
                      By selecting &ldquo;Proceed to Checkout&rdquo; you are confirming that you have read and agree to{" "}
                      {SITE.name}&apos;s{" "}
                      <button type="button" onClick={() => { onClose(); go("terms"); }} className="text-signal underline hover:text-ink">
                        Terms of Use
                      </button>{" "}
                      and{" "}
                      <button type="button" onClick={() => { onClose(); go("privacy"); }} className="text-signal underline hover:text-ink">
                        Privacy Policy
                      </button>
                      .
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-ink/15 text-center">
                    <button
                      type="button"
                      onClick={() => setSimulateMode(true)}
                      className="text-[11.5px] text-stone hover:text-signal underline cursor-pointer"
                    >
                      Or test in-browser simulated order flow
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Success confirmation screen */
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="display text-2xl text-ink">
                  Report Successfully Generated!
                </h3>
                <p className="text-sm text-inksoft max-w-sm mx-auto">
                  Your certified vehicle record for VIN <span className="font-mono font-bold text-ink">{vin}</span> has been decoded and saved to your account.
                </p>
              </div>

              <div className="p-4 border border-ink/20 bg-stock/40 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone">Order ID:</span>
                  <span className="font-bold text-ink">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Package:</span>
                  <span className="font-bold text-ink">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone">Status:</span>
                  <span className="font-bold text-emerald-600">Paid &amp; Delivered</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openReport(vin);
                  }}
                  className="cta-button label flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 text-paper hover:bg-signal transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Certified Report Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="label w-full border border-ink/40 py-2.5 text-ink hover:bg-stock transition-colors cursor-pointer"
                >
                  Return to Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanGrid({ plans }: { plans: Plan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const cols = plans.length === 4 ?"lg:grid-cols-4 sm:grid-cols-2" :"lg:grid-cols-3";
  return (
    <>
      <div className={`grid gap-px border border-ink bg-ink/25 ${cols}`}>
        {plans.map((p, i) => (
          <PlanCard key={p.name} plan={p} delay={i * 0.07} onSelect={() => setSelectedPlan(p)} />
        ))}
      </div>
      {selectedPlan && (
        <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </>
  );
}

export { PlanGrid as PricingGrid };
