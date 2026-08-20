import { Link } from 'react-router-dom';
import { HiRocketLaunch, HiLightBulb, HiChartBar, HiShieldCheck, HiArrowRight } from 'react-icons/hi2';
import { Button, Card } from '@/components/common';

const features = [
  {
    icon: HiRocketLaunch,
    title: 'Fast Hiring',
    description: 'Reduce time-to-hire by 60% with AI-powered candidate screening and automated workflows.',
  },
  {
    icon: HiLightBulb,
    title: 'Smart Matching',
    description: 'AI algorithms match candidates to jobs based on skills, experience, and cultural fit.',
  },
  {
    icon: HiChartBar,
    title: 'Data Insights',
    description: 'Track key metrics and gain insights to continuously improve your hiring process.',
  },
  {
    icon: HiShieldCheck,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with role-based access and data protection compliance.',
  },
];

const LandingPage = () => {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-text-secondary mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          AI-Powered Recruitment Platform
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-[1.15] tracking-tight">
          Hire the right talent,
          <br />
          <span className="text-gradient">faster and smarter</span>
        </h1>

        <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-text-secondary leading-relaxed">
          Streamline your entire hiring pipeline from job posting to offer. Our AI analyzes candidates, ranks matches, and helps you make better decisions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg" icon={HiArrowRight} iconPosition="right">
              Get Started Free
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="secondary" size="lg">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">Why teams choose us</h2>
          <p className="mt-2 text-sm text-text-muted max-w-md mx-auto">
            Everything you need to manage your recruitment pipeline in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} padding="lg" hover className="group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text mb-1">{feature.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight mb-3">
              Ready to transform your hiring?
            </h2>
            <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
              Join companies using our platform to find the best talent faster.
            </p>
            <Link to="/register">
              <Button size="lg">Start Hiring Today</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
