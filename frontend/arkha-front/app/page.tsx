import Link from "next/link"
import {
  ArrowRight,
  FileText,
  BarChart2,
  BrainCircuit,
  FileDown,
  CheckCircle2,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FeatureCard from "@/components/feature-card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#DCD6F7] via-[#A6B1E1]/60 to-[#B4869F]/40 py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-16 left-8 w-40 h-40 rounded-full bg-[#B4869F]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 right-12 w-56 h-56 rounded-full bg-[#A6B1E1]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#DCD6F7]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#4E4C67]/10 text-[#4E4C67] text-sm font-medium mb-6">
            Free · 20 analyses per month
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#4E4C67] mb-6 leading-tight">
            Land Your Dream Job with{" "}
            <span className="text-[#985F6F]">AI-Powered</span>{" "}
            Resume Intelligence
          </h1>
          <p className="text-lg md:text-xl text-[#4E4C67]/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            ARKHA analyzes your resume against any job description, scores your match, generates a
            tailored Harvard-style Resme, writes your cover letter, and finds real job listings —
            all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-[#985F6F] hover:bg-[#B4869F] text-white px-8 shadow-md">
              <Link href="/auth/signup">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10 px-8">
              <Link href="/find-jobs">
                Browse Jobs <Search className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#F8F8FC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4E4C67] mb-4">Everything You Need</h2>
          <p className="text-center text-[#4E4C67]/70 mb-12 max-w-2xl mx-auto">
            A complete toolkit for job seekers — from resume analysis to job discovery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FeatureCard
              title="Resume Match Score"
              description="AI compares your resume to any job description and gives you a percentage match so you know exactly where you stand."
              icon="Percent"
              color="#A6B1E1"
            />
            <FeatureCard
              title="AI Resume Optimization"
              description="Our AI rewrites your resume content to target the specific role — emphasizing the right keywords, skills, and experience."
              icon="BrainCircuit"
              color="#985F6F"
            />
            <FeatureCard
              title="Harvard-Style Resume Export"
              description="Download your optimized resume as a clean, professional Harvard-style PDF — formatted and ready to send to employers."
              icon="FileDown"
              color="#4E4C67"
            />
            <FeatureCard
              title="Cover Letter Generator"
              description="Automatically generate a tailored, professional cover letter based on your resume and the job description."
              icon="Mail"
              color="#B4869F"
            />
            <FeatureCard
              title="Find Jobs on OnlineJobs.ph"
              description="Search thousands of real job listings from OnlineJobs.ph filtered by type — full-time, part-time, and gig work."
              icon="Search"
              color="#A6B1E1"
            />
            <FeatureCard
              title="Analyze Any Job Listing"
              description="See how well your resume matches any job you find — directly from the search results, without leaving the page."
              icon="ListFilter"
              color="#985F6F"
            />
          </div>
        </div>
      </section>

      {/* ── Free Plan Highlight ── */}
      {/* <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#DCD6F7] bg-gradient-to-br from-[#F8F8FC] to-[#DCD6F7]/30 p-10 text-center shadow-sm">
            <span className="inline-block px-3 py-1 rounded-full bg-[#985F6F]/10 text-[#985F6F] text-xs font-semibold tracking-wide uppercase mb-4">
              Free Plan
            </span>
            <h2 className="text-3xl font-bold text-[#4E4C67] mb-4">Start for Free. No Card Required.</h2>
            <p className="text-[#4E4C67]/70 mb-8 text-lg">
              Create a free account and get 20 resume analyses and 20 optimizations every month.
              Resets on the 1st — every month.
            </p>

            <ul className="inline-flex flex-col gap-3 text-left mb-8">
              {[
                "20 AI resume analyses per month",
                "20 Harvard-style PDF optimizations per month",
                "Unlimited cover letter generation",
                "Unlimited job search on OnlineJobs.ph",
                "Resets automatically on the 1st of each month",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#4E4C67]">
                  <CheckCircle2 className="h-4 w-4 text-[#985F6F] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="bg-[#985F6F] hover:bg-[#B4869F] text-white px-10 shadow-md">
              <Link href="/auth/signup">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section> */}

      {/* ── CTA ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-[#4E4C67] to-[#985F6F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Next Job Starts Here
          </h2>
          <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
            Stop guessing. Know exactly how your resume matches every job and get an optimized
            version in minutes — for free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#4E4C67] hover:bg-white/90 px-8 font-semibold shadow-md">
              <Link href="/auth/signup">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-8">
              <Link href="/auth/login">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
