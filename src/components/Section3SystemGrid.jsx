import { useEffect, useRef } from 'react'
import '../styles/Section3SystemGrid.css'

class Circle {
  constructor(x, y, radius, imageSrc = null) {
    this.x = x
    this.y = y
    this.radius = radius
    this.alpha = 1.0
    this.image = null
    this.imageSrc = imageSrc
    this.color = 'normal'
    if (imageSrc) {
      this.loadImage(imageSrc)
    }
  }

  loadImage(src) {
    const img = new Image()
    img.src = src
    img.onload = () => {
      this.image = img
    }
  }

  draw(ctx) {
    if (!this.image) return
    
    ctx.save()
    
    // 투명도 및 색상 필터 적용
    if (this.color === 'black') {
      ctx.globalAlpha = this.alpha
      ctx.filter = 'grayscale(100%) brightness(0)'
    } else {
      ctx.globalAlpha = this.alpha
      ctx.filter = 'none'
    }
    
    const size = this.radius * 2
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      size,
      size
    )
    ctx.restore()
  }
}

function SystemVisualization({ systemType }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 1.5
    canvas.height = rect.height * 1.5

    const baseRadius = 12  // 박스 크기 증가에 맞춰 원도 크게
    const selectedRadius = 18
    const circles = []

    // 랜덤 Union 이미지 생성 함수
    const getRandomUnionImage = () => {
      const randomUnion = Math.floor(Math.random() * 49) + 1
      return `/assets/Union-${randomUnion}.png`
    }

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    switch (systemType) {
      case 'lottery': {
        // 추첨: 5*10개 중 랜덤 5개 100% (나머지는 40%)
        const rows = 5
        const cols = 10
        const totalCount = rows * cols
        const spacing = 48
        const rowSpacing = 36
        
        // 랜덤으로 5개 선택
        const allIndices = Array.from({ length: totalCount }, (_, i) => i)
        const shuffled = allIndices.sort(() => Math.random() - 0.5)
        const selectedIndices = new Set(shuffled.slice(0, 5))
        
        const totalWidth = (cols - 1) * spacing
        const totalHeight = (rows - 1) * rowSpacing
        const startX = centerX - totalWidth / 2
        const startY = centerY - totalHeight / 2
        
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = row * cols + col
            const isSelected = selectedIndices.has(index)
            const circle = new Circle(
              startX + col * spacing,
              startY + row * rowSpacing,
              isSelected ? selectedRadius : baseRadius,
              getRandomUnionImage()
            )
            if (isSelected) {
              circle.color = 'black'
              circle.alpha = 1.0
            } else {
              circle.alpha = 0.4
            }
            circles.push(circle)
          }
        }
        break
      }

      case 'election': {
        // 선거: 5개의 서로 다른 크기, 가장 큰 게 100%
        const candidateCount = 5
        const spacing = 96
        const totalWidth = (candidateCount - 1) * spacing
        const startX = centerX - totalWidth / 2
        
        // 득표수에 따른 크기 (20, 10, 10, 7, 3)
        const votes = [20, 10, 10, 7, 3]
        const maxVotes = Math.max(...votes)
        const winnerIndex = votes.indexOf(maxVotes)
        
        // 크기 범위
        const minRadius = baseRadius
        const maxRadius = selectedRadius * 1.5
        
        for (let i = 0; i < candidateCount; i++) {
          const voteRatio = votes[i] / maxVotes
          const radius = minRadius + (maxRadius - minRadius) * voteRatio
          const circle = new Circle(
            startX + i * spacing,
            centerY,
            radius,
            getRandomUnionImage()
          )
          if (i === winnerIndex) {
            circle.color = 'black'
            circle.alpha = 1.0
          } else {
            circle.alpha = 0.4
          }
          circles.push(circle)
        }
        break
      }

      case 'hereditary': {
        // 세습: 2행, 위 행은 40%, 아래 행은 100%, 각 행에 5개씩
        const countPerRow = 5
        const spacing = 72
        const rowSpacing = 72
        const totalWidth = (countPerRow - 1) * spacing
        const startX = centerX - totalWidth / 2
        
        // 위 행 (40% opacity)
        for (let i = 0; i < countPerRow; i++) {
          const circle = new Circle(
            startX + i * spacing,
            centerY - rowSpacing / 2,
            baseRadius,
            getRandomUnionImage()
          )
          circle.alpha = 0.4
          circles.push(circle)
        }
        
        // 아래 행 (100% opacity, black)
        for (let i = 0; i < countPerRow; i++) {
          const circle = new Circle(
            startX + i * spacing,
            centerY + rowSpacing / 2,
            selectedRadius,
            getRandomUnionImage()
          )
          circle.color = 'black'
          circle.alpha = 1.0
          circles.push(circle)
        }
        break
      }

      case 'purchase': {
        // 매관: 위 행에 2개가 모이고, 아래 행에서는 5개 위치 중 하나가 빠진 상태(4개만), 오른쪽에가 selected
        const upperCount = 2
        const lowerTotalPositions = 5  // 5개 위치
        const lowerCount = 4  // 4개만 표시 (하나 빠짐)
        const spacing = 84
        const rowSpacing = 72
        const upperWidth = (upperCount - 1) * spacing
        const lowerWidth = (lowerTotalPositions - 1) * spacing
        const upperStartX = centerX - upperWidth / 2
        const lowerStartX = centerX - lowerWidth / 2
        
        // 랜덤으로 하나의 위치를 비움
        const emptyIndex = Math.floor(Math.random() * lowerTotalPositions)
        
        // 위 행 2개 (40% opacity, 중앙에 모임)
        for (let i = 0; i < upperCount; i++) {
          const circle = new Circle(
            upperStartX + i * spacing,
            centerY - rowSpacing / 2,
            baseRadius,
            getRandomUnionImage()
          )
          circle.alpha = 0.4
          circles.push(circle)
        }
        
        // 위 행 오른쪽에 selected (100% opacity, black)
        const selectedCircle = new Circle(
          upperStartX + (upperCount - 1) * spacing,
          centerY - rowSpacing / 2,
          selectedRadius,
          getRandomUnionImage()
        )
        selectedCircle.color = 'black'
        selectedCircle.alpha = 1.0
        circles.push(selectedCircle)
        
        // 아래 행 5개 위치 중 4개만 표시 (하나 비어있음)
        let lowerIndex = 0
        for (let i = 0; i < lowerTotalPositions; i++) {
          if (i === emptyIndex) continue  // 이 위치는 비움
          const circle = new Circle(
            lowerStartX + i * spacing,
            centerY + rowSpacing / 2,
            baseRadius,
            getRandomUnionImage()
          )
          circle.alpha = 0.4
          circles.push(circle)
          lowerIndex++
        }
        break
      }

      case 'recommendation': {
        // 천거: 아래 행에 4개 중 하나 selected, 위 행에는 중앙에 하나만 위치
        const lowerCount = 4
        const spacing = 84
        const rowSpacing = 72
        const lowerWidth = (lowerCount - 1) * spacing
        const lowerStartX = centerX - lowerWidth / 2
        
        const lowerSelected = Math.floor(Math.random() * lowerCount)
        
        // 위 행 중앙에 하나만 (100% opacity, black)
        const upperCircle = new Circle(
          centerX,
          centerY - rowSpacing / 2,
          selectedRadius,
          getRandomUnionImage()
        )
        upperCircle.color = 'black'
        upperCircle.alpha = 1.0
        circles.push(upperCircle)
        
        // 아래 행 4개 (하나 selected, 나머지 40% opacity)
        for (let i = 0; i < lowerCount; i++) {
          const isSelected = i === lowerSelected
          const circle = new Circle(
            lowerStartX + i * spacing,
            centerY + rowSpacing / 2,
            isSelected ? selectedRadius : baseRadius,
            getRandomUnionImage()
          )
          if (isSelected) {
            circle.color = 'black'
            circle.alpha = 1.0
          } else {
            circle.alpha = 0.4
          }
          circles.push(circle)
        }
        break
      }

      case 'exam': {
        // 시험제: 선 긋고, 통과한 5개는 선 위에, 통과 못한 30명은 선 아래에 작게 배치
        const passedCount = 5
        const failedCount = 30
        const lineY = centerY - 40  // 전체를 위로 올림
        const passedSpacing = 64
        const passedWidth = (passedCount - 1) * passedSpacing
        const passedStartX = centerX - passedWidth / 2
        
        // 통과 못한 30개 (선 아래, 작게 배치)
        const failedCols = 10
        const failedRows = 3
        const failedSpacing = 36
        const failedWidth = (failedCols - 1) * failedSpacing
        const failedStartX = centerX - failedWidth / 2
        const failedStartY = lineY + 20
        
        // 작은 원 크기
        const failedRadius = baseRadius * 0.7
        
        for (let row = 0; row < failedRows; row++) {
          for (let col = 0; col < failedCols; col++) {
            const circle = new Circle(
              failedStartX + col * failedSpacing,
              failedStartY + row * failedSpacing,
              failedRadius,
              getRandomUnionImage()
            )
            circle.alpha = 0.4
            circles.push(circle)
          }
        }
        
        // 통과한 5개 (선 위)
        for (let i = 0; i < passedCount; i++) {
          const circle = new Circle(
            passedStartX + i * passedSpacing,
            lineY - 30,
            selectedRadius,
            getRandomUnionImage()
          )
          circle.color = 'black'
          circle.alpha = 1.0
          circles.push(circle)
        }
        
        // 선 정보 저장 (animate 함수에서 사용)
        const examLineInfo = {
          x1: centerX - Math.max(passedWidth, failedWidth) / 2 - 10,
          x2: centerX + Math.max(passedWidth, failedWidth) / 2 + 10,
          y: lineY
        }
        break
      }

      default:
        break
    }

    // 원들 그리기
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 시험제인 경우 선 먼저 그리기
      if (systemType === 'exam') {
        const lineY = centerY - 40  // 전체를 위로 올림
        const examLineInfo = {
          x1: centerX - Math.max((5 - 1) * 64, (10 - 1) * 36) / 2 - 10,
          x2: centerX + Math.max((5 - 1) * 64, (10 - 1) * 36) / 2 + 10,
          y: lineY
        }
        ctx.save()
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(examLineInfo.x1, examLineInfo.y)
        ctx.lineTo(examLineInfo.x2, examLineInfo.y)
        ctx.stroke()
        ctx.restore()
      }
      
      circles.forEach(circle => circle.draw(ctx))
      requestAnimationFrame(animate)
    }
    animate()

    // 리사이즈 핸들러
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [systemType])

  return <canvas ref={canvasRef} className="system-visualization-canvas" />
}

function Section3SystemGrid() {
  const systems = [
    {
      title: '추첨',
      type: 'lottery',
      description: '지원자 간 차이를 고려하지 않고 무작위 절차를 통해 선발이 이루어지는 방식입니다.'
    },
    {
      title: '선거',
      type: 'election',
      description: '구성원들이 투표를 통해 특정 후보를 선택함으로써 선발이 결정되는 방식입니다.'
    },
    {
      title: '세습',
      type: 'hereditary',
      description: '지위나 역할이 특정 가계·가문에 따라 승계되는 방식입니다.'
    },
    {
      title: '매관',
      type: 'purchase',
      description: '지위나 권한이 금전이나 자원을 제공한 사람에게 이전되는 방식입니다.'
    },
    {
      title: '천거',
      type: 'recommendation',
      description: '권한을 가진 인물이나 기관이 적합하다고 판단한 사람을 추천해 선발이 이루어지는 방식입니다.'
    },
    {
      title: '시험제',
      type: 'exam',
      description: '시험을 통해 성적·점수 기반으로 선발하는 방식입니다.'
    }
  ]

  return (
    <section className="section section-3">
      <div className="section-3-content">
        <h2 className="section-3-question">어떤 제도가 가장 공정해보이시나요?</h2>
        <div className="systems-grid">
          {systems.map((system, index) => (
            <div key={index} className="system-card">
              <h3 className="system-title">{system.title}</h3>
              <div className="system-visualization">
                <SystemVisualization systemType={system.type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section3SystemGrid

