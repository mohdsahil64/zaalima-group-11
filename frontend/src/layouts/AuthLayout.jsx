import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/common';
import { APP_NAME } from '@/constants';
import {
  HiSparkles,
  HiCheckBadge,
  HiChartBarSquare,
  HiBoltSlash,
  HiUserGroup,
} from 'react-icons/hi2';

const features = [
  {
    icon: HiSparkles,
    title: 'AI-Powered Screening',
    desc: 'Automatically score and rank candidates using advanced AI analysis.',
  },
  {
    icon: HiChartBarSquare,
    title: 'Visual Pipeline',
    desc: 'Drag candidates through stages with real-time Kanban tracking.',
  },
  {
    icon: HiUserGroup,
    title: 'Multi-Role Access',
    desc: 'Separate portals for admins, recruiters, and job seekers.',
  },
  {
    icon: HiCheckBadge,
    title: 'One-Click Apply',
    desc: 'Applicants apply instantly with resume parsing and smart forms.',
  },
];

const stats = [
  { value: '10k+', label: 'Companies' },
  { value: '500k+', label: 'Applications' },
  { value: '98%', label: 'Satisfaction' },
];

const AuthLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (isAuthenticated) {
    const roleRoutes = {
      recruiter: '/recruiter/dashboard',
      applicant: '/applicant/dashboard',
      super_admin: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[user?.role] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] relative overflow-hidden flex-col">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0C1E] via-[#0F0F20] to-[#080810]" />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Animated orbs */}
        <div className="orb w-96 h-96 bg-primary top-[-80px] left-[-80px]" style={{ animationDelay: '0s' }} />
        <div className="orb w-72 h-72 bg-accent bottom-[-40px] right-[-40px]" style={{ animationDelay: '3s' }} />
        <div className="orb w-48 h-48 bg-info top-1/2 right-20" style={{ animationDelay: '6s', opacity: 0.08 }} />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">{APP_NAME[0]}</span>
            </div>
            <span className="text-lg font-bold text-text tracking-tight">{APP_NAME}</span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center mt-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-6 w-fit animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Trusted by 10,000+ companies worldwide
            </div>

            <h1
              className="text-3xl xl:text-4xl font-bold text-text leading-[1.15] tracking-tight mb-5 animate-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              Hire the best talent,{' '}
              <span className="text-gradient">faster & smarter</span>
            </h1>

            <p
              className="text-text-secondary text-sm leading-relaxed mb-10 max-w-sm animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              The modern ATS that helps you find, screen, and hire top candidates — powered by AI and designed for speed.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 animate-fade-up"
                  style={{ animationDelay: `${0.25 + i * 0.07}s` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{f.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-8 pt-8 border-t border-border/50 animate-fade-up"
            style={{ animationDelay: '0.55s' }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-gradient">{s.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 bg-background relative">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[420px] relative animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold">{APP_NAME[0]}</span>
            </div>
            <span className="text-base font-bold text-text">{APP_NAME}</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
