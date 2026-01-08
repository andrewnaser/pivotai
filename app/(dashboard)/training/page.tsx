"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react"

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    question: "How do I create my first money link?",
    answer: "Go to Step 1: Create Money Link. Paste your affiliate link (the one you got from ClickBank, WarriorPlus, etc.) and give it a name. Click create and you're done! Put that link in your Instagram bio.",
    category: "Getting Started",
  },
  {
    question: "Where do I get an affiliate link?",
    answer: "You get affiliate links from platforms like ClickBank, WarriorPlus, Digistore24, or any company with an affiliate program. Sign up as an affiliate, and they'll give you a unique link. When someone buys through your link, you earn money!",
    category: "Getting Started",
  },
  {
    question: "How do I find viral posts to comment on?",
    answer: "Go to Step 2: Find Viral Posts. Type a keyword like 'fitness' or 'make money online' and click Find Posts. We'll show you popular posts with lots of views. Click the checkbox on posts you like and click Save.",
    category: "Finding Posts",
  },
  {
    question: "What makes a post good to comment on?",
    answer: "Look for posts with 10,000+ views and marked as 'Worth Commenting On'. These posts are getting lots of traffic, so more people will see your comment and click your profile.",
    category: "Finding Posts",
  },
  {
    question: "How do I generate comments?",
    answer: "Go to Step 3: Copy Comments. Paste the post's caption, pick a style (we recommend 'Curious'), and click Generate. We'll write perfect comments for you - just copy and paste them!",
    category: "Creating Comments",
  },
  {
    question: "Which comment style should I use?",
    answer: "For beginners, use 'Curious' - it works best! It makes people curious about what you're doing, so they check your profile and click your bio link. You can try others later for variety.",
    category: "Creating Comments",
  },
  {
    question: "How fast should I post comments?",
    answer: "Post within the first 2 hours of a post going viral! Early comments get the most visibility. The longer you wait, the less people will see your comment.",
    category: "Best Practices",
  },
  {
    question: "How many comments should I post per day?",
    answer: "Start with 10-20 comments per day. More comments = more chances for people to see your profile. Top users post 50+ comments daily, but start small and build up.",
    category: "Best Practices",
  },
  {
    question: "When will I make my first sale?",
    answer: "Most users see their first sale within 1-7 days. It depends on how many comments you post, which posts you comment on, and what you're promoting. Keep commenting daily for best results!",
    category: "Making Money",
  },
  {
    question: "How much money can I make?",
    answer: "Most users make $500-$2,000/month. Top users who comment consistently make $5,000+/month. Your earnings depend on how active you are and what affiliate offers you promote.",
    category: "Making Money",
  },
  {
    question: "Will Instagram ban me for commenting?",
    answer: "Not if you follow these rules: 1) Don't spam the same comment everywhere 2) Rotate between different comment styles 3) Don't post more than 60 comments per day 4) Make sure comments match the post topic.",
    category: "Staying Safe",
  },
  {
    question: "My comments aren't getting clicks. Why?",
    answer: "Try these: 1) Comment on posts with MORE views 2) Use the 'Curious' style 3) Comment within 2 hours of the post 4) Make sure your Instagram profile looks legit (profile pic, bio, some posts).",
    category: "Troubleshooting",
  },
]

const categories = ["All", "Getting Started", "Finding Posts", "Creating Comments", "Best Practices", "Making Money", "Staying Safe", "Troubleshooting"]

export default function TrainingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredFAQs = selectedCategory === "All" ? faqs : faqs.filter((faq) => faq.category === selectedCategory)

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">💡 Help & Training</h1>
        <p className="text-gray-300 text-lg">
          Quick answers to common questions - find what you need fast!
        </p>
      </div>

      {/* Category Filter */}
      <Card className="glass-strong border-2 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "secondary"}
                size="sm"
                className={
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold"
                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, index) => (
          <Card
            key={index}
            className="glass-strong border-2 border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <CardHeader className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <HelpCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{faq.question}</h3>
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                      {faq.category}
                    </span>
                  </div>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </div>
            </CardHeader>
            {openIndex === index && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Video Section */}
      <Card className="glass-strong border-2 border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-purple-500" />
            Video Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border-2 border-white/10 mb-4">
            <div className="text-center">
              <PlayCircle className="h-20 w-20 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 font-bold text-lg">How to Make Your First $1,000</p>
              <p className="text-gray-400 text-sm mt-2">Step-by-step video walkthrough</p>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Full Training Video
          </Button>
        </CardContent>
      </Card>

      {/* Still Confused? */}
      <Card className="glass-strong border-2 border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-yellow-500/20 p-3 shrink-0">
              <MessageSquare className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-bold text-yellow-400 text-lg">Still Confused or Stuck?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Can't find the answer you're looking for? We're here to help! Our support team responds within 24 hours.
              </p>
              <Button variant="secondary" size="sm" className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-bold">
                <ExternalLink className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
