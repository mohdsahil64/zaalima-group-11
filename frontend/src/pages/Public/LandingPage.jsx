import { Link } from 'react-router-dom';
import {
  HiArrowRight,
  HiSparkles,
  HiRocketLaunch,
  HiChartBarSquare,
  HiShieldCheck,
  HiUserGroup,
  HiCheckCircle,
  HiBriefcase,
  HiStar,
  HiBuildingOffice2,
  HiCpuChip,
  HiViewColumns,
} from 'react-icons/hi2';

const stats = [
  { value: '10,000+', label: 'Companies', icon: HiBuildingOffice2 },
  { value: '500K+', label: 'Applications', icon: HiBriefcase },
  { value: '60%', label: 'Faster Hiring', icon: HiRocketLaunch },
  { value: '98%', label: 'Satisfaction', icon: HiStar },
];

const features = [
  {
    icon: HiCpuChip,
    title: 'AI Resume Screening',
    desc: 'Our AI parses every resume, scores candidates against job requirements, and surfaces the best matches automatically.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: HiViewColumns,
    title: 'Visual Hiring Pipeline',
    desc: 'Move candidates through Applied → Shortlisted → Interview → Offer stages with an intuitive Kanban board.',
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/20',
  },
  {
    icon: HiChartBarSquare,
    title: 'Real-Time Analytics',
    desc: 'Track time-to-hire, source quality, funnel conversion rates, and team performance with live dashboards.',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  {
    icon: HiUserGroup,
    title: 'Multi-Portal Access',
    desc: 'Separate, tailored experiences for super admins, recruiters, and job seekers — all in one platform.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  {
    icon: HiShieldCheck,
    title: 'Enterprise Security',
    desc: 'Role-based access control, encrypted data storage, and full audit logs keep your hiring data safe.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: HiRocketLaunch,
    title: 'One-Click Apply',
    desc: "Applicants apply in seconds — upload a resume, auto-fill from LinkedIn, write a cover letter and you're done.",
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/20',
  },
];

const steps = [
  { n: '01', title: 'Post a Job', desc: 'Create a job listing with skills, salary, and requirements in under 2 minutes.' },
  { n: '02', title: 'AI Screens Candidates', desc: 'Our AI scores every application and ranks candidates by match quality.' },
  { n: '03', title: 'Review & Interview', desc: 'Move top candidates through your pipeline and schedule interviews.' },
  { n: '04', title: 'Make an Offer', desc: 'Send offer letters, track acceptances, and close your pipeline.' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Head of Talent @ Stripe',
    avatar: 'SC',
    text: "We cut our time-to-hire from 45 days to 18 days. The AI scoring alone saves our team hours of manual screening every week.",
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Engineering Manager @ Vercel',
    avatar: 'MJ',
    text: "The pipeline view is exactly what we needed. I can see where every candidate is at a glance and move them forward instantly.",
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'HR Director @ Notion',
    avatar: 'PS',
    text: "Best ATS we've used. The applicant portal is so clean that candidates actually comment on how smooth the apply process is.",
    rating: 5,
  },
];

const LandingPage = () => {
  return (
    <div className="bg-background overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        {/* Orbs */}
        <div className="orb w-[600px] h-[600px] bg-primary top-[-200px] left-[-200px]" style={{ animationDelay: '0s' }} />
        <div className="orb w-[400px] h-[400px] bg-accent bottom-[-100px] right-[-100px]" style={{ animationDelay: '4s' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-8 animate-fade-up">
            <HiSparkles className="w-3.5 h-3.5" />
            AI-Powered Applicant Tracking System
            <span className="ml-1 px-2 py-0.5 bg-primary/20 rounded-full text-[10px] font-bold">NEW</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text leading-[1.1] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            Hire the right talent,
            <br />
            <span className="text-gradient">faster & smarter</span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            The modern ATS that uses AI to screen resumes, rank candidates, and streamline your entire hiring pipeline — from job post to offer letter.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.15s' }}
          >
            <Link
              to="/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-primary shadow-glow hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              Get Started Free
              <HiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-text-secondary border border-border hover:border-border-light hover:text-text hover:bg-surface-elevated transition-all duration-200"
            >
              <HiBriefcase className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="flex items-center justify-center gap-6 mt-12 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-text-muted">
                <HiCheckCircle className="w-3.5 h-3.5 text-success" />
                {t}
              </div>
            ))}
          </div>

          {/* Hero visual — mock UI card */}
          <div
            className="mt-16 max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: '0.25s' }}
          >
            <div className="relative rounded-2xl border border-border/60 bg-surface-elevated shadow-xl overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 mx-4 py-1 px-3 bg-background rounded-lg text-[11px] text-text-muted text-center">
                  app.{' '}
                  <span className="text-primary font-medium">ats-platform.com</span>
                  /recruiter/pipeline
                </div>
              </div>

              {/* Fake pipeline content */}
              <div className="p-5 grid grid-cols-4 gap-3">
                {[
                  { label: 'Applied', count: 42, color: 'border-info', dot: 'bg-info' },
                  { label: 'Shortlisted', count: 18, color: 'border-primary', dot: 'bg-primary' },
                  { label: 'Interview', count: 7, color: 'border-warning', dot: 'bg-warning' },
                  { label: 'Offered', count: 3, color: 'border-success', dot: 'bg-success' },
                ].map((col) => (
                  <div key={col.label}>
                    <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${col.color}`}>
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="text-xs font-semibold text-text">{col.label}</span>
                      <span className="ml-auto text-xs text-text-muted bg-surface px-1.5 py-0.5 rounded-full">
                        {col.count}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[...Array(Math.min(col.count > 3 ? 3 : col.count, 3))].map((_, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-surface border border-border">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                              style={{
                                background: `linear-gradient(135deg, hsl(${(i * 60 + parseInt(col.count)) % 360}, 70%, 55%), hsl(${(i * 60 + parseInt(col.count) + 40) % 360}, 70%, 45%))`,
                              }}
                            >
                              {['JD', 'SK', 'MR', 'AP', 'TK'][i % 5]}
                            </div>
                            <div>
                              <div className="h-2 w-16 bg-surface-hover rounded skeleton-pulse" />
                            </div>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-primary"
                              style={{ width: `${60 + i * 13}%` }}
                            />
                          </div>
                          <div className="text-right text-[10px] text-text-muted mt-0.5">{60 + i * 13}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow under card */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-0" />
            <div className="h-16 bg-gradient-to-b from-primary/10 to-transparent blur-xl -mt-4 rounded-b-3xl" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative border-y border-border bg-surface/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="inline-flex w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gradient">{s.value}</p>
                <p className="text-sm text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs text-success font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto text-sm leading-relaxed">
            From job post to hired candidate in four simple steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={step.n} className="flex flex-col items-center text-center group">
              <div className="relative w-20 h-20 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-5 group-hover:border-primary/30 group-hover:shadow-glow-sm transition-all duration-300">
                <span className="text-3xl font-black text-gradient opacity-60">{step.n}</span>
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">{i + 1}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-text mb-2">{step.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative py-24 bg-surface/30 border-y border-border overflow-hidden">
        <div className="orb w-80 h-80 bg-primary top-0 right-0 opacity-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-4">
              <HiSparkles className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
              Everything you need to hire better
            </h2>
            <p className="mt-3 text-text-secondary max-w-lg mx-auto text-sm leading-relaxed">
              A complete hiring platform built for speed, intelligence, and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-border-light hover:-translate-y-1 hover:shadow-card-hover card-shimmer transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold text-text mb-2">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-xs text-warning font-medium mb-4">
            <HiStar className="w-3 h-3" /> Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
            Loved by hiring teams
          </h2>
          <p className="mt-3 text-text-secondary text-sm">
            Join thousands of companies already using our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-border-light hover:shadow-card-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <HiStar key={s} className="w-4 h-4 text-warning" />
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-surface-elevated p-12 sm:p-16 text-center">
          {/* Bg effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="orb w-64 h-64 bg-primary top-[-60px] left-[-60px] opacity-20" />
          <div className="orb w-64 h-64 bg-accent bottom-[-60px] right-[-60px] opacity-15" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-sm text-primary font-medium mb-6">
              <HiRocketLaunch className="w-4 h-4" />
              Start hiring smarter today
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-4">
              Ready to transform your hiring?
            </h2>
            <p className="text-text-secondary text-base mb-8 max-w-md mx-auto leading-relaxed">
              Join 10,000+ companies using our AI-powered ATS to find the best talent, faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-primary shadow-glow hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                Start Free Trial
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm text-text-secondary border border-border hover:border-border-light hover:text-text hover:bg-surface transition-all"
              >
                Browse Open Jobs
              </Link>
            </div>
            <p className="text-xs text-text-muted mt-5">
              No credit card required · Free 14-day trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
