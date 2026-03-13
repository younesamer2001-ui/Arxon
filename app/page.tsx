'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { goldRgb } from '@/lib/constants'
import { LiveToast } from '@/app/components/landing/LiveToast'
import { HeroSection } from '@/app/components/landing/HeroSection'
import { TrustBarSection } from '@/app/components/landing/TrustBarSection'
import { PainAgitationSection } from '@/app/components/landing/PainAgitationSection'
import { BeforeAfterSection } from '@/app/components/landing/BeforeAfterSection'
import { BentoGridSection } from '@/app/components/landing/BentoGridSection'
import { ProductDemoSection } from '@/app/components/landing/ProductDemoSection'
import { IndustriesSection } from '@/app/components/landing/IndustriesSection'
import { HowItWorksSection } from '@/app/components/landing/HowItWorksSection'
import { AuthoritySection } from '@/app/components/landing/AuthoritySection'
import { ROICalculatorSection } from '@/app/components/landing/ROICalculatorSection'
import { FAQSection } from '@/app/components/landing/FAQSection'
import { FinalCTASection } from '@/app/components/landing/FinalCTASection'

export default function Home() {
  const [showSticky, setShowSticky] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Parallax for hero */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScrollY } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroTextY = useTransform(heroScrollY, [0, 1], [0, 100])
  const heroOpacity = useTransform(heroScrollY, [0, 0.6], [1, 0])

  return (
    <>
      <Nav />

      <HeroSection heroRef={heroRef} heroTextY={heroTextY} heroOpacity={heroOpacity} />
      <TrustBarSection />
      <PainAgitationSection />
      <BeforeAfterSection />
      <BentoGridSection />
      <ProductDemoSection />
      <IndustriesSection />
      <HowItWorksSection />
      <AuthoritySection />
      <ROICalculatorSection />
      <FAQSection />
      <FinalCTASection />

      <Footer />

      {/* ── Sticky mobile CTA ── */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden"
            style={{ background: `rgba(5,5,16,0.92)`, borderTop: `1px solid rgba(${goldRgb},0.15)`, backdropFilter: 'blur(12px)' }}>
            <Link href="/kartlegging" className="gold-btn w-full rounded-lg py-3 text-[14px] font-bold text-center block" style={{ textDecoration: 'none' }}>
              Start kartlegging
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveToast />

      <style>{`
        /* ── Global animations ── */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 192, 123, 0.3); }
          50% { box-shadow: 0 0 40px rgba(239, 192, 123, 0.6); }
        }

        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0; }
        }

        @keyframes gradient-mesh {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes orb {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, 40px); }
        }

        @keyframes orb-accent {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-60px, -40px) scale(1.2); }
        }

        /* ── Hero section ── */

        /* ── Typography ── */
        .text-gradient-gold {
          background: linear-gradient(90deg, #efc07b, #ffd699, #efc07b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .anim-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }

        .anim-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        /* ── Cards ── */
        .glass-card {
          background: rgba(13, 26, 45, 0.4);
          border: 1px solid rgba(244, 241, 235, 0.06);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .bento-card {
          background: rgba(13, 26, 45, 0.3);
          border: 1px solid rgba(239, 192, 123, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .bento-card:hover {
          border-color: rgba(239, 192, 123, 0.25);
          background: rgba(13, 26, 45, 0.5);
          transform: translateY(-4px);
        }

        .bento-card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(239, 192, 123, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .bento-card:hover .bento-card-glow {
          opacity: 1;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ── Buttons ── */
        .gold-btn {
          background: linear-gradient(135deg, #efc07b 0%, #ffd699 100%);
          color: #050510;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .gold-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(239, 192, 123, 0.25);
        }

        .gold-btn:active {
          transform: translateY(0);
        }

        .gold-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          width: 100%;
          height: 100%;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }

        .gold-btn:hover::after {
          transform: translateX(100%);
        }

        .gold-btn-pulse {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        .cta-shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #efc07b 0%, #ffd699 100%);
        }

        .cta-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
          transform: skewX(-20deg);
          animation: shimmerSweep 4s infinite 2s;
        }

        @keyframes shimmerSweep {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        /* ── Divider ── */
        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(239, 192, 123, 0.2), transparent);
          margin: 0 auto;
          width: 80%;
          max-width: 600px;
        }

        /* ── CTA Glow ── */
        .cta-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(239, 192, 123, 0.1), transparent);
          filter: blur(100px);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        /* ── Hover effects ── */
        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
        }

        .industry-pill {
          transition: all 0.2s;
        }

        .industry-pill:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(244, 241, 235, 0.12) !important;
          transform: translateY(-2px);
        }

        /* ── Demo frames ── */
        .demo-phone-frame {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 9/16;
          background: linear-gradient(135deg, #0a1629 0%, #162a47 100%);
          border: 1px solid rgba(239, 192, 123, 0.1);
          border-radius: 40px;
          overflow: hidden;
          margin: 0 auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .demo-phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 28px;
          background: #020614;
          border-radius: 0 0 20px 20px;
          z-index: 10;
        }

        .demo-phone-header {
          background: rgba(15, 27, 39, 0.95);
          padding-top: 8px;
        }

        .demo-phone-body {
          height: calc(100% - 80px);
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .demo-msg {
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          max-width: 85%;
          word-wrap: break-word;
        }

        .demo-msg-system {
          background: rgba(76, 175, 80, 0.1);
          color: #4ade80;
          border: 1px solid rgba(76, 175, 80, 0.2);
          align-self: center;
          font-size: 11px;
          max-width: 90%;
        }

        .demo-msg-ai {
          background: rgba(239, 192, 123, 0.1);
          color: rgba(244, 241, 235, 0.85);
          border-left: 3px solid rgba(239, 192, 123, 0.3);
          align-self: flex-start;
        }

        .demo-msg-customer {
          background: rgba(59, 130, 246, 0.15);
          color: rgba(244, 241, 235, 0.85);
          border-right: 3px solid rgba(59, 130, 246, 0.4);
          align-self: flex-end;
        }

        .demo-typing {
          display: flex;
          gap: 4px;
          padding: 12px;
        }

        .demo-dot {
          width: 6px;
          height: 6px;
          background: rgba(239, 192, 123, 0.4);
          border-radius: 50%;
          animation: float 1.4s infinite;
        }

        .demo-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .demo-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* ── Workflow Demo ── */
        .demo-workflow-frame {
          background: linear-gradient(135deg, #0a1629 0%, #162a47 100%);
          border: 1px solid rgba(239, 192, 123, 0.1);
          border-radius: 16px;
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .demo-workflow-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(244, 241, 235, 0.08);
          color: #f4f1eb;
        }

        .demo-workflow-live {
          margin-left: auto;
          font-size: 10px;
          font-weight: bold;
          padding: 4px 8px;
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 4px;
          letter-spacing: 1px;
          animation: pulse 2s ease-in-out infinite;
        }

        .demo-workflow-steps {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 16px;
        }

        .demo-workflow-step-row {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .demo-workflow-connector {
          position: relative;
          height: 20px;
          margin-left: 32px;
          margin-bottom: -4px;
        }

        .demo-workflow-connector-fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 100%;
          border-radius: 1px;
          transition: height 0.4s ease;
        }

        .demo-workflow-step {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: rgba(244, 241, 235, 0.02);
          border: 1px solid rgba(244, 241, 235, 0.08);
          border-radius: 8px;
          margin-left: 20px;
          transition: all 0.3s ease;
        }

        .demo-workflow-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .demo-workflow-footer {
          position: relative;
          height: 40px;
          background: rgba(244, 241, 235, 0.02);
          border: 1px solid rgba(244, 241, 235, 0.08);
          border-radius: 8px;
          overflow: hidden;
        }

        .demo-workflow-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          border-radius: 1px;
          transition: width 0.4s ease;
        }

        /* ── Mobile-first overrides ── */
        @media (max-width: 767px) {
          .bento-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .bento-card .relative.z-10 {
            padding: 16px 18px;
          }

          .glass-card {
            border-radius: 10px;
          }

          .demo-phone-frame {
            max-width: 260px;
            border-radius: 30px;
          }

          .demo-workflow-frame {
            padding: 14px;
          }

          .cta-glow {
            width: 300px;
            height: 300px;
          }
        }

        /* ── Accessibility ── */
        @media (prefers-reduced-motion: reduce) {
          .gold-btn::after { transition: none; }
          .gold-btn:hover { transform: none; }
          .gold-btn-pulse { animation: none !important; }
          .bento-card:hover { transform: none; }
          .glass-card:hover { transform: none; }
          .hover-lift:hover { transform: none; }
          .anim-spin-slow { animation: none !important; }
          .anim-gradient-shift { animation: none !important; }
          .industry-pill:hover { transform: none; }
          .demo-dot { animation: none !important; }
          .demo-workflow-live { animation: none !important; }
          .hero-live-dot { animation: none !important; }
          .hero-cursor { animation: none !important; }
          .hero-typing-dot { animation: none !important; }
        }
      `}</style>
    </>
  )
}
