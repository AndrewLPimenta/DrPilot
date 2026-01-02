"use client"

import { useEffect, useRef } from "react"
interface HeartbeatBackgroundProps {
  className?: string;
}
export function HeartbeatBackground({ className }: HeartbeatBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createECGPattern = () => {
      const pattern: number[] = []

      // Linha plana antes do batimento (0.6s)
      for (let i = 0; i < 60; i++) {
        pattern.push(0)
      }

      // Onda P (pequena elevação)
      pattern.push(0, 0.02, 0.05, 0.08, 0.1, 0.08, 0.05, 0.02, 0)

      // Linha plana (intervalo PR)
      for (let i = 0; i < 10; i++) {
        pattern.push(0)
      }

      // Complexo QRS (pico característico do ECG)
      pattern.push(0, -0.15, -0.3, 0.5, 1.8, -0.8, 0.3, 0.1, 0)

      // Linha plana
      for (let i = 0; i < 8; i++) {
        pattern.push(0)
      }

      // Onda T (elevação suave)
      pattern.push(0, 0.05, 0.12, 0.18, 0.2, 0.18, 0.12, 0.05, 0)

      // Linha plana após batimento
      for (let i = 0; i < 50; i++) {
        pattern.push(0)
      }

      return pattern
    }

    const ecgPattern = createECGPattern()
    let offset = 0
    const BASELINE_Y = canvas.height / 2
    const AMPLITUDE = 60
    const SPEED = 1.5 // pixels por frame

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Linha horizontal de fundo (grid do monitor)
      ctx.strokeStyle = "#00ff41"
      ctx.globalAlpha = 0.1
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, BASELINE_Y)
      ctx.lineTo(canvas.width, BASELINE_Y)
      ctx.stroke()

      ctx.strokeStyle = "#00ff41"
      ctx.globalAlpha = 0.9
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()

      let started = false
      for (let x = 0; x < canvas.width; x += 1) {
        // Calcular índice no padrão de forma contínua
        const patternIndex = Math.floor((x + offset) % ecgPattern.length)
        const y = BASELINE_Y - ecgPattern[patternIndex] * AMPLITUDE

        if (!started) {
          ctx.moveTo(x, y)
          started = true
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Incrementar offset para criar movimento contínuo
      offset += SPEED
      if (offset >= ecgPattern.length) {
        offset = 0
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center">
      <svg width="100%" height="200" viewBox="0 0 1300 200" preserveAspectRatio="xMidYMid meet" className="w-full">
        <defs>
          <linearGradient id="inOutGradient">
            <stop offset="0%" className="stop1" stopOpacity="" />
            <stop offset="30%" className="stop2" stopColor="#008D75" />
            <stop offset="70%" className="stop2" stopColor="#0bedc8ff" />
            <stop offset="100%" className="stop3" stopOpacity="" />
          </linearGradient>
        </defs>

        {/* Linha horizontal de referência */}
        <line x1="0" y1="100" x2="1300" y2="100" stroke="#008D75" strokeWidth="0.5" opacity="0.15" />

        <path
          id="monitor-path"
          d="M 0 100 L 450 100 L 470 100 L 480 105 L 490 108 L 500 105 L 510 100 L 520 100 L 550 100 L 565 100 L 585 70 L 610 20 L 635 140 L 660 100 L 680 100 L 700 100 L 715 108 L 730 115 L 745 108 L 760 100 L 800 100 L 1300 100"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style jsx>{`
       @keyframes monitorPulse {
  from {
    stroke-dashoffset: 1300;
  }
  to {
    stroke-dashoffset: 0;
  }
}

#monitor-path {
  stroke: url(#inOutGradient);
  stroke-dasharray: 1300;
  stroke-dashoffset: 1300;
  animation: monitorPulse 2s linear infinite;
}

      `}</style>
    </div>
  )
}
