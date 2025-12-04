"use client"

import { useState } from "react"
import {Captions, Languages, Mail, Phone, Star, User, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ResultsDisplayProps {
  results: {
    extraction_message: string
    important_info: {
      name: string
      email: string
      phone_number: string
      education: Array<{
        school: string
        degree: string
        duration: string
        relevant_coursework?: string[]
      }>
      skills: string[]
      languages: string[]
      licenses: Array<string | { license: string }>
      work_experience: Array<{
        company: string
        position: string
        date: string
        description: string[]
      }>
    }
    score: string
    cover_letter: string
    improvements: string[]
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(results.cover_letter)
      .then(() => alert("Cover letter copied to clipboard!"))
      .catch(() => alert("Failed to copy cover letter."));
  }
  
  const [activeTab, setActiveTab] = useState("overview")
  const scoreValue = Number.parseInt(results.score.replace(/\D/g, ""))

  return (
    <div>
      {/* Header with score */}
      <div className="bg-gradient-to-r from-[#4E4C67] to-[#985F6F] text-white p-6 rounded-t-xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Resume Analysis Results</h2>
            <p className="text-white/80">{results.extraction_message}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center">
            <div className="text-4xl font-bold">{results.score}</div>
            <div className="text-sm text-white/80">Match Score</div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "overview"
                ? "border-[#985F6F] text-[#985F6F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "details"
                ? "border-[#985F6F] text-[#985F6F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Resume Details
          </button>
          <button
            onClick={() => setActiveTab("improvements")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "improvements"
                ? "border-[#985F6F] text-[#985F6F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Improvements
          </button>
          <button
            onClick={() => setActiveTab("coverLetter")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "coverLetter"
                ? "border-[#985F6F] text-[#985F6F]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Cover Letter
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#4E4C67] mb-2">Match Score</h3>
              <div className="bg-gray-100 rounded-full h-4 mb-2">
                <div
                  className="h-4 rounded-full"
                  style={{
                    width: `${scoreValue}%`,
                    background: `linear-gradient(to right, ${scoreValue < 50 ? "#985F6F" : "#B4869F"}, ${scoreValue < 50 ? "#B4869F" : "#A6B1E1"})`,
                  }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">
                {scoreValue < 50
                  ? "Your resume needs significant improvements to match this job description."
                  : scoreValue < 75
                    ? "Your resume partially matches the job description with room for improvement."
                    : "Your resume is a good match for this job description!"}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#4E4C67] mb-4">Key Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-[#DCD6F7]/20 rounded-lg">
                  <User className="h-5 w-5 text-[#4E4C67] mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{results.important_info.name}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-[#DCD6F7]/20 rounded-lg">
                  <Mail className="h-5 w-5 text-[#4E4C67] mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{results.important_info.email}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-[#DCD6F7]/20 rounded-lg">
                  <Phone className="h-5 w-5 text-[#4E4C67] mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{results.important_info.phone_number}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-[#DCD6F7]/20 rounded-lg">
                  <Star className="h-5 w-5 text-[#4E4C67] mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Top Skills</div>
                    <div className="font-medium">
                      {Array.isArray(results.important_info.skills)
                        ? results.important_info.skills.slice(0, 3).join(", ")
                        : Object.values(results.important_info.skills ?? {})
                            .flat()
                            .slice(0, 3)
                            .join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* In the details tab, update the skills section: */}
            <Accordion type="single" collapsible>
              <AccordionItem value="skills">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Skills
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                  {Array.isArray(results.important_info.skills)
                    ? (results.important_info.skills ?? []).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#DCD6F7]/30 text-[#4E4C67] rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    : Object.entries(results.important_info.skills ?? {}).flatMap(([category, skills]) =>
                        (skills as string[]).map((skill, index) => (
                          <span key={`${category}-${index}`} className="px-3 py-1 bg-[#DCD6F7]/30 text-[#4E4C67] rounded-full text-sm">
                            {skill}
                          </span>
                        ))
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="languages">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Languages
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {(results.important_info.languages ?? []).map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-[#A6B1E1]/30 text-[#4E4C67] rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="licenses">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Captions className="h-5 w-5 mr-2" />
                    Licenses & Certifications
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                  {(results.important_info.licenses ?? []).map((license, index) => {
                      const text = typeof license === "string" ? license : license.license || "Unknown License"
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#B4869F]/30 text-[#4E4C67] rounded-full text-sm"
                        >
                          {text}
                        </span>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {activeTab === "details" && (
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="skills">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Skills
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                  {Array.isArray(results.important_info.skills)
                    ? (results.important_info.skills ?? []).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#DCD6F7]/30 text-[#4E4C67] rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    : Object.entries(results.important_info.skills ?? {}).flatMap(([category, skills]) =>
                        (skills as string[]).map((skill, index) => (
                          <span key={`${category}-${index}`} className="px-3 py-1 bg-[#DCD6F7]/30 text-[#4E4C67] rounded-full text-sm">
                            {skill}
                          </span>
                        ))
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="languages">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Languages
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {(results.important_info.languages ?? []).map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-[#A6B1E1]/30 text-[#4E4C67] rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="licenses">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Captions className="h-5 w-5 mr-2" />
                    Licenses & Certifications
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                  {(results.important_info.licenses ?? []).map((license, index) => {
                      const text = typeof license === "string" ? license : license.license || "Unknown License"
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#B4869F]/30 text-[#4E4C67] rounded-full text-sm"
                        >
                          {text}
                        </span>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {activeTab === "improvements" && (
          <div>
            <h3 className="text-lg font-medium text-[#4E4C67] mb-4">Improvement Suggestions</h3>
            <div className="space-y-4">
              {results.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:border-[#B4869F]/50 transition-colors"
                >
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-[#985F6F] mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#4E4C67]">Improvement {index + 1}</div>
                      <div className="text-gray-600 mt-1">{improvement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "coverLetter" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#4E4C67]">Generated Cover Letter</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-[#985F6F] text-[#985F6F] hover:bg-[#985F6F]/10"
              >
                Copy to Clipboard
              </Button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-white whitespace-pre-wrap text-gray-700 leading-relaxed">
              {results.cover_letter}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
