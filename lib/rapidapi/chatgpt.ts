export type RapidApiChatGptResponse = {
  result?: string
  status?: boolean
  server_code?: string
}

const RAPIDAPI_HOST = "chatgpt-42.p.rapidapi.com"
const RAPIDAPI_URL = `https://${RAPIDAPI_HOST}/gpt4`

function getRapidApiKey() {
  const direct = process.env.RAPIDAPI_CHATGPT_KEY
  const fallback = process.env.RAPIDAPI_KEY
  const key = direct ?? fallback
  if (!key) {
    throw new Error("Missing RapidAPI key. Set RAPIDAPI_CHATGPT_KEY (preferred) or RAPIDAPI_KEY in your environment.")
  }
  const source = direct ? "RAPIDAPI_CHATGPT_KEY" : "RAPIDAPI_KEY"
  const last4 = key.length >= 4 ? key.slice(-4) : "????"
  return { key, source, last4 }
}

export async function callRapidApiChatGpt(messages: Array<{ role: "user" | "system"; content: string }>) {
  const { key, source, last4 } = getRapidApiKey()

  const res = await fetch(RAPIDAPI_URL, {
    method: "POST",
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      web_access: false,
    }),
  })

  const text = await res.text()
  let json: RapidApiChatGptResponse | null = null
  try {
    json = JSON.parse(text) as RapidApiChatGptResponse
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new Error(
      `RapidAPI ChatGPT failed (${res.status}) [key=${source}…${last4}]: ${json?.result ?? text.slice(0, 200)}`
    )
  }

  if (!json?.status || typeof json.result !== "string") {
    throw new Error(`RapidAPI ChatGPT returned unexpected response: ${text.slice(0, 200)}`)
  }

  return json.result
}


