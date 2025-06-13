"use client"

import { useState } from "react"
import { User, Mail, Phone, GraduationCap, Briefcase, Code, XCircle } from "lucide-react"
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
      technical_skills: {
        programming: string[]
        design: string[]
      }
      work_experience: Array<{
        company: string
        position: string
        responsibilities: string[]
      }>
    }
    score: string
    improvements: string[]
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
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
                  <Code className="h-5 w-5 text-[#4E4C67] mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Top Skills</div>
                    <div className="font-medium">
                      {(results.important_info.technical_skills?.programming ?? []).slice(0, 3).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#4E4C67] mb-4">Top Improvement Suggestions</h3>
              <ul className="space-y-2">
                {results.improvements.slice(0, 3).map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="h-5 w-5 text-[#985F6F] mr-2 flex-shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
              {results.improvements.length > 3 && (
                <Button variant="link" className="text-[#985F6F] p-0 mt-2" onClick={() => setActiveTab("improvements")}>
                  View all suggestions
                </Button>
              )}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="education">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {results.important_info.education.map((edu, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="font-medium">{edu.school}</div>
                      <div>{edu.degree}</div>
                      <div className="text-sm text-gray-500">{edu.duration}</div>
                      {edu.relevant_coursework && (
                        <div className="mt-2">
                          <div className="text-sm font-medium">Relevant Coursework:</div>
                          <div className="text-sm text-gray-600">{edu.relevant_coursework.join(", ")}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="experience">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Work Experience
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {results.important_info.work_experience.map((exp, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="font-medium">{exp.position}</div>
                      <div>{exp.company}</div>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {(exp.responsibilities ?? []).map((responsibility, i) => (
                          <li key={i}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="skills">
                <AccordionTrigger className="text-[#4E4C67]">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Technical Skills
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-4">
                    <div className="font-medium mb-2">Programming Languages & Technologies</div>
                    <div className="flex flex-wrap gap-2">
                      {(results.important_info.technical_skills?.programming ?? []).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#DCD6F7]/30 text-[#4E4C67] rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Tools & Platforms</div>
                    <div className="flex flex-wrap gap-2">
                      {(results.important_info.technical_skills?.design ?? []).map((tool, index) => (
                        <span key={index} className="px-3 py-1 bg-[#A6B1E1]/30 text-[#4E4C67] rounded-full text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
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
      </div>
    </div>
  )
}
