import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIREBASE_SERVER_STUB = path.join(__dirname, 'src/lib/firebase-server-stub.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Pages 런타임은 sharp 미지원 — 빌트인 최적화 비활성화
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Firebase pulls in protobufjs which uses `new Function`, banned on
      // Cloudflare Workers. Our app only calls firebase from client-side
      // useEffect/event handlers, so replacing it with an empty object on
      // the server bundle is safe — those calls never run there.
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'firebase/app$': FIREBASE_SERVER_STUB,
        'firebase/firestore$': FIREBASE_SERVER_STUB,
        'firebase/auth$': FIREBASE_SERVER_STUB,
        'firebase/storage$': FIREBASE_SERVER_STUB,
      }
    }
    return config
  },
}

export default nextConfig
