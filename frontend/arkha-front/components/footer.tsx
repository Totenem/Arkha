import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#4E4C67] text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ARKHA</h3>
            <p className="text-white/70 mb-4">AI-powered resume analysis to help you land your dream job.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="text-white/70 hover:text-white">
                  Analyze Resume
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
          &copy; {new Date().getFullYear()} ARKHA. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
