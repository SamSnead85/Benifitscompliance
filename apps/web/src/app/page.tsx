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

// Animation variants
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

// Animated counter component
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
    <div className="min-h-screen bg-[#050508]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Synapse</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-sm text-[#94A3B8] hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Sign in</Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/90 transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        {/* Subtle gradient accent - NOT purple */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge - Minimal, no gradient */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-[#94A3B8] mb-8"
          >
            <Activity className="w-3 h-3 text-white" />
            <span>AI-Native Compliance Platform</span>
          </motion.div>

          {/* Headline - Clean, no gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 text-white"
          >
            ACA Compliance,
            <br />
            <span className="text-[#94A3B8]">Fully Automated</span>
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

          {/* CTAs - Clean, minimal buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/90 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              Schedule Demo
            </Link>
          </motion.div>

          {/* Trust Indicators - Minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-16 text-xs text-[#475569]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>IRS Approved</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Clean, institutional */}
      <section className="py-24 px-6 border-t border-white/5">
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
                <div className="text-4xl md:text-5xl font-semibold text-white mb-2 font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#64748B] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Premium Cards */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
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
                className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                    <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Data Pipeline Visualization - Clean */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
              Watch Your Data Transform
            </h2>
            <p className="text-[#64748B] text-lg">
              Real-time visibility into every stage of the compliance pipeline.
            </p>
          </motion.div>

          {/* Pipeline Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-between gap-4 p-8 bg-white/[0.01] rounded-2xl border border-white/5"
          >
            {['Raw Data', 'Normalized', 'Validated', 'Compliant'].map((stage, i) => (
              <div key={i} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${i === 2 ? 'bg-white/10 border border-white/20' : 'bg-white/5 border border-white/5'
                    }`}
                >
                  <div className="text-2xl font-semibold text-white font-mono mb-1">{(i + 1) * 248}</div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider">{stage}</div>
                </motion.div>
                {i < 3 && (
                  <div className="flex-1 mx-4 h-px bg-gradient-to-r from-white/10 to-white/5" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portal Gateway - Minimal */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
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
                  className="flex flex-col items-center p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all group"
                >
                  <portal.icon className="w-6 h-6 text-white mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-sm font-medium">{portal.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#475569] mt-2 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">
              Ready to Automate Compliance?
            </h2>
            <p className="text-[#64748B] text-lg mb-8">
              Join leading brokers and TPAs who trust Synapse to manage ACA compliance for over 500,000 employees.
            </p>
            <Link
              href="/onboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-medium text-white">Synapse</span>
          </div>
          <div className="text-sm text-[#475569]">
            © 2026 Synapse Health Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
