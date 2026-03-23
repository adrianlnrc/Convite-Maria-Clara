'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CrownCanvas() {
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
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.z = 8.5

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4

    // ── Environment Map (PMREMGenerator + RoomEnvironment) ─────
    let envTexture = null
    const setupEnv = async () => {
      try {
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
        const pmrem = new THREE.PMREMGenerator(renderer)
        pmrem.compileEquirectangularShader()
        envTexture = pmrem.fromScene(new RoomEnvironment()).texture
        scene.environment = envTexture
        pmrem.dispose()
      } catch (e) {
        // fallback: no env map, lighting only
      }
    }
    setupEnv()

    // ── Materials ──────────────────────────────────────────────
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD4A843,
      metalness: 0.92,
      roughness: 0.16,
      envMapIntensity: 1.3,
    })

    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xE8F4FF,
      metalness: 0.0,
      roughness: 0.04,
      transparent: true,
      opacity: 0.80,
      side: THREE.DoubleSide,
    })

    // ── Lighting ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffeedd, 0.45))

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    keyLight.position.set(3, 5, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xffe4b0, 1.4)
    rimLight.position.set(-4, 2, -3)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xffd700, 1.8, 18)
    fillLight.position.set(0, 3, 6)
    scene.add(fillLight)

    const gemLight = new THREE.PointLight(0xffffff, 2.4, 8)
    gemLight.position.set(0.5, 3.5, 4)
    scene.add(gemLight)

    // ── Tiara Group ────────────────────────────────────────────
    const tiaraGroup = new THREE.Group()
    const allGeos = []

    const extrude = (shape, depth = 0.18, bevel = 0.035) => {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
      })
      allGeos.push(geo)
      return geo
    }

    // ── 1. Base band (crescent arc) ────────────────────────────
    const baseBand = new THREE.Shape()
    baseBand.moveTo(-3.55, -0.32)
    baseBand.quadraticCurveTo(0, -0.72, 3.55, -0.32)
    baseBand.lineTo(3.55, 0.20)
    baseBand.quadraticCurveTo(0, -0.14, -3.55, 0.20)
    baseBand.closePath()

    tiaraGroup.add(new THREE.Mesh(extrude(baseBand, 0.22, 0.04), goldMat))

    // ── 2. Helper: rounded arch shape ─────────────────────────
    const makeRoundedArch = (topH, halfW) => {
      const s = new THREE.Shape()
      s.moveTo(-halfW, -0.28)
      s.lineTo(-halfW, topH * 0.52)
      s.quadraticCurveTo(-halfW * 0.12, topH + 0.14, 0, topH + 0.14)
      s.quadraticCurveTo(halfW * 0.12, topH + 0.14, halfW, topH * 0.52)
      s.lineTo(halfW, -0.28)
      s.closePath()
      return s
    }

    // ── 3. Center arch (gothic pointed, tallest) ───────────────
    const centerArchShape = new THREE.Shape()
    centerArchShape.moveTo(-0.44, -0.28)
    centerArchShape.bezierCurveTo(-0.58, 0.38, -0.12, 1.28, 0, 1.62)
    centerArchShape.bezierCurveTo(0.12, 1.28, 0.58, 0.38, 0.44, -0.28)
    centerArchShape.closePath()

    tiaraGroup.add(new THREE.Mesh(extrude(centerArchShape, 0.18, 0.03), goldMat))

    // ── 4. Inner arches ×2 ────────────────────────────────────
    const innerArchShape = makeRoundedArch(0.92, 0.30)
    const innerArchGeoL = extrude(innerArchShape, 0.17, 0.03)
    const innerArchGeoR = extrude(innerArchShape, 0.17, 0.03)
    allGeos.push(innerArchGeoL, innerArchGeoR)

    const innerL = new THREE.Mesh(innerArchGeoL, goldMat)
    innerL.position.x = -1.08
    tiaraGroup.add(innerL)

    const innerR = new THREE.Mesh(innerArchGeoR, goldMat)
    innerR.position.x = 1.08
    tiaraGroup.add(innerR)

    // ── 5. Outer arches ×2 ────────────────────────────────────
    const outerArchShape = makeRoundedArch(0.60, 0.26)
    const outerArchGeoL = extrude(outerArchShape, 0.15, 0.028)
    const outerArchGeoR = extrude(outerArchShape, 0.15, 0.028)

    const outerL = new THREE.Mesh(outerArchGeoL, goldMat)
    outerL.position.set(-2.12, 0, 0)
    outerL.rotation.z = 0.13
    tiaraGroup.add(outerL)

    const outerR = new THREE.Mesh(outerArchGeoR, goldMat)
    outerR.position.set(2.12, 0, 0)
    outerR.rotation.z = -0.13
    tiaraGroup.add(outerR)

    // ── 6. Side scrolls/curls ×2 (TubeGeometry) ───────────────
    const makeCurl = (side) => {
      const pts = [
        new THREE.Vector3(side * 2.62, 0.20, 0.10),
        new THREE.Vector3(side * 2.92, 0.38, 0.09),
        new THREE.Vector3(side * 3.18, 0.50, 0.07),
        new THREE.Vector3(side * 3.38, 0.42, 0.05),
        new THREE.Vector3(side * 3.50, 0.26, 0.03),
        new THREE.Vector3(side * 3.44, 0.10, 0.01),
        new THREE.Vector3(side * 3.26, 0.04, -0.01),
      ]
      const curve = new THREE.CatmullRomCurve3(pts)
      const geo = new THREE.TubeGeometry(curve, 22, 0.048, 8, false)
      allGeos.push(geo)
      return geo
    }

    tiaraGroup.add(new THREE.Mesh(makeCurl(-1), goldMat))
    tiaraGroup.add(new THREE.Mesh(makeCurl(1), goldMat))

    // ── 7. Gem shapes (marquise/navette) ×3 ───────────────────
    const makeGemShape = (halfH, halfW) => {
      const s = new THREE.Shape()
      s.moveTo(0, halfH)
      s.bezierCurveTo(halfW * 0.85, halfH * 0.5, halfW, halfH * 0.08, halfW, 0)
      s.bezierCurveTo(halfW, -halfH * 0.08, halfW * 0.85, -halfH * 0.5, 0, -halfH)
      s.bezierCurveTo(-halfW * 0.85, -halfH * 0.5, -halfW, -halfH * 0.08, -halfW, 0)
      s.bezierCurveTo(-halfW, halfH * 0.08, -halfW * 0.85, halfH * 0.5, 0, halfH)
      s.closePath()
      return s
    }

    // Center gem (large, inside center arch)
    const centerGemGeo = new THREE.ShapeGeometry(makeGemShape(0.58, 0.22))
    allGeos.push(centerGemGeo)
    const centerGem = new THREE.Mesh(centerGemGeo, gemMat)
    centerGem.position.set(0, 0.65, 0.19)
    tiaraGroup.add(centerGem)

    // Inner gems ×2
    const innerGemGeo = new THREE.ShapeGeometry(makeGemShape(0.38, 0.15))
    allGeos.push(innerGemGeo)
    ;[-1.08, 1.08].forEach(x => {
      const g = new THREE.Mesh(innerGemGeo, gemMat)
      g.position.set(x, 0.30, 0.18)
      tiaraGroup.add(g)
    })

    // ── 8. Studs along band top edge ──────────────────────────
    const studGeo = new THREE.SphereGeometry(0.058, 9, 9)
    allGeos.push(studGeo)
    const studXs = [-3.15, -2.65, -2.15, -1.65, -1.15, -0.65, -0.22,
                     0.22,  0.65,  1.15,  1.65,  2.15,  2.65,  3.15]
    studXs.forEach(x => {
      const stud = new THREE.Mesh(studGeo, goldMat)
      stud.position.set(x, 0.16, 0.11)
      tiaraGroup.add(stud)
    })

    // ── Center the whole tiara group ──────────────────────────
    const box = new THREE.Box3().setFromObject(tiaraGroup)
    const center = box.getCenter(new THREE.Vector3())
    tiaraGroup.position.sub(center)

    scene.add(tiaraGroup)

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

      // Breathing
      tiaraGroup.rotation.z = Math.sin(t * 0.9) * 0.018
      const breathe = 1 + Math.sin(t * 1.1) * 0.010
      tiaraGroup.scale.setScalar(breathe)

      const isMobile = 'ontouchstart' in window
      if (isMobile) {
        if (usingOrientRef.current) {
          tiaraGroup.rotation.y += (deviceOrientRef.current.y * 0.45 - tiaraGroup.rotation.y) * 0.06
          tiaraGroup.rotation.x += (deviceOrientRef.current.x * 0.20 - tiaraGroup.rotation.x) * 0.06
        } else {
          autoRot += 0.010
          tiaraGroup.rotation.y = Math.sin(autoRot) * 0.42
          tiaraGroup.rotation.x = Math.sin(autoRot * 0.6) * 0.10
        }
      } else {
        tiaraGroup.rotation.y += (mouseRef.current.x * 0.42 - tiaraGroup.rotation.y) * 0.06
        tiaraGroup.rotation.x += (-mouseRef.current.y * 0.18 - tiaraGroup.rotation.x) * 0.06
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
      goldMat.dispose()
      gemMat.dispose()
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
