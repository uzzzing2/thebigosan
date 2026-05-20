/**
 * Push existing TOP 5 createdAt to before 5/18. Requires temp rules.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore'

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

const at = (y, mo, d, h, min) => new Date(y, mo - 1, d, h, min, 0, 0).getTime()

const TARGETS = [
  { id: '9n3LZi82opC2AymRqe8m', ts: at(2026, 5, 16, 13, 42), label: 'dem_voter_88' },
  { id: 'ESOOL1tnGJh8ZPohTHqn', ts: at(2026, 5, 16, 19, 30), label: 'osan_eomma01' },
  { id: 'ViqvuIfKcJ6t82ITvWPS', ts: at(2026, 5, 17, 12, 50), label: 'osan_walker60' },
  { id: '6sUODyQbSGq65P33npUN', ts: at(2026, 5, 17, 18, 10), label: 'osan_driver7' },
  { id: '1nkToJuiHlF3GQ3ApaNA', ts: at(2026, 5, 17, 20, 45), label: 'segyo2_couple' },
]

for (const t of TARGETS) {
  await updateDoc(doc(db, 'cheers', t.id), {
    createdAt: Timestamp.fromMillis(t.ts),
  })
  console.log(`updated ${t.label}  ${new Date(t.ts).toISOString()}`)
}
process.exit(0)
