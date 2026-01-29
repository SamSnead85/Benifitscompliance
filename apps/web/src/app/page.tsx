'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Users,
  TrendingUp,
  ChevronRight,
  Activity,
  BarChart3,
  Layers
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="font-mono"
    >
      {value.toLocaleString()}{suffix}
    </motion.span>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation - Light with subtle shadow */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#0F172A] tracking-tight">Synapse</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Pricing</Link>
            <Link href="#about" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Sign in</Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] transition-colors shadow-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-gradient-to-b from-white to-[#F1F5F9]">
        {/* Subtle gradient accent */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 60%)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-xs text-[#64748B] mb-8 shadow-sm"
          >
            <Activity className="w-3 h-3 text-[#0D9488]" />
            <span>AI-Native Compliance Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 text-[#0F172A]"
          >
            ACA Compliance,
            <br />
            <span className="text-[#0D9488]">Fully Automated</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-12"
          >
            Transform messy HR data into compliant IRS filings. No manual entry. No service bureaus. Just intelligent automation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] transition-colors shadow-md"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              Schedule Demo
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-16 text-xs text-[#64748B]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>IRS Approved</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: 90, suffix: '%', label: 'Cost Reduction' },
              { value: 99.7, suffix: '%', label: 'Filing Accuracy' },
              { value: 500, suffix: 'K+', label: 'Employees Managed' },
              { value: 24, suffix: '/7', label: 'AI Monitoring' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-semibold text-[#0D9488] mb-2 font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#64748B] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4 tracking-tight">
              The AI Data Refinery
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Four specialized agents work in concert to transform raw HR data into audit-ready compliance.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-4"
          >
            {[
              {
                icon: Activity,
                title: 'Connector Agent',
                description: 'Integrates with Gusto, Rippling, ADP, and custom HRIS. Ingests data via API or secure file upload.'
              },
              {
                icon: Layers,
                title: 'Normalization Agent',
                description: 'AI-powered field mapping transforms disparate source data into your canonical model with confidence scoring.'
              },
              {
                icon: Shield,
                title: 'Compliance Agent',
                description: 'Applies ACA rules to determine FTE status, affordability, and penalty risk with full IRS code citations.'
              },
              {
                icon: FileCheck,
                title: 'Reporter Agent',
                description: 'Generates IRS Forms 1094-C and 1095-C in PDF format, ready for electronic filing.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0F172A] mb-2">{feature.title}</h3>
                    <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pipeline Visualization */}
      <section className="py-24 px-6 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4 tracking-tight">
              Watch Your Data Transform
            </h2>
            <p className="text-[#64748B] text-lg">
              Real-time visibility into every stage of the compliance pipeline.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-between gap-4 p-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]"
          >
            {['Raw Data', 'Normalized', 'Validated', 'Compliant'].map((stage, i) => (
              <div key={i} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${i === 2 ? 'bg-[#0D9488]/10 border-2 border-[#0D9488]' : 'bg-white border border-[#E2E8F0]'} shadow-sm`}
                >
                  <div className={`text-2xl font-semibold font-mono mb-1 ${i === 2 ? 'text-[#0D9488]' : 'text-[#0F172A]'}`}>{(i + 1) * 248}</div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider">{stage}</div>
                </motion.div>
                {i < 3 && (
                  <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-[#0D9488] to-[#0D9488]/30 rounded" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portal Gateway */}
      <section className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F172A] mb-4 tracking-tight">
              Built for Your Role
            </h2>
            <p className="text-[#64748B] text-lg">
              Purpose-built experiences for every stakeholder in the compliance chain.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { icon: Users, label: 'Broker', href: '/dashboard' },
              { icon: Shield, label: 'TPA', href: '/dashboard' },
              { icon: TrendingUp, label: 'Employer', href: '/dashboard' },
              { icon: BarChart3, label: 'Admin', href: '/dashboard' }
            ].map((portal, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Link
                  href={portal.href}
                  className="flex flex-col items-center p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0D9488] hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#1E3A5F] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <portal.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[#0F172A] text-sm font-medium">{portal.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] mt-2 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#1E3A5F]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">
              Ready to Automate Compliance?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Join leading brokers and TPAs who trust Synapse to manage ACA compliance for over 500,000 employees.
            </p>
            <Link
              href="/onboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#1E3A5F] bg-white rounded-lg hover:bg-[#F8FAFC] transition-colors shadow-md"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-medium text-[#0F172A]">Synapse</span>
          </div>
          <div className="text-sm text-[#64748B]">
            © 2026 Synapse Health Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
