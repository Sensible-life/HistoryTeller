import { useEffect, useRef, useState } from 'react'
import '../styles/Section1Opening.css'

class Person {
  constructor(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    this.baseRadius = radius
    this.targetRadius = radius
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.intelligence = Math.floor(Math.random() * 40) + 60
    this.character = Math.floor(Math.random() * 40) + 60
    this.potential = Math.floor(Math.random() * 40) + 60
    this.color = '#95a5a6'
    this.hovered = false
  }

  update(canvas) {
    this.x += this.vx
    this.y += this.vy

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx = -this.vx
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vy = -this.vy
    }

    if (this.hovered) {
      this.targetRadius = this.baseRadius * 1.3
    } else {
      this.targetRadius = this.baseRadius
    }
    this.radius += (this.targetRadius - this.radius) * 0.1
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  isHovered(mouseX, mouseY) {
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2)
    return distance < this.radius
  }
}

function Section1Opening() {
  const canvasRef = useRef(null)
  const peopleRef = useRef([])
  const animationRef = useRef(null)
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: { intelligence: 0, character: 0, potential: 0 }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize people
    const numPeople = Math.floor((canvas.width * canvas.height) / 15000)
    peopleRef.current = []

    for (let i = 0; i < numPeople; i++) {
      const radius = Math.random() * 15 + 8
      const x = Math.random() * (canvas.width - radius * 2) + radius
      const y = Math.random() * (canvas.height - radius * 2) + radius
      peopleRef.current.push(new Person(x, y, radius))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      peopleRef.current.forEach(person => {
        person.update(canvas)
        person.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    let hoveredPerson = null

    peopleRef.current.forEach(person => {
      person.hovered = person.isHovered(mouseX, mouseY)
      if (person.hovered) {
        hoveredPerson = person
      }
    })

    if (hoveredPerson) {
      setTooltip({
        visible: true,
        x: e.clientX + 20,
        y: e.clientY + 20,
        data: {
          intelligence: hoveredPerson.intelligence,
          character: hoveredPerson.character,
          potential: hoveredPerson.potential
        }
      })
    } else {
      setTooltip(prev => ({ ...prev, visible: false }))
    }
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
    peopleRef.current.forEach(person => person.hovered = false)
  }

  return (
    <section className="section section-1">
      <div className="content-wrapper">
        <h1 className="main-question fade-in">
          나라에 걸맞는 인재를<br />어떻게 알아낼 수 있을까?
        </h1>
        <p className="sub-question">
          지능, 애국심, 인성을 갖춘 관리를 어떻게 선발할 수 있을까?
        </p>
      </div>
      <canvas
        ref={canvasRef}
        className="people-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          <div className="tooltip-content">
            <p><strong>지능:</strong> {tooltip.data.intelligence}</p>
            <p><strong>인성:</strong> {tooltip.data.character}</p>
            <p><strong>잠재력:</strong> {tooltip.data.potential}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Section1Opening
