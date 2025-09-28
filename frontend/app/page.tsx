import Link from "next/link"
import { ArrowRight, FileText, BarChart2, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FeatureCard from "@/components/feature-card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DCD6F7] to-[#A6B1E1] py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#4E4C67] mb-6">Optimize Your Resume for Job Success</h1>
          <p className="text-lg md:text-xl text-[#4E4C67]/80 mb-8 max-w-3xl mx-auto">
            ARKHA analyzes your resume against job descriptions to provide match scores and personalized improvement
            suggestions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-[#985F6F] hover:bg-[#B4869F] text-white">
              <Link href="/analyze">
                Analyze Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-[#4E4C67] text-[#4E4C67] hover:bg-[#4E4C67]/10">
              Learn More
            </Button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#B4869F]/20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#A6B1E1]/30 blur-xl"></div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4E4C67] mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#DCD6F7] flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#4E4C67]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4E4C67] mb-2">Upload Resume</h3>
              <p className="text-[#4E4C67]/70">
                Upload your resume PDF and paste the job description you're applying for.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#A6B1E1] flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 text-[#4E4C67]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4E4C67] mb-2">Get Analysis</h3>
              <p className="text-[#4E4C67]/70">
                Our AI analyzes your resume against the job requirements and calculates a match score.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#B4869F] flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#4E4C67] mb-2">Improve</h3>
              <p className="text-[#4E4C67]/70">
                Receive personalized suggestions to improve your resume and increase your chances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#F8F8FC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4E4C67] mb-4">Features</h2>
          <p className="text-center text-[#4E4C67]/70 mb-12 max-w-3xl mx-auto">
            ARKHA provides comprehensive resume analysis to help you land your dream job.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="PDF Text Extraction"
              description="Automatically extract text from your resume PDF with high accuracy."
              icon="FileText"
              color="#A6B1E1"
            />
            <FeatureCard
              title="Information Extraction"
              description="Extract key information like skills, education, and experience from your resume."
              icon="ListFilter"
              color="#B4869F"
            />
            <FeatureCard
              title="Job Description Matching"
              description="Compare your resume against job descriptions to calculate a match percentage."
              icon="Percent"
              color="#985F6F"
            />
            <FeatureCard
              title="Improvement Suggestions"
              description="Get actionable suggestions to improve your resume for specific job applications."
              icon="Lightbulb"
              color="#4E4C67"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-[#4E4C67] to-[#985F6F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Optimize Your Resume?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Start analyzing your resume now and increase your chances of landing that dream job.
          </p>
          <Button asChild size="lg" className="bg-white text-[#4E4C67] hover:bg-white/90">
            <Link href="/analyze">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
