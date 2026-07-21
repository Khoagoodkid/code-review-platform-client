import { GitHubLoginButton } from "./GitHubLoginButton";

const features = [
  {
    title: "AI-assisted reviews",
    description: "Surface risks, style issues, and improvement suggestions automatically.",
  },
  {
    title: "GitHub-native workflow",
    description: "Connect your repositories and review pull requests where you already work.",
  },
  {
    title: "Actionable feedback",
    description: "Turn review comments into clear, merge-ready guidance for your team.",
  },
];

export function LoginPage() {
  return (
    <div className="relative flex min-h-dvh w-full flex-1 flex-col bg-[#070b14] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_38%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col lg:min-h-dvh lg:flex-row">
        <section className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LLM-powered code review
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Ship better code with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              smarter reviews
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
            Analyze pull requests faster, catch issues earlier, and keep your team
            aligned with AI-assisted feedback built for modern engineering teams.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-300">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-zinc-100">{feature.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-sky-500/10">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-indigo-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Sign in to start reviewing pull requests with AI-assisted insights.
              </p>
            </div>

            <GitHubLoginButton />

            <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
              We only use GitHub OAuth to authenticate your account. No passwords
              stored.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
