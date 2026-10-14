import { useState } from "react";
import { LOGIN } from "../data/content";
import { useNav } from "../nav";
import { SITE } from "../config/site";

export function Login() {
  const { lookup, go } = useNav();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [tried, setTried] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!email || !pw) return;
    setIsLoggedIn(true);
  };

  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {isLoggedIn ? (
          <div className="mx-auto w-full max-w-[520px] border border-ink bg-paper p-8 shadow-[10px_10px_0_rgba(23,20,15,0.14)] sm:p-10 space-y-5">
            <span className="block h-2 w-14 bg-emerald-500" />
            <h1 className="display text-2xl sm:text-3xl text-ink">
              Welcome Back!
            </h1>
            <p className="leading-relaxed text-inksoft text-sm">
              Authenticated as <strong className="text-ink">{email}</strong>. You have <strong>2 unused report credits</strong> available in your account.
            </p>
            <div className="border border-ink/20 bg-stock/40 p-4 text-xs font-mono space-y-1.5">
              <div><span className="text-stone">Session Status:</span> Active &amp; Verified</div>
              <div><span className="text-stone">Account Type:</span> Registered Member</div>
              <div><span className="text-stone">Member Portal:</span> {SITE.domain}</div>
            </div>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => go("sample")}
                className="cta-button label flex w-full items-center justify-between gap-3 bg-ink px-6 py-4.5 text-paper hover:bg-signal transition-colors cursor-pointer"
              >
                <span>Browse Saved Reports</span>
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={lookup}
                className="label flex w-full items-center justify-between gap-3 border border-ink px-6 py-4 text-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
              >
                <span>Run New VIN Lookup</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto w-full max-w-[520px] border border-ink bg-stock/60 p-7 shadow-[10px_10px_0_rgba(23,20,15,0.14)] sm:p-10"
          >
            <span className="block h-2 w-14 bg-signal" />
            <h1 className="display mt-6 text-[clamp(1.9rem,4vw,2.8rem)] text-ink">
              {LOGIN.title}
            </h1>
            <p className="mt-4 leading-[1.55] text-inksoft">{LOGIN.body}</p>

            <div className="mt-9 space-y-7">
              <div>
                <label htmlFor="l-email" className="label text-stone">
                  {LOGIN.email.label}
                </label>
                <input
                  id="l-email"
                  type="email"
                  className="field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={LOGIN.email.placeholder}
                  aria-invalid={tried && !email}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="l-pw" className="label text-stone">
                  {LOGIN.password.label}
                </label>
                <input
                  id="l-pw"
                  type="password"
                  className="field"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder={LOGIN.password.placeholder}
                  aria-invalid={tried && !pw}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="cta-button label group mt-9 flex w-full items-center justify-between gap-4 bg-ink px-6 py-5 text-paper transition-colors duration-200 hover:bg-signal cursor-pointer"
            >
              {LOGIN.submit}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              type="button"
              onClick={lookup}
              className="label mt-3 flex w-full items-center justify-between gap-4 border border-ink px-6 py-5 text-ink transition-colors duration-200 hover:bg-ink hover:text-paper cursor-pointer"
            >
              {LOGIN.alt}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

