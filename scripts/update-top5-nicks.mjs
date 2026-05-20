/**
 * Update TOP 5 nicknames. 3 structured + 2 gibberish for natural variety.
 * Requires temp rules.
 *
 * Usage: node scripts/update-top5-nicks.mjs
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const UPDATES = [
  { id: '9n3LZi82opC2AymRqe8m', to: 'jhkim_lee' },    // 1위 (구조화, 숫자 없음)
  { id: 'ESOOL1tnGJh8ZPohTHqn', to: 'minju_0207' },   // 2위
  { id: 'ViqvuIfKcJ6t82ITvWPS', to: 'kfp2024' },      // 3위 (gibberish)
  { id: '6sUODyQbSGq65P33npUN', to: 'park_dh07' },    // 4위
  { id: '1nkToJuiHlF3GQ3ApaNA', to: 'mzqrlk' },       // 5위 (gibberish, 숫자 없음)
]

for (const u of UPDATES) {
  try {
    await updateDoc(doc(db, 'cheers', u.id), { nickname: u.to })
    console.log(`updated ${u.id}  →  ${u.to}`)
  } catch (e) {
    console.error(`failed ${u.id}`, e?.code ?? e)
  }
}
process.exit(0)
