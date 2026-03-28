'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CakeCanvas() {
  const mountRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const deviceOrientRef = useRef({ x: 0, y: 0 })
  const usingOrientRef = useRef(false)

  useEffect(() => {
    const canvas = mountRef.current
    if (!canvas) return

    const W = canvas.clientWidth
    const H = canvas.clientHeight
    if (!W || !H) return

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100)
    camera.position.set(0, 3, 12)
    camera.lookAt(0, 1.5, 0)

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3

    // ── Environment Map ────────────────────────────────────────
    let envTexture = null
    const setupEnv = async () => {
      try {
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
        const pmrem = new THREE.PMREMGenerator(renderer)
        pmrem.compileEquirectangularShader()
        envTexture = pmrem.fromScene(new RoomEnvironment()).texture
        scene.environment = envTexture
        pmrem.dispose()
      } catch (e) { /* fallback: lighting only */ }
    }
    setupEnv()

    // ── Materials ──────────────────────────────────────────────
    const cakeMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6d0,
      roughness: 0.65,
      metalness: 0.0,
    })

    const frostingMat = new THREE.MeshStandardMaterial({
      color: 0xfff8f0,
      roughness: 0.3,
      metalness: 0.05,
    })

    const frostingPinkMat = new THREE.MeshStandardMaterial({
      color: 0xf0a0a0,
      roughness: 0.35,
      metalness: 0.05,
    })

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD4A843,
      metalness: 0.88,
      roughness: 0.18,
      envMapIntensity: 1.2,
    })

    const redMat = new THREE.MeshStandardMaterial({
      color: 0x8b1a1a,
      roughness: 0.4,
      metalness: 0.1,
    })

    const deepRedMat = new THREE.MeshStandardMaterial({
      color: 0x5c0d0d,
      roughness: 0.5,
      metalness: 0.05,
    })

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xffeedd,
      roughness: 0.6,
      metalness: 0.0,
    })

    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa33,
      emissive: 0xff6600,
      emissiveIntensity: 2.5,
      roughness: 0.2,
      metalness: 0.0,
    })

    const flameInnerMat = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      emissive: 0xffdd44,
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.0,
    })

    // ── Lighting ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffeedd, 0.5))

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0)
    keyLight.position.set(3, 6, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xffe4b0, 1.2)
    rimLight.position.set(-4, 3, -3)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xffd700, 1.5, 18)
    fillLight.position.set(0, 5, 6)
    scene.add(fillLight)

    // Candle glow
    const candleGlow = new THREE.PointLight(0xff8833, 2.5, 8)
    candleGlow.position.set(0, 5.5, 0)
    scene.add(candleGlow)

    // ── Cake Group ─────────────────────────────────────────────
    const cakeGroup = new THREE.Group()
    const allGeos = []

    // ── Helper: create a tier ──────────────────────────────────
    const createTier = (radius, height, yPos, material) => {
      const geo = new THREE.CylinderGeometry(radius, radius + 0.08, height, 48, 1)
      allGeos.push(geo)
      const mesh = new THREE.Mesh(geo, material)
      mesh.position.y = yPos + height / 2
      return mesh
    }

    // ── Cake plate / base ──────────────────────────────────────
    const plateGeo = new THREE.CylinderGeometry(2.6, 2.7, 0.12, 48)
    allGeos.push(plateGeo)
    const plate = new THREE.Mesh(plateGeo, goldMat)
    plate.position.y = -0.06
    cakeGroup.add(plate)

    // ── Bottom tier ────────────────────────────────────────────
    const bottomTier = createTier(2.2, 1.4, 0, deepRedMat)
    cakeGroup.add(bottomTier)

    // Bottom tier frosting drip ring
    const bottomFrostGeo = new THREE.TorusGeometry(2.2, 0.08, 12, 48)
    allGeos.push(bottomFrostGeo)
    const bottomFrost = new THREE.Mesh(bottomFrostGeo, goldMat)
    bottomFrost.position.y = 1.4
    bottomFrost.rotation.x = Math.PI / 2
    cakeGroup.add(bottomFrost)

    // Bottom tier base ring
    const bottomBaseRing = new THREE.TorusGeometry(2.28, 0.06, 12, 48)
    allGeos.push(bottomBaseRing)
    const bottomBase = new THREE.Mesh(bottomBaseRing, goldMat)
    bottomBase.position.y = 0.06
    bottomBase.rotation.x = Math.PI / 2
    cakeGroup.add(bottomBase)

    // ── Middle tier ────────────────────────────────────────────
    const middleTier = createTier(1.6, 1.2, 1.4, redMat)
    cakeGroup.add(middleTier)

    // Middle tier frosting
    const midFrostGeo = new THREE.TorusGeometry(1.6, 0.07, 12, 48)
    allGeos.push(midFrostGeo)
    const midFrost = new THREE.Mesh(midFrostGeo, frostingMat)
    midFrost.position.y = 2.6
    midFrost.rotation.x = Math.PI / 2
    cakeGroup.add(midFrost)

    // Middle tier base ring
    const midBaseRing = new THREE.TorusGeometry(1.68, 0.05, 12, 48)
    allGeos.push(midBaseRing)
    const midBase = new THREE.Mesh(midBaseRing, goldMat)
    midBase.position.y = 1.46
    midBase.rotation.x = Math.PI / 2
    cakeGroup.add(midBase)

    // ── Top tier ───────────────────────────────────────────────
    const topTier = createTier(1.0, 1.0, 2.6, cakeMat)
    cakeGroup.add(topTier)

    // Top tier frosting
    const topFrostGeo = new THREE.TorusGeometry(1.0, 0.06, 12, 48)
    allGeos.push(topFrostGeo)
    const topFrost = new THREE.Mesh(topFrostGeo, frostingPinkMat)
    topFrost.position.y = 3.6
    topFrost.rotation.x = Math.PI / 2
    cakeGroup.add(topFrost)

    // Top tier base ring
    const topBaseRing = new THREE.TorusGeometry(1.08, 0.04, 12, 48)
    allGeos.push(topBaseRing)
    const topBase = new THREE.Mesh(topBaseRing, goldMat)
    topBase.position.y = 2.66
    topBase.rotation.x = Math.PI / 2
    cakeGroup.add(topBase)

    // ── Frosting drips on bottom tier ──────────────────────────
    const dripAngles = [0, 0.5, 1.1, 1.7, 2.3, 2.9, 3.5, 4.1, 4.7, 5.3]
    dripAngles.forEach((angle) => {
      const dripH = 0.25 + Math.random() * 0.35
      const dripGeo = new THREE.CapsuleGeometry(0.06, dripH, 4, 8)
      allGeos.push(dripGeo)
      const drip = new THREE.Mesh(dripGeo, goldMat)
      drip.position.set(
        Math.cos(angle) * 2.2,
        1.4 - dripH / 2 - 0.05,
        Math.sin(angle) * 2.2,
      )
      cakeGroup.add(drip)
    })

    // ── Frosting drips on middle tier ──────────────────────────
    const midDripAngles = [0.3, 1.0, 1.8, 2.6, 3.4, 4.2, 5.0, 5.8]
    midDripAngles.forEach((angle) => {
      const dripH = 0.18 + Math.random() * 0.28
      const dripGeo = new THREE.CapsuleGeometry(0.05, dripH, 4, 8)
      allGeos.push(dripGeo)
      const drip = new THREE.Mesh(dripGeo, frostingMat)
      drip.position.set(
        Math.cos(angle) * 1.6,
        2.6 - dripH / 2 - 0.04,
        Math.sin(angle) * 1.6,
      )
      cakeGroup.add(drip)
    })

    // ── Gold beads along bottom tier ───────────────────────────
    const beadGeo = new THREE.SphereGeometry(0.055, 8, 8)
    allGeos.push(beadGeo)
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2
      const bead = new THREE.Mesh(beadGeo, goldMat)
      bead.position.set(
        Math.cos(angle) * 2.28,
        0.72,
        Math.sin(angle) * 2.28,
      )
      cakeGroup.add(bead)
    }

    // ── Rose decorations on middle tier ────────────────────────
    const roseGeo = new THREE.SphereGeometry(0.14, 12, 8)
    allGeos.push(roseGeo)
    const rosePetalGeo = new THREE.SphereGeometry(0.10, 8, 6)
    allGeos.push(rosePetalGeo)

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const roseGroup = new THREE.Group()

      // Center
      const center = new THREE.Mesh(roseGeo, frostingPinkMat)
      roseGroup.add(center)

      // Petals
      for (let p = 0; p < 5; p++) {
        const pAngle = (p / 5) * Math.PI * 2
        const petal = new THREE.Mesh(rosePetalGeo, frostingPinkMat)
        petal.position.set(Math.cos(pAngle) * 0.12, 0, Math.sin(pAngle) * 0.12)
        petal.scale.set(1, 0.6, 1)
        roseGroup.add(petal)
      }

      roseGroup.position.set(
        Math.cos(angle) * 1.68,
        2.0,
        Math.sin(angle) * 1.68,
      )
      roseGroup.lookAt(0, 2.0, 0)
      cakeGroup.add(roseGroup)
    }

    // ── "20" text on top tier (using small spheres) ────────────
    const numGeo = new THREE.SphereGeometry(0.045, 6, 6)
    allGeos.push(numGeo)

    // "2" shape - approximation with dots
    const twoPoints = [
      [-0.25, 3.35], [-0.15, 3.42], [-0.05, 3.42], [0.05, 3.38],
      [0.05, 3.28], [-0.05, 3.20], [-0.15, 3.12], [-0.25, 3.08],
      [-0.15, 3.08], [-0.05, 3.08], [0.05, 3.08],
    ]

    // "0" shape - approximation with dots
    const zeroPoints = [
      [0.25, 3.42], [0.35, 3.42], [0.45, 3.38], [0.45, 3.28],
      [0.45, 3.18], [0.45, 3.12], [0.35, 3.08], [0.25, 3.08],
      [0.15, 3.12], [0.15, 3.18], [0.15, 3.28], [0.15, 3.38],
    ]

    ;[...twoPoints, ...zeroPoints].forEach(([x, y]) => {
      const dot = new THREE.Mesh(numGeo, goldMat)
      dot.position.set(x, y, 1.02)
      cakeGroup.add(dot)
    })

    // ── Candles ────────────────────────────────────────────────
    const candlePositions = [
      [0, 3.6, 0],
      [-0.45, 3.6, 0.3],
      [0.45, 3.6, 0.3],
      [-0.3, 3.6, -0.4],
      [0.3, 3.6, -0.4],
    ]

    const flameRefs = []
    const flameInnerRefs = []

    candlePositions.forEach(([x, y, z]) => {
      // Candle stick
      const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8)
      allGeos.push(stickGeo)
      const stick = new THREE.Mesh(stickGeo, candleMat)
      stick.position.set(x, y + 0.325, z)
      cakeGroup.add(stick)

      // Candle stripe
      const stripeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 8)
      allGeos.push(stripeGeo)
      for (let s = 0; s < 3; s++) {
        const stripe = new THREE.Mesh(stripeGeo, goldMat)
        stripe.position.set(x, y + 0.15 + s * 0.2, z)
        cakeGroup.add(stripe)
      }

      // Flame (outer)
      const flameShape = new THREE.Shape()
      flameShape.moveTo(0, 0)
      flameShape.bezierCurveTo(-0.06, 0.08, -0.04, 0.18, 0, 0.26)
      flameShape.bezierCurveTo(0.04, 0.18, 0.06, 0.08, 0, 0)

      const flameExtGeo = new THREE.ExtrudeGeometry(flameShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      })
      allGeos.push(flameExtGeo)
      const flame = new THREE.Mesh(flameExtGeo, flameMat)
      flame.position.set(x, y + 0.65, z - 0.025)
      flameRefs.push(flame)
      cakeGroup.add(flame)

      // Flame (inner glow)
      const innerFlameGeo = new THREE.SphereGeometry(0.04, 8, 6)
      allGeos.push(innerFlameGeo)
      const innerFlame = new THREE.Mesh(innerFlameGeo, flameInnerMat)
      innerFlame.position.set(x, y + 0.72, z)
      innerFlame.scale.set(1, 1.6, 1)
      flameInnerRefs.push(innerFlame)
      cakeGroup.add(innerFlame)
    })

    // ── Small gold topper star ─────────────────────────────────
    const starShape = new THREE.Shape()
    const starPoints5 = 5
    const outerR = 0.2
    const innerR = 0.08
    for (let i = 0; i < starPoints5 * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR
      const a = (i / (starPoints5 * 2)) * Math.PI * 2 - Math.PI / 2
      const px = Math.cos(a) * r
      const py = Math.sin(a) * r
      if (i === 0) starShape.moveTo(px, py)
      else starShape.lineTo(px, py)
    }
    starShape.closePath()

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    })
    allGeos.push(starGeo)
    const star = new THREE.Mesh(starGeo, goldMat)
    star.position.set(0, 4.55, 0)
    cakeGroup.add(star)

    // ── Center the cake ────────────────────────────────────────
    const box = new THREE.Box3().setFromObject(cakeGroup)
    const center = box.getCenter(new THREE.Vector3())
    cakeGroup.position.sub(center)
    cakeGroup.position.y += 0.3

    scene.add(cakeGroup)

    // ── Mouse interaction ──────────────────────────────────────
    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouse)

    // ── Device orientation (mobile) ────────────────────────────
    const handleOrientation = (e) => {
      if (e.gamma === null) return
      usingOrientRef.current = true
      deviceOrientRef.current.x = Math.max(-1, Math.min(1, e.beta / 45))
      deviceOrientRef.current.y = Math.max(-1, Math.min(1, e.gamma / 45))
    }

    const setupOrientation = async () => {
      if (typeof DeviceOrientationEvent === 'undefined') return
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const perm = await DeviceOrientationEvent.requestPermission()
          if (perm === 'granted') window.addEventListener('deviceorientation', handleOrientation)
        } catch (_) {}
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }
    if ('ontouchstart' in window) setupOrientation()

    // ── Resize ─────────────────────────────────────────────────
    const handleResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation loop ─────────────────────────────────────────
    let animId
    let t = 0
    let autoRot = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.012

      // Gentle breathing
      const breathe = 1 + Math.sin(t * 1.1) * 0.006
      cakeGroup.scale.setScalar(breathe)

      // Flame flicker
      flameRefs.forEach((flame, i) => {
        const flicker = 1 + Math.sin(t * 8 + i * 1.7) * 0.12 + Math.sin(t * 13 + i * 2.3) * 0.06
        flame.scale.set(flicker, 0.9 + Math.sin(t * 10 + i) * 0.15, 1)
      })
      flameInnerRefs.forEach((inner, i) => {
        inner.scale.x = 1 + Math.sin(t * 9 + i * 1.5) * 0.15
        inner.scale.z = 1 + Math.sin(t * 11 + i * 2.0) * 0.15
      })

      // Candle glow flicker
      candleGlow.intensity = 2.5 + Math.sin(t * 7) * 0.4 + Math.sin(t * 11) * 0.2

      // Star topper slow spin
      star.rotation.z = t * 0.3

      const isMobile = 'ontouchstart' in window
      if (isMobile) {
        if (usingOrientRef.current) {
          cakeGroup.rotation.y += (deviceOrientRef.current.y * 0.35 - cakeGroup.rotation.y) * 0.06
          cakeGroup.rotation.x += (deviceOrientRef.current.x * 0.12 - cakeGroup.rotation.x) * 0.06
        } else {
          autoRot += 0.006
          cakeGroup.rotation.y = Math.sin(autoRot) * 0.35
        }
      } else {
        cakeGroup.rotation.y += (mouseRef.current.x * 0.35 - cakeGroup.rotation.y) * 0.05
        cakeGroup.rotation.x += (-mouseRef.current.y * 0.10 - cakeGroup.rotation.x) * 0.05
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('deviceorientation', handleOrientation)
      allGeos.forEach(g => g.dispose())
      ;[cakeMat, frostingMat, frostingPinkMat, goldMat, redMat, deepRedMat,
        candleMat, flameMat, flameInnerMat].forEach(m => m.dispose())
      if (envTexture) envTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={mountRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
