"use client"

import { useState, useEffect } from "react"
import { Heart, Share2, Check } from "lucide-react"

type Props = {
  blogId: string
  initialLikes: number
  initialShares: number
  title: string
}

const STORAGE_KEY = "arkha_liked_blogs"

function getLikedBlogs(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

function addLikedBlog(id: string) {
  const liked = getLikedBlogs()
  if (!liked.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...liked, id]))
  }
}

export default function BlogPostClient({ blogId, initialLikes, initialShares, title }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [shares, setShares] = useState(initialShares)
  const [hasLiked, setHasLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHasLiked(getLikedBlogs().includes(blogId))
  }, [blogId])

  const handleLike = async () => {
    if (hasLiked) return
    setLikes((n) => n + 1)
    setHasLiked(true)
    addLikedBlog(blogId)
    await fetch(`/api/blogs/${blogId}/like`, { method: "POST" })
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    await fetch(`/api/blogs/${blogId}/share`, { method: "POST" })
    setShares((n) => n + 1)
  }

  return (
    <div className="flex items-center gap-6 py-6 border-t border-gray-100 mt-8">
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          hasLiked
            ? "text-[#985F6F] cursor-default"
            : "text-gray-400 hover:text-[#985F6F]"
        }`}
      >
        <Heart className={`h-5 w-5 transition-all ${hasLiked ? "fill-[#985F6F] scale-110" : ""}`} />
        {likes} {likes === 1 ? "like" : "likes"}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#4E4C67] transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-5 w-5" />
            {shares} {shares === 1 ? "share" : "shares"}
          </>
        )}
      </button>
    </div>
  )
}
