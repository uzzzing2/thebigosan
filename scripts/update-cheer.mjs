/**
 * One-shot: update content of a cheer doc by ID.
 * Requires temporarily-relaxed rules (content edit isn't on the public path).
 *
 * Usage:
 *   node scripts/update-cheer.mjs <docId> "<new content>"
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '..', '.env.local')
const envText = fs.readFileSync(envPath, 'utf8')
const env = {}
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (!m) continue
  let v = m[2].trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  env[m[1]] = v
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const [docId, newContent] = process.argv.slice(2)
if (!docId || !newContent) {
  console.error('Usage: node scripts/update-cheer.mjs <docId> "<new content>"')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

await updateDoc(doc(db, 'cheers', docId), { content: newContent })
console.log(`[update-cheer] updated ${docId} (${newContent.length}자)`)
process.exit(0)
