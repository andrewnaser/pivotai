"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"
import {
  ListChecks,
  CheckCircle2,
  Clock,
  MessageSquare,
  ExternalLink,
  Trash2,
  Eye,
  Heart,
  TrendingUp,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface QueuedTarget {
  id: number
  platform: string
  caption: string
  author: string
  views: number
  likes: number
  addedAt: string
  status: "pending" | "completed"
  comments: string[]
  deployedCount: number
}

const mockQueue: QueuedTarget[] = [
  {
    id: 1,
    platform: "Instagram",
    caption: "I lost 40 pounds in 3 months without giving up my favorite foods...",
    author: "@fitnessguru",
    views: 2400000,
    likes: 184000,
    addedAt: "2 hours ago",
    status: "pending",
    comments: [
      "Wait... is this actually possible? I need to know more about this. Where can I learn the full method?",
      "This literally changed everything for me. I was skeptical at first but after trying it... mind blown 🤯",
    ],
    deployedCount: 0,
  },
  {
    id: 2,
    platform: "Instagram",
    caption: "The morning routine that changed my life and made me $10K/month...",
    author: "@hustlecoach",
    views: 847000,
    likes: 42300,
    addedAt: "5 hours ago",
    status: "pending",
    comments: [
      "I've been teaching this exact framework to my clients for 2 years. Results speak for themselves.",
      "Quick question - did you have to invest money upfront or is this completely free to start?",
    ],
    deployedCount: 0,
  },
  {
    id: 3,
    platform: "Instagram",
    caption: "Why 99% of people will NEVER achieve their goals (brutal truth)",
    author: "Motivation Central",
    views: 1800000,
    likes: 96000,
    addedAt: "Yesterday",
    status: "completed",
    comments: [
      "Nobody is talking about this... and that's exactly why it works so well right now.",
      "This is exactly what I needed to hear today. Thank you for this perspective.",
    ],
    deployedCount: 2,
  },
  {
    id: 4,
    platform: "Instagram",
    caption: "POV: You discover the easiest side hustle in 2024...",
    author: "@moneymindset",
    views: 3200000,
    likes: 298000,
    addedAt: "1 hour ago",
    status: "pending",
    comments: [
      "Wait, this is actually working for people?? I need to try this asap",
      "I started this 2 weeks ago and I'm already seeing results. Check my profile for proof.",
    ],
    deployedCount: 0,
  },
]

export default function QueuePage() {
  const [queue, setQueue] = useState<QueuedTarget[]>(mockQueue)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  const markAsCompleted = (id: number) => {
    setQueue(queue.map(t =>
      t.id === id ? { ...t, status: "completed", deployedCount: t.comments.length } : t
    ))
  }

  const removeFromQueue = (id: number) => {
    setQueue(queue.filter(t => t.id !== id))
  }

  const filteredQueue = queue.filter(t => {
    if (filter === "all") return true
    return t.status === filter
  })

  const pendingCount = queue.filter(t => t.status === "pending").length
  const completedCount = queue.filter(t => t.status === "completed").length

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Target Queue</h1>
          <p className="text-muted-foreground">
            Your daily execution queue for deploying bot comments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Targets</p>
              <p className="text-2xl font-bold">{queue.length}</p>
            </div>
            <ListChecks className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{completedCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter:</span>
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({queue.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed ({completedCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <div className="space-y-4">
        {filteredQueue.length === 0 ? (
          <Card className="glass">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <ListChecks className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No targets in queue</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredQueue.map((target) => (
            <Card key={target.id} className={`glass ${target.status === "completed" ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary">{target.platform}</Badge>
                        <Badge variant={target.status === "completed" ? "success" : "warning"}>
                          {target.status === "completed" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="font-medium">{target.caption}</p>
                      <p className="text-sm text-muted-foreground">by {target.author}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromQueue(target.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {formatNumber(target.views)} views
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      {formatNumber(target.likes)} likes
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Added {target.addedAt}
                    </div>
                    {target.deployedCount > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <MessageSquare className="h-4 w-4" />
                        {target.deployedCount} deployed
                      </div>
                    )}
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Bot Comments ({target.comments.length}):</p>
                    <div className="space-y-2">
                      {target.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3"
                        >
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <p className="flex-1 text-sm">{comment}</p>
                          <CopyButton text={comment} size="icon" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    {target.status === "pending" ? (
                      <>
                        <Button
                          onClick={() => markAsCompleted(target.id)}
                          className="flex-1 sm:flex-none"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </Button>
                        <Button variant="secondary" className="flex-1 sm:flex-none">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Generate More Comments
                        </Button>
                      </>
                    ) : (
                      <Badge variant="success" className="py-2">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Deployment completed
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Target
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Tips */}
      {pendingCount > 0 && (
        <Card className="glass border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">Execution Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy your comments during peak engagement hours (6-9 AM, 12-1 PM, 6-9 PM) for maximum visibility.
                  Copy each comment, paste it on the target post, and mark the target as completed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

