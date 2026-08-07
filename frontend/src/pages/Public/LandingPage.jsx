import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiRocketLaunch, HiLightBulb, HiChartBar, HiShieldCheck } from 'react-icons/hi2';
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
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-tight">
            Hire Smarter with{' '}
            <span className="text-primary">AI-Powered</span>
            <br />
            Recruitment
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
            Streamline your entire hiring pipeline. From job posting to candidate selection, our AI-powered platform makes recruitment faster and more effective.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" size="lg">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text">Why Choose ATS?</h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            Everything you need to manage your recruitment pipeline in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card padding="lg" hover className="h-full">
                <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">
            Ready to transform your hiring?
          </h2>
          <p className="text-text-secondary mb-6 max-w-lg mx-auto">
            Join thousands of companies using our platform to find the best talent faster.
          </p>
          <Link to="/register">
            <Button size="lg">Start Hiring Today</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
