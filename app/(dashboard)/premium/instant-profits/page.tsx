"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"
import {
  Rocket,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Sparkles,
  UserPlus,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react"

interface Influencer {
  id: number
  name: string
  platform: string
  niche: string
  followers: string
  engagement: string
  status: "contacted" | "replied" | "promoting" | "cold"
  lastContact?: string
  notes: string
}

const mockInfluencers: Influencer[] = [
  {
    id: 1,
    name: "Sarah Fitness",
    platform: "Instagram",
    niche: "Fitness",
    followers: "184K",
    engagement: "4.2%",
    status: "replied",
    lastContact: "2 days ago",
    notes: "Interested in fitness offers. Waiting on commission details.",
  },
  {
    id: 2,
    name: "MoneyMindset Mike",
    platform: "Instagram",
    niche: "Make Money Online",
    followers: "428K",
    engagement: "6.8%",
    status: "promoting",
    lastContact: "1 week ago",
    notes: "Currently promoting. Driving solid conversions.",
  },
  {
    id: 3,
    name: "Dating Coach Dan",
    platform: "Instagram",
    niche: "Dating",
    followers: "92K",
    engagement: "3.1%",
    status: "contacted",
    lastContact: "5 days ago",
    notes: "Cold outreach sent. No response yet.",
  },
]

const outreachTemplates = [
  {
    id: 1,
    type: "Cold DM",
    template: "Hey [Name]! Love your content on [topic]. I help creators like you monetize through affiliate partnerships. Mind if I share an opportunity?",
  },
  {
    id: 2,
    type: "Warm DM",
    template: "Hey [Name], saw you're already promoting in the [niche] space. I've got a high-converting offer that pays [X]% commission. Want details?",
  },
  {
    id: 3,
    type: "Follow-up",
    template: "Hey [Name], following up on my previous message about the [niche] partnership. Still interested? Happy to share proof of what others are earning.",
  },
]

const scalingPlaybooks = [
  {
    id: 1,
    title: "0 to 100 Comments/Day",
    description: "Systematically scale from beginner to power user",
    steps: 5,
  },
  {
    id: 2,
    title: "Instagram Domination",
    description: "Deploy consistently on Instagram with a simple daily routine",
    steps: 4,
  },
  {
    id: 3,
    title: "Influencer Partnership Pipeline",
    description: "Build recurring income through influencer network",
    steps: 6,
  },
]

export default function InstantProfitsPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers)
  const [searchFilters, setSearchFilters] = useState({
    niche: "",
    platform: "instagram",
    minFollowers: "",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newInfluencer, setNewInfluencer] = useState({
    name: "",
    platform: "",
    niche: "",
    followers: "",
    notes: "",
  })

  const addInfluencer = () => {
    const influencer: Influencer = {
      id: Math.max(...influencers.map(i => i.id)) + 1,
      name: newInfluencer.name,
      platform: newInfluencer.platform,
      niche: newInfluencer.niche,
      followers: newInfluencer.followers,
      engagement: "0%",
      status: "cold",
      notes: newInfluencer.notes,
    }
    setInfluencers([...influencers, influencer])
    setShowAddForm(false)
    setNewInfluencer({
      name: "",
      platform: "",
      niche: "",
      followers: "",
      notes: "",
    })
  }

  const updateStatus = (id: number, status: Influencer["status"]) => {
    setInfluencers(influencers.map(i => i.id === id ? { ...i, status } : i))
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <Badge variant="default" className="text-xs">
              PREMIUM MODULE
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">Instant Profits Module</h1>
          <p className="text-muted-foreground">
            Influencer finder, outreach automation, and scaling playbooks
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="text-2xl font-bold">{influencers.length}</div>
            <p className="text-xs text-muted-foreground">Influencers Tracked</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardContent className="p-6 text-center">
            <Mail className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
            <div className="text-2xl font-bold">
              {influencers.filter(i => i.status === "contacted").length}
            </div>
            <p className="text-xs text-muted-foreground">Contacted</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardContent className="p-6 text-center">
            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <div className="text-2xl font-bold">
              {influencers.filter(i => i.status === "replied").length}
            </div>
            <p className="text-xs text-muted-foreground">Replied</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <div className="text-2xl font-bold">
              {influencers.filter(i => i.status === "promoting").length}
            </div>
            <p className="text-xs text-muted-foreground">Promoting</p>
          </CardContent>
        </Card>
      </div>

      {/* Influencer Finder */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Influencer Finder
          </CardTitle>
          <CardDescription>
            Find influencers in your niche to partner with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niche</label>
              <Input
                placeholder="e.g. fitness, make money online"
                value={searchFilters.niche}
                onChange={(e) => setSearchFilters({ ...searchFilters, niche: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Badge variant="secondary">Instagram</Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Followers</label>
              <Input
                placeholder="e.g. 10000"
                value={searchFilters.minFollowers}
                onChange={(e) => setSearchFilters({ ...searchFilters, minFollowers: e.target.value })}
              />
            </div>
          </div>

          <Button disabled={!searchFilters.niche} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Find Influencers
          </Button>
        </CardContent>
      </Card>

      {/* Outreach Templates */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Bot-Generated Outreach Messages
          </CardTitle>
          <CardDescription>
            Copy-paste DM templates for influencer outreach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {outreachTemplates.map((template) => (
            <Card key={template.id} className="glass border-primary/20">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="default">{template.type}</Badge>
                </div>
                <p className="mb-3 rounded-lg bg-muted/50 p-3 text-sm">{template.template}</p>
                <div className="flex gap-2">
                  <CopyButton text={template.template} variant="default" size="sm" />
                  <Button variant="ghost" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Mini Bot CRM */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Mini Bot CRM
              </CardTitle>
              <CardDescription>
                Track your influencer partnership pipeline
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Influencer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Form */}
          {showAddForm && (
            <Card className="glass border-primary/20">
              <CardContent className="space-y-3 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Influencer name"
                    value={newInfluencer.name}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, name: e.target.value })}
                  />
                  <Input
                    placeholder="Platform"
                    value={newInfluencer.platform}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, platform: e.target.value })}
                  />
                  <Input
                    placeholder="Niche"
                    value={newInfluencer.niche}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, niche: e.target.value })}
                  />
                  <Input
                    placeholder="Followers"
                    value={newInfluencer.followers}
                    onChange={(e) => setNewInfluencer({ ...newInfluencer, followers: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Notes..."
                  value={newInfluencer.notes}
                  onChange={(e) => setNewInfluencer({ ...newInfluencer, notes: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addInfluencer}
                    disabled={!newInfluencer.name || !newInfluencer.platform}
                  >
                    Add to CRM
                  </Button>
                  <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Influencers List */}
          <div className="space-y-3">
            {influencers.map((influencer) => (
              <Card key={influencer.id} className="glass">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="font-semibold">{influencer.name}</h3>
                          <Badge variant="secondary">{influencer.platform}</Badge>
                          <Badge
                            variant={
                              influencer.status === "promoting"
                                ? "success"
                                : influencer.status === "replied"
                                ? "default"
                                : influencer.status === "contacted"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {influencer.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{influencer.niche}</span>
                          <span>{influencer.followers} followers</span>
                          <span>{influencer.engagement} engagement</span>
                          {influencer.lastContact && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {influencer.lastContact}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {influencer.notes && (
                      <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                        {influencer.notes}
                      </p>
                    )}

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={influencer.status === "contacted" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => updateStatus(influencer.id, "contacted")}
                      >
                        Contacted
                      </Button>
                      <Button
                        variant={influencer.status === "replied" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => updateStatus(influencer.id, "replied")}
                      >
                        Replied
                      </Button>
                      <Button
                        variant={influencer.status === "promoting" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => updateStatus(influencer.id, "promoting")}
                      >
                        Promoting
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scaling Playbooks */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Simple Scaling Playbooks
          </CardTitle>
          <CardDescription>
            Step-by-step blueprints for scaling your bot operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-3">
            {scalingPlaybooks.map((playbook) => (
              <Card key={playbook.id} className="glass border-primary/20">
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">{playbook.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{playbook.description}</p>
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    {playbook.steps} simple steps
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    View Playbook
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Pitch Generator */}
      <Card className="glass border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold">Affiliate Pitch Generator</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Generate custom pitch messages based on the influencer&apos;s niche, audience size, and content style.
                Perfect for closing partnership deals faster.
              </p>
              <Button variant="secondary" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Pitch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

