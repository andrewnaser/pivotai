import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const VALID_UPGRADES = ["infinite", "automation", "tenx", "dfy"] as const
type UpgradeType = typeof VALID_UPGRADES[number]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, upgradeType } = body as { email?: string; upgradeType?: string }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!upgradeType || !VALID_UPGRADES.includes(upgradeType as UpgradeType)) {
      return NextResponse.json(
        { error: "Invalid upgrade type. Must be: infinite, automation, tenx, or dfy" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    // Find user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error("Error listing users:", listError)
      return NextResponse.json({ error: "Failed to find user" }, { status: 500 })
    }

    const user = users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email address" },
        { status: 404 }
      )
    }

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("user_upgrades")
      .select("id")
      .eq("user_id", user.id)
      .eq("upgrade_type", upgradeType)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { message: "Upgrade already unlocked!", alreadyUnlocked: true },
        { status: 200 }
      )
    }

    // Unlock the upgrade
    const { error: insertError } = await supabase.from("user_upgrades").insert({
      user_id: user.id,
      upgrade_type: upgradeType,
    })

    if (insertError) {
      console.error("Error inserting upgrade:", insertError)
      return NextResponse.json({ error: "Failed to unlock upgrade" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Upgrade unlocked successfully!",
      upgradeType,
      email: user.email,
    })
  } catch (error) {
    console.error("Unlock upgrade error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

