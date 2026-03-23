'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CrownCanvas() {
  const mountRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const deviceOrientRef = useRef({ x: 0, y: 0 })
  const usingOrientRef = useRef(false)
  const autoRotRef = useRef(0)

  useEffect(() => {
    const canvas = mountRef.current
    if (!canvas) return

    const W = canvas.clientWidth
    const H = canvas.clientHeight

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.z = 6.5

    // ── Renderer (transparent bg) ──────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)

    // ── Crown geometry ─────────────────────────────────────────
    //
    // Crown outline (2D shape, x ∈ [-1,1], y ∈ [-0.4, 1.0])
    // Scaled up by factor after centering
    //
    const crownPts = [
      // bottom band
      [-1.0, -0.40],
      [ 1.0, -0.40],
      // right outer spike
      [ 0.78,  0.02],
      [ 1.00,  0.78],
      [ 0.58,  0.10],
      // right circle spike
      [ 0.32,  0.52],
      [ 0.17,  0.02],
      // center spike (tallest)
      [ 0.00,  1.00],
      [-0.17,  0.02],
      // left circle spike
      [-0.32,  0.52],
      [-0.58,  0.10],
      // left outer spike
      [-1.00,  0.78],
      [-0.78,  0.02],
    ]

    const scale = 1.6
    const shape = new THREE.Shape()
    shape.moveTo(crownPts[0][0] * scale, crownPts[0][1] * scale)
    crownPts.slice(1).forEach(([x, y]) => shape.lineTo(x * scale, y * scale))
    shape.closePath()

    const extrudeSettings = { depth: 0.22, bevelEnabled: false }
    const crownGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    crownGeo.center()

    const crownMat = new THREE.MeshBasicMaterial({
      color: 0xf0e6d3,
      wireframe: true,
    })
    const crownMesh = new THREE.Mesh(crownGeo, crownMat)

    // ── Group to hold crown + ornaments ───────────────────────
    const crownGroup = new THREE.Group()
    crownGroup.add(crownMesh)

    // ── Diamond ornament (center peak) ────────────────────────
    const diamondShape = new THREE.Shape()
    diamondShape.moveTo(0,    0.18 * scale)
    diamondShape.lineTo(0.08 * scale, 0)
    diamondShape.lineTo(0,   -0.14 * scale)
    diamondShape.lineTo(-0.08 * scale, 0)
    diamondShape.closePath()

    const diamondGeo = new THREE.ShapeGeometry(diamondShape)
    const diamondEdges = new THREE.EdgesGeometry(diamondGeo)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf0e6d3 })

    // Position at center spike tip. The crown geometry was centered, so we
    // need to offset to match the original tip y = 1.0 * scale = 1.6.
    // crownGeo bounding box: yMin = -0.4*1.6 = -0.64, yMax = 1.0*1.6 = 1.6
    // After .center(): yOffset = -(yMax+yMin)/2 = -(1.6-0.64)/2 = -0.48
    // So tip in centered coords = 1.6 - 0.48 = 1.12  (approx, depth adds 0.11)
    const diamond = new THREE.LineSegments(diamondEdges, lineMat)
    diamond.position.set(0, 1.10, 0.12)
    crownGroup.add(diamond)

    // ── Circle ornaments (right & left circle spike tips) ─────
    const circleGeo = new THREE.CircleGeometry(0.10, 20)
    const circleEdges = new THREE.EdgesGeometry(circleGeo)

    // tip-right-circle: (0.32, 0.52)*scale = (0.512, 0.832), centered ≈ (0.512, 0.352)
    const circR = new THREE.LineSegments(circleEdges, lineMat)
    circR.position.set(0.50, 0.35, 0.12)
    crownGroup.add(circR)

    const circL = new THREE.LineSegments(circleEdges.clone(), lineMat)
    circL.position.set(-0.50, 0.35, 0.12)
    crownGroup.add(circL)

    scene.add(crownGroup)

    // ── Ambient lighting (not needed for MeshBasicMaterial but good practice) ─
    // (MeshBasicMaterial ignores lights)

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
      deviceOrientRef.current.x = Math.max(-1, Math.min(1, e.beta  / 45))
      deviceOrientRef.current.y = Math.max(-1, Math.min(1, e.gamma / 45))
    }

    const setupOrientation = async () => {
      if (typeof DeviceOrientationEvent === 'undefined') return
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const perm = await DeviceOrientationEvent.requestPermission()
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch (_) {
          // permission denied or not a touch device
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    if ('ontouchstart' in window) {
      setupOrientation()
    }

    // ── Resize ─────────────────────────────────────────────────
    const handleResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation loop ─────────────────────────────────────────
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)

      if ('ontouchstart' in window) {
        if (usingOrientRef.current) {
          // tilt by device orientation
          crownGroup.rotation.y += (deviceOrientRef.current.y * 0.5 - crownGroup.rotation.y) * 0.06
          crownGroup.rotation.x += (deviceOrientRef.current.x * 0.25 - crownGroup.rotation.x) * 0.06
        } else {
          // auto-rotate gently
          autoRotRef.current += 0.012
          crownGroup.rotation.y = Math.sin(autoRotRef.current) * 0.45
          crownGroup.rotation.x = Math.sin(autoRotRef.current * 0.6) * 0.12
        }
      } else {
        // desktop: follow mouse
        crownGroup.rotation.y += (mouseRef.current.x * 0.45 - crownGroup.rotation.y) * 0.06
        crownGroup.rotation.x += (-mouseRef.current.y * 0.22 - crownGroup.rotation.x) * 0.06
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

      crownGeo.dispose()
      crownMat.dispose()
      diamondGeo.dispose()
      diamondEdges.dispose()
      circleGeo.dispose()
      circleEdges.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={mountRef}
      className="crown-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
