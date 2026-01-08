"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Copy,
  Pause,
  Play,
  Trash2,
  Bot,
  Target,
  Link2,
} from "lucide-react"

interface Campaign {
  id: number
  name: string
  niche: string
  platforms: string[]
  affiliateLink: string
  tone: string
  status: "active" | "paused"
  deployed: number
  clicks: number
}

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Fitness Transformation Bot",
    niche: "Fitness & Weight Loss",
    platforms: ["Instagram"],
    affiliateLink: "https://bit.ly/fitness-offer",
    tone: "Relatable",
    status: "active",
    deployed: 284,
    clicks: 847,
  },
  {
    id: 2,
    name: "Make Money Online Bot",
    niche: "Make Money Online",
    platforms: ["Instagram"],
    affiliateLink: "https://bit.ly/mmo-offer",
    tone: "Authority",
    status: "active",
    deployed: 492,
    clicks: 1243,
  },
  {
    id: 3,
    name: "Dating Advice Bot",
    niche: "Dating & Relationships",
    platforms: ["Instagram"],
    affiliateLink: "https://bit.ly/dating-offer",
    tone: "Curious",
    status: "paused",
    deployed: 156,
    clicks: 389,
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    platforms: [] as string[],
    affiliateLink: "",
    tone: "relatable",
  })

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
    ))
  }

  const duplicateCampaign = (campaign: Campaign) => {
    const newCampaign = {
      ...campaign,
      id: Math.max(...campaigns.map(c => c.id)) + 1,
      name: `${campaign.name} (Copy)`,
      deployed: 0,
      clicks: 0,
    }
    setCampaigns([...campaigns, newCampaign])
  }

  const deleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
  }

  const handleCreateCampaign = () => {
    const newCampaign: Campaign = {
      id: Math.max(...campaigns.map(c => c.id)) + 1,
      name: formData.name,
      niche: formData.niche,
      platforms: formData.platforms,
      affiliateLink: formData.affiliateLink,
      tone: formData.tone,
      status: "active",
      deployed: 0,
      clicks: 0,
    }
    setCampaigns([...campaigns, newCampaign])
    setShowCreateForm(false)
    setFormData({
      name: "",
      niche: "",
      platforms: [],
      affiliateLink: "",
      tone: "relatable",
    })
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bot Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your automated attention hijacking campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Create New Bot Campaign</CardTitle>
            <CardDescription>Set up a new automated campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="e.g. Fitness Transformation Bot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niche</label>
                <Input
                  placeholder="e.g. Fitness & Weight Loss"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Platforms</label>
              <div className="flex flex-wrap gap-2">
                {["Instagram"].map((platform) => (
                  <Button
                    key={platform}
                    variant={formData.platforms.includes(platform) ? "default" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        platforms: formData.platforms.includes(platform)
                          ? formData.platforms.filter(p => p !== platform)
                          : [...formData.platforms, platform]
                      })
                    }}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Affiliate Link (Paste Only)</label>
              <Input
                placeholder="https://your-affiliate-link.com"
                value={formData.affiliateLink}
                onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Bot Comment Tone</label>
              <div className="flex flex-wrap gap-2">
                {["Curious", "Relatable", "Authority", "Question", "Shock"].map((tone) => (
                  <Button
                    key={tone}
                    variant={formData.tone === tone.toLowerCase() ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, tone: tone.toLowerCase() })}
                  >
                    {tone}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign} disabled={!formData.name || !formData.niche || !formData.affiliateLink}>
                <Bot className="mr-2 h-4 w-4" />
                Activate Bot Campaign
              </Button>
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.niche}</CardDescription>
                </div>
                <Badge variant={campaign.status === "active" ? "success" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platforms */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Platforms</p>
                <div className="flex flex-wrap gap-1">
                  {campaign.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Deployed</p>
                  <p className="text-lg font-bold text-primary">{campaign.deployed}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-lg font-bold text-primary">{campaign.clicks}</p>
                </div>
              </div>

              {/* Tone */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tone: <span className="text-foreground">{campaign.tone}</span></p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleCampaignStatus(campaign.id)}
                >
                  {campaign.status === "active" ? (
                    <>
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-3 w-3" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => duplicateCampaign(campaign)}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Duplicate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCampaign(campaign.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

