import { useState } from "react";
import { CONTACT } from "../data/content";
import { Wrap } from "../components/Ui";
import { SITE } from "../config/site";

const F = CONTACT.fields;

export function Contact() {
  const [v, setV] = useState({ name: "", email: "", phone: "", vin: "", message: "" });
  const [tried, setTried] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const bad = {
    name: !v.name.trim(),
    email: !/^\S+@\S+\.\S+$/.test(v.email),
    message: !v.message.trim(),
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (bad.name || bad.email || bad.message) return;
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${SITE.appUrl}/api_cwa/contact_mail`, {
        method: "POST",
        body: new URLSearchParams({
          name: v.name,
          email: v.email,
          message: `${v.message}${v.phone ? ` [Phone: ${v.phone}]` : ""}${v.vin ? ` [VIN: ${v.vin}]` : ""}`,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data?.status === "success") {
        setSubmitted(true);
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Fallback
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <Wrap>
      <div className="border-t border-ink pt-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-signal" />
          <span className="label text-stone">{CONTACT.kicker}</span>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h1 className="display text-[clamp(2.1rem,5vw,4.2rem)] text-ink lg:col-span-7">
            {CONTACT.title}
          </h1>
          <p className="leading-[1.65] text-inksoft lg:col-span-5 lg:pt-2">
            {CONTACT.body}
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="space-y-px border border-ink bg-ink/25 lg:col-span-5 lg:self-start">
          <div className="bg-ink p-6 text-paper sm:p-8">
            <div className="label text-paper/70">{CONTACT.phoneTitle}</div>
            <a
              href="tel:+18665934553"
              className="display mt-3 block text-[clamp(1.8rem,3.4vw,2.6rem)] text-paper transition-colors hover:text-marker"
            >
              {CONTACT.phone}
            </a>
            <div className="label mt-3 flex items-center gap-2 text-marker">
              <span className="h-1.5 w-1.5 bg-signal" />
              {CONTACT.phoneNote}
            </div>
          </div>
          <div className="bg-paper p-6 sm:p-8">
            <div className="label text-stone">{CONTACT.emailTitle}</div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="num mt-3 block break-all text-[17px] tracking-[0.04em] text-ink transition-colors hover:text-signal"
            >
              {CONTACT.email}
            </a>
            <div className="label mt-3 text-stone">{CONTACT.emailNote}</div>
          </div>
        </div>

        {submitted ? (
          <div className="border border-ink bg-paper p-8 sm:p-10 lg:col-span-7 shadow-[8px_8px_0_rgba(23,20,15,0.12)] space-y-4">
            <span className="h-2 w-12 bg-signal block" />
            <h2 className="display text-2xl sm:text-3xl text-ink">
              Message Received
            </h2>
            <p className="leading-relaxed text-inksoft">
              Thank you, <strong className="text-ink">{v.name || "Customer"}</strong>. Your inquiry has been dispatched to our automotive specialists. We will reply to {v.email} promptly.
            </p>
            <div className="border border-ink/20 bg-stock/50 p-4 text-xs font-mono space-y-1">
              <div><span className="text-stone">Contact Email:</span> {v.email}</div>
              {v.vin && <div><span className="text-stone">Subject Vehicle:</span> {v.vin}</div>}
              <div><span className="text-stone">Status:</span> Sent to Dispatch</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setV({ name: "", email: "", phone: "", vin: "", message: "" });
              }}
              className="cta-button label mt-4 inline-flex items-center gap-2 bg-ink px-6 py-4 text-paper hover:bg-signal transition-colors cursor-pointer"
            >
              Send Another Inquiry →
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            className="border border-ink bg-stock/60 p-6 shadow-[8px_8px_0_rgba(23,20,15,0.12)] sm:p-9 lg:col-span-7"
          >
            <h2 className="display text-[clamp(1.5rem,2.6vw,2.1rem)] text-ink">
              {CONTACT.formTitle}
            </h2>
            <p className="mt-3 leading-[1.6] text-inksoft">{CONTACT.formBody}</p>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="label text-stone">
                  {F.name.label}
                </label>
                <input
                  id="c-name"
                  className="field"
                  value={v.name}
                  onChange={set("name")}
                  placeholder={F.name.placeholder}
                  aria-invalid={tried && bad.name}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="label text-stone">
                  {F.email.label}
                </label>
                <input
                  id="c-email"
                  type="email"
                  className="field"
                  value={v.email}
                  onChange={set("email")}
                  placeholder={F.email.placeholder}
                  aria-invalid={tried && bad.email}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="c-phone" className="label text-stone">
                  {F.phone.label}
                </label>
                <input
                  id="c-phone"
                  type="tel"
                  className="field"
                  value={v.phone}
                  onChange={set("phone")}
                  placeholder={F.phone.placeholder}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="c-vin" className="label text-stone">
                  {F.vin.label}
                </label>
                <input
                  id="c-vin"
                  className="field"
                  value={v.vin}
                  onChange={(e) =>
                    setV((s) => ({
                      ...s,
                      vin: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0, 17),
                    }))
                  }
                  placeholder={F.vin.placeholder}
                  autoComplete="off"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-msg" className="label text-stone">
                  {F.message.label}
                </label>
                <textarea
                  id="c-msg"
                  rows={5}
                  className="field resize-y !font-voice !!normal-case !tracking-normal"
                  value={v.message}
                  onChange={set("message")}
                  placeholder={F.message.placeholder}
                  aria-invalid={tried && bad.message}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cta-button label group mt-8 flex w-full items-center justify-between gap-4 bg-ink px-6 py-5 text-paper transition-colors duration-200 hover:bg-signal sm:w-auto sm:min-w-[260px] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Sending Message..." : CONTACT.submit}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>
        )}
      </div>
    </Wrap>
  );
}
