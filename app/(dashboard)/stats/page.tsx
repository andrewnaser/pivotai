"use client"

import { Card } from "@/components/ui/card"

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
          <p className="text-sm text-muted-foreground">
            Quick performance overview for your campaigns, queue, and engagement.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 stat-card">
          <div className="text-sm text-muted-foreground">Campaigns</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Coming soon</div>
        </Card>
        <Card className="p-4 stat-card">
          <div className="text-sm text-muted-foreground">Queued actions</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Coming soon</div>
        </Card>
        <Card className="p-4 stat-card">
          <div className="text-sm text-muted-foreground">Replies</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Coming soon</div>
        </Card>
        <Card className="p-4 stat-card">
          <div className="text-sm text-muted-foreground">CTR</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Coming soon</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-sm font-medium">Next steps</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Wire stats to Supabase tables</li>
          <li>Add time range selector (7d / 30d / 90d)</li>
          <li>Charts for growth + engagement</li>
        </ul>
      </Card>
    </div>
  )
}





