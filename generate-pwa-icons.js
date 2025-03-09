// This script generates PNG icons for PWA from the SVG source
// Run with: node generate-pwa-icons.js

import fs from 'fs'
import { createCanvas, loadImage } from 'canvas'
import path from 'path'

// Ensure the public directory exists
const publicDir = path.resolve('./public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Function to create a PNG icon
async function createIcon(size, filename) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fill with a background color (you can customize this)
  ctx.fillStyle = '#4F46E5'
  ctx.fillRect(0, 0, size, size)

  // Draw a simple ant silhouette (very basic)
  ctx.fillStyle = 'white'

  // Body
  ctx.beginPath()
  ctx.ellipse(size / 2, size / 2, size / 4, size / 3, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Head
  ctx.beginPath()
  ctx.arc(size / 2, size / 3, size / 6, 0, 2 * Math.PI)
  ctx.fill()

  // Legs
  ctx.strokeStyle = 'white'
  ctx.lineWidth = size / 20

  // Left legs
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(size / 2 - size / 8, size / 2 - size / 8 + (i * size) / 8)
    ctx.lineTo(size / 4, size / 2 - size / 6 + (i * size) / 6)
    ctx.stroke()
  }

  // Right legs
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(size / 2 + size / 8, size / 2 - size / 8 + (i * size) / 8)
    ctx.lineTo((3 * size) / 4, size / 2 - size / 6 + (i * size) / 6)
    ctx.stroke()
  }

  // Antennae
  ctx.beginPath()
  ctx.moveTo(size / 2 - size / 12, size / 3 - size / 12)
  ctx.lineTo(size / 3, size / 5)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(size / 2 + size / 12, size / 3 - size / 12)
  ctx.lineTo((2 * size) / 3, size / 5)
  ctx.stroke()

  // Save the image
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(publicDir, filename), buffer)
  console.log(`Created ${filename} (${size}x${size})`)
}

// Generate the icons
async function generateIcons() {
  try {
    await createIcon(192, 'pwa-192x192.png')
    await createIcon(512, 'pwa-512x512.png')
    await createIcon(180, 'apple-touch-icon.png')
    console.log('All icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
  }
}

generateIcons()
