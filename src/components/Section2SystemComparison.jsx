import { useEffect, useRef, useState } from 'react'
import scrollama from 'scrollama'
import '../styles/Section2SystemComparison.css'

class Circle {
  constructor(x, y, radius, color = '#95a5a6') {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.radius = radius
    this.targetRadius = radius
    this.color = color
    this.targetColor = color
    this.alpha = 1
    this.targetAlpha = 1
  }

  update() {
    this.x += (this.targetX - this.x) * 0.05
    this.y += (this.targetY - this.y) * 0.05
    this.radius += (this.targetRadius - this.radius) * 0.05
    this.alpha += (this.targetAlpha - this.alpha) * 0.05
    this.color = this.targetColor
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }
}

function Section2SystemComparison() {
  const canvasRef = useRef(null)
  const circlesRef = useRef([])
  const animationRef = useRef(null)
  const scrollerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize circles
    const rows = 6
    const cols = 10
    const spacing = Math.min(canvas.width / (cols + 1), 80)
    const startX = (canvas.width - (cols - 1) * spacing) / 2
    const startY = (canvas.height - (rows - 1) * spacing) / 2

    circlesRef.current = []
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + j * spacing
        const y = startY + i * spacing
        circlesRef.current.push(new Circle(x, y, 15))
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      circlesRef.current.forEach(circle => {
        circle.update()
        circle.draw(ctx)
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Scrollama setup
    const scroller = scrollama()
    scrollerRef.current = scroller

    scroller
      .setup({
        step: '.step',
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter)

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scroller.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      scroller.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const resetCircles = () => {
    const canvas = canvasRef.current
    const rows = 6
    const cols = 10
    const spacing = Math.min(canvas.width / (cols + 1), 80)
    const startX = (canvas.width - (cols - 1) * spacing) / 2
    const startY = (canvas.height - (rows - 1) * spacing) / 2

    circlesRef.current.forEach((circle, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      circle.targetX = startX + col * spacing
      circle.targetY = startY + row * spacing
      circle.targetRadius = 15
      circle.targetColor = '#95a5a6'
      circle.targetAlpha = 1
    })
  }

  const showLottery = () => {
    resetCircles()
    setTimeout(() => {
      const selected = new Set()
      while (selected.size < 8) {
        selected.add(Math.floor(Math.random() * circlesRef.current.length))
      }
      circlesRef.current.forEach((circle, index) => {
        if (selected.has(index)) {
          circle.targetColor = '#3b5998'
        }
      })
    }, 500)
  }

  const showElection = () => {
    resetCircles()
    setTimeout(() => {
      const candidates = [10, 25, 45]
      candidates.forEach(index => {
        circlesRef.current[index].targetColor = '#e74c3c'
        circlesRef.current[index].targetRadius = 20
      })

      setTimeout(() => {
        circlesRef.current.forEach((circle, index) => {
          if (!candidates.includes(index)) {
            const nearestCandidate = candidates.reduce((nearest, candIdx) => {
              const distToNearest = Math.abs(circlesRef.current[nearest].x - circle.x) +
                                   Math.abs(circlesRef.current[nearest].y - circle.y)
              const distToCand = Math.abs(circlesRef.current[candIdx].x - circle.x) +
                                Math.abs(circlesRef.current[candIdx].y - circle.y)
              return distToCand < distToNearest ? candIdx : nearest
            }, candidates[0])

            circle.targetX = circlesRef.current[nearestCandidate].x + (Math.random() - 0.5) * 40
            circle.targetY = circlesRef.current[nearestCandidate].y + (Math.random() - 0.5) * 40
            circle.targetRadius = 8
            circle.targetAlpha = 0.6
          }
        })

        setTimeout(() => {
          circlesRef.current[25].targetRadius = 35
          circlesRef.current[25].targetColor = '#3b5998'
        }, 1000)
      }, 800)
    }, 500)
  }

  const showHereditary = () => {
    circlesRef.current.forEach(circle => {
      circle.targetAlpha = 0.2
      circle.targetRadius = 10
    })

    setTimeout(() => {
      const canvas = canvasRef.current
      const generations = [
        [{ x: 0.5, y: 0.2 }],
        [{ x: 0.3, y: 0.4 }, { x: 0.7, y: 0.4 }],
        [{ x: 0.2, y: 0.6 }, { x: 0.4, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.8, y: 0.6 }],
        [{ x: 0.15, y: 0.8 }, { x: 0.25, y: 0.8 }, { x: 0.35, y: 0.8 }, { x: 0.45, y: 0.8 },
         { x: 0.55, y: 0.8 }, { x: 0.65, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.85, y: 0.8 }]
      ]

      let circleIndex = 0
      generations.forEach(generation => {
        generation.forEach(pos => {
          if (circleIndex < circlesRef.current.length) {
            circlesRef.current[circleIndex].targetX = pos.x * canvas.width
            circlesRef.current[circleIndex].targetY = pos.y * canvas.height
            circlesRef.current[circleIndex].targetRadius = 18
            circlesRef.current[circleIndex].targetColor = '#3b5998'
            circlesRef.current[circleIndex].targetAlpha = 1
            circleIndex++
          }
        })
      })
    }, 500)
  }

  const showRecommendation = () => {
    resetCircles()
    setTimeout(() => {
      const canvas = canvasRef.current
      const recommenders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      recommenders.forEach(index => {
        circlesRef.current[index].targetColor = '#3b5998'
        circlesRef.current[index].targetY = canvas.height * 0.2
      })

      setTimeout(() => {
        const selected = [42, 35, 47, 38, 51, 44]
        selected.forEach(index => {
          circlesRef.current[index].targetColor = '#27ae60'
          circlesRef.current[index].targetY = canvas.height * 0.5
        })
      }, 1000)
    }, 500)
  }

  const showPurchase = () => {
    resetCircles()
    setTimeout(() => {
      const canvas = canvasRef.current
      const threshold = canvas.height * 0.5
      circlesRef.current.forEach((circle, index) => {
        if (circle.y < threshold) {
          setTimeout(() => {
            circle.targetColor = '#f4c542'
          }, index * 20)
        }
      })
    }, 500)
  }

  const showTransition = () => {
    const canvas = canvasRef.current
    circlesRef.current.forEach(circle => {
      circle.targetX = canvas.width / 2 + (Math.random() - 0.5) * 200
      circle.targetY = canvas.height / 2 + (Math.random() - 0.5) * 200
      circle.targetRadius = 12
      circle.targetColor = '#95a5a6'
      circle.targetAlpha = 0.5
    })
  }

  const handleStepEnter = (response) => {
    const system = response.element.dataset.system

    switch (system) {
      case 'intro':
        resetCircles()
        break
      case 'lottery':
        showLottery()
        break
      case 'election':
        showElection()
        break
      case 'hereditary':
        showHereditary()
        break
      case 'recommendation':
        showRecommendation()
        break
      case 'purchase':
        showPurchase()
        break
      case 'transition':
        showTransition()
        break
    }
  }

  return (
    <section className="section section-2">
      <div className="sticky-container">
        <canvas ref={canvasRef} className="systems-canvas" />
      </div>
      <div className="scroll-content">
        <div className="step" data-system="intro">
          <h2>기존의 여러 제도 비교</h2>
          <p>각 원이 움직이며 제도들을 시각화합니다</p>
        </div>

        <div className="step" data-system="lottery">
          <h2>추첨제 (抽籤制)</h2>
          <p>정렬된 회색 원에서 무작위로 몇 개만 선택</p>
          <div className="system-description">
            <p>모든 사람에게 동등한 기회를 주지만, 능력과 무관하게 선발됩니다.</p>
          </div>
        </div>

        <div className="step" data-system="election">
          <h2>선거 (選擧)</h2>
          <p>후보자 중 가장 많은 지지를 받는 사람을 선택</p>
          <div className="system-description">
            <p>대중의 의견을 반영하지만, 인기가 능력을 의미하지는 않습니다.</p>
          </div>
        </div>

        <div className="step" data-system="hereditary">
          <h2>상속/세습 (世襲)</h2>
          <p>가계도처럼 혈통을 따라 지위가 이어집니다</p>
          <div className="system-description">
            <p>안정적인 권력 승계가 가능하지만, 능력과 무관하게 결정됩니다.</p>
          </div>
        </div>

        <div className="step" data-system="recommendation">
          <h2>천거 (薦擧)</h2>
          <p>기존 관료들이 인재를 추천합니다</p>
          <div className="system-description">
            <p>경험자의 판단을 활용하지만, 연줄과 편견이 개입될 수 있습니다.</p>
          </div>
        </div>

        <div className="step" data-system="purchase">
          <h2>매관 (賣官)</h2>
          <p>돈을 지불하면 관직을 얻습니다</p>
          <div className="system-description">
            <p>재정 확보가 가능하지만, 능력보다 재력이 중요해집니다.</p>
          </div>
        </div>

        <div className="step" data-system="transition">
          <h2>그렇다면 가장 합리적인 방법은?</h2>
          <p>능력을 객관적으로 평가할 수 있는 제도가 필요합니다.</p>
        </div>
      </div>
    </section>
  )
}

export default Section2SystemComparison
