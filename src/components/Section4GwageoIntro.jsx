import { useEffect, useRef } from 'react'
import '../styles/Section4GwageoIntro.css'

class Circle {
  constructor(x, y, radius, imageSrc = null) {
    this.x = x
    this.y = y
    this.radius = radius
    this.targetRadius = radius
    this.alpha = 1.0
    this.targetAlpha = 1.0
    this.targetX = x
    this.targetY = y
    this.startX = x
    this.startY = y
    this.image = null
    this.imageSrc = imageSrc
    this.color = 'black'
    this.isSelected = false
    if (imageSrc) {
      this.loadImage(imageSrc)
    }
  }
  
  update() {
    // 부드러운 이동
    this.x += (this.targetX - this.x) * 0.1
    this.y += (this.targetY - this.y) * 0.1
    // 부드러운 alpha 변화
    this.alpha += (this.targetAlpha - this.alpha) * 0.1
    // 부드러운 radius 변화
    this.radius += (this.targetRadius - this.radius) * 0.1
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
    ctx.globalAlpha = this.alpha
    ctx.filter = 'grayscale(100%) brightness(0)'
    
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

function Section4GwageoIntro() {
  const canvasRef = useRef(null)
  const circlesRef = useRef([])
  const selectedIndicesRef = useRef([])
  const final33IndicesRef = useRef([])
  const textBlock4Ref = useRef(null)
  const textBlock5Ref = useRef(null)
  const textBlock6Ref = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const baseRadius = 16
    const selectedRadius = 24  // 선택된 원의 크기
    const circles = []
    const rows = 10
    const cols = 10
    const spacing = 56

    // 랜덤 Union 이미지 생성 함수
    const getRandomUnionImage = () => {
      const randomUnion = Math.floor(Math.random() * 49) + 1
      return `/assets/Union-${randomUnion}.png`
    }

    const totalWidth = (cols - 1) * spacing
    const totalHeight = (rows - 1) * spacing
    const startX = (canvas.width - totalWidth) / 2
    const startY = (canvas.height - totalHeight) / 2

    // 10x10 그리드 생성
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const circle = new Circle(
          startX + col * spacing,
          startY + row * spacing,
          baseRadius,
          getRandomUnionImage()
        )
        circle.startX = startX + col * spacing
        circle.startY = startY + row * spacing
        circles.push(circle)
      }
    }

    circlesRef.current = circles

    // 랜덤으로 10개 선택
    const selectedIndices = []
    const allIndices = Array.from({ length: 100 }, (_, i) => i)
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * allIndices.length)
      selectedIndices.push(allIndices[randomIndex])
      allIndices.splice(randomIndex, 1)
    }
    selectedIndicesRef.current = selectedIndices
    selectedIndices.forEach(idx => {
      circles[idx].isSelected = true
    })

    // 최종 33명 선택 (10개 중 첫 번째 + 새로운 32개)
    const final33Indices = [selectedIndices[0]] // 첫 번째 선택된 원
    const remainingIndices = Array.from({ length: 100 }, (_, i) => i).filter(i => !selectedIndices.includes(i))
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * remainingIndices.length)
      final33Indices.push(remainingIndices[randomIndex])
      remainingIndices.splice(randomIndex, 1)
    }
    final33IndicesRef.current = final33Indices

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      if (!textBlock4Ref.current || !textBlock5Ref.current || !textBlock6Ref.current) return

      const textBlock4Rect = textBlock4Ref.current.getBoundingClientRect()
      const textBlock5Rect = textBlock5Ref.current.getBoundingClientRect()
      const textBlock6Rect = textBlock6Ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const textBlock4Top = textBlock4Rect.top
      const textBlock5Top = textBlock5Rect.top
      const textBlock6Top = textBlock6Rect.top
      
      // 텍스트 블록 4가 화면에 나타나기 시작하는 시점 (타이밍 당기기)
      const fadeTo40Start = windowHeight * 0.9
      const fadeTo40End = windowHeight * 0.6
      
      // 원들 40%로 fade (텍스트 4가 나타나기 시작할 때)
      let fadeTo40Progress = 0
      if (textBlock4Top < fadeTo40Start && textBlock4Top > fadeTo40End) {
        // 40% fade 진행 중
        fadeTo40Progress = (fadeTo40Start - textBlock4Top) / (fadeTo40Start - fadeTo40End)
        fadeTo40Progress = Math.max(0, Math.min(1, fadeTo40Progress))
      } else if (textBlock4Top <= fadeTo40End) {
        fadeTo40Progress = 1
      }

      // 텍스트 블록 5가 올라올 때 정렬 시작 (아주 살짝 빨리 시작)
      const alignStart = windowHeight * 1.0
      const alignEnd = windowHeight * 0.7
      let alignProgress = 0

      if (textBlock5Top < alignStart && textBlock5Top > alignEnd) {
        // 정렬 진행 중
        alignProgress = (alignStart - textBlock5Top) / (alignStart - alignEnd)
        alignProgress = Math.max(0, Math.min(1, alignProgress))
      } else if (textBlock5Top <= alignEnd) {
        alignProgress = 1
      }

      // 정렬이 시작될 때 선발 못한 애들을 0%로 fade
      let fadeTo0Progress = 0
      if (alignProgress > 0) {
        fadeTo0Progress = alignProgress
      }

      // 텍스트 블록 5에서 정렬 완료 후, 스크롤을 더 하고 text-block-6이 나타나기 직전에 왼쪽 첫 번째 원만 선택 (크기 증가), 나머지 9개는 40% fade
      // 정렬이 완료된 후 시작 (alignProgress가 1이 되고, text-block-6이 나타나기 직전까지) - 아주 살짝 빨리 시작
      const selectStart = windowHeight * 1.1
      const selectEnd = windowHeight * 0.9
      let selectProgress = 0

      // 정렬이 완료된 후에만 선택 애니메이션 시작
      if (alignProgress >= 1 && textBlock6Top < selectStart) {
        if (textBlock6Top > selectEnd) {
          // 선택 진행 중
          selectProgress = (selectStart - textBlock6Top) / (selectStart - selectEnd)
          selectProgress = Math.max(0, Math.min(1, selectProgress))
        } else {
          selectProgress = 1
        }
      }

      // 텍스트 블록 6이 나타난 후 조금 이따 33명 배치 (3, 10, 10, 10)
      const arrange33Start = windowHeight * 0.7
      const arrange33End = windowHeight * 0.4
      let arrange33Progress = 0

      if (textBlock6Top < arrange33Start && textBlock6Top > arrange33End) {
        arrange33Progress = (arrange33Start - textBlock6Top) / (arrange33Start - arrange33End)
        arrange33Progress = Math.max(0, Math.min(1, arrange33Progress))
      } else if (textBlock6Top <= arrange33End) {
        arrange33Progress = 1
      }

      // 배치 완료 후 스크롤 텀을 두고 등급별 fade 및 장원급제 크게 표시
      const gradeFadeStart = windowHeight * 0.3
      const gradeFadeEnd = windowHeight * 0.1
      let gradeFadeProgress = 0

      if (arrange33Progress >= 1 && textBlock6Top < gradeFadeStart) {
        if (textBlock6Top > gradeFadeEnd) {
          gradeFadeProgress = (gradeFadeStart - textBlock6Top) / (gradeFadeStart - gradeFadeEnd)
          gradeFadeProgress = Math.max(0, Math.min(1, gradeFadeProgress))
        } else {
          gradeFadeProgress = 1
        }
      }

      // 원들 업데이트
      circles.forEach((circle, index) => {
        const final33Indices = final33IndicesRef.current
        const isInFinal33 = final33Indices.includes(index)
        const firstSelectedIndex = selectedIndices[0]
        const isFirstSelected = index === firstSelectedIndex
        const isOther9Selected = circle.isSelected && !isFirstSelected

        // 33명 배치 단계
        if (arrange33Progress > 0) {
          if (isInFinal33) {
            const final33Index = final33Indices.indexOf(index)
            
            // 레이아웃: 3, 10, 10, 10
            let row = 0
            let col = 0
            if (final33Index < 3) {
              row = 0
              col = final33Index
            } else if (final33Index < 13) {
              row = 1
              col = final33Index - 3
            } else if (final33Index < 23) {
              row = 2
              col = final33Index - 13
            } else {
              row = 3
              col = final33Index - 23
            }

            const rowSpacing = 80
            const colSpacing = 56
            const totalRows = 4
            const totalHeight = (totalRows - 1) * rowSpacing
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            
            // 각 행의 너비 계산
            let rowWidth = 0
            if (row === 0) {
              rowWidth = (3 - 1) * colSpacing
            } else {
              rowWidth = (10 - 1) * colSpacing
            }
            
            const startX = centerX - rowWidth / 2
            const startY = centerY - totalHeight / 2
            
            const targetX = startX + col * colSpacing
            const targetY = startY + row * rowSpacing

            if (isFirstSelected) {
              // 장원급제 (첫 번째 선택된 원): 기존 위치에서 이동 (왼쪽 위로)
              const currentX = circle.x
              const currentY = circle.y
              circle.targetX = currentX + (targetX - currentX) * arrange33Progress
              circle.targetY = currentY + (targetY - currentY) * arrange33Progress
              // 배치 완료 시 같은 크기, 이후 스크롤 텀을 두고 크게 표시
              if (arrange33Progress >= 1) {
                circle.targetRadius = baseRadius + (selectedRadius - baseRadius) * gradeFadeProgress
              } else {
                circle.targetRadius = baseRadius
              }
              circle.targetAlpha = 1.0
            } else {
              // 나머지 32개: fade in으로 나타남 (첫 번째 원 도착 타이밍에 완료)
              circle.targetX = targetX
              circle.targetY = targetY
              
              // 배치 완료 시 모두 100%, 이후 등급별 fade
              if (arrange33Progress >= 1) {
                // 등급별 opacity 설정
                if (final33Index < 3) {
                  // 갑과 나머지 2명 (1, 2): 100% 유지
                  circle.targetAlpha = 1.0
                } else if (final33Index === 3) {
                  // 을과 첫 번째 (3번): 100% 유지
                  circle.targetAlpha = 1.0
                } else if (final33Index < 10) {
                  // 을과 나머지 6명 (4-9): 100%에서 70%로 fade
                  circle.targetAlpha = 1.0 - (1.0 - 0.7) * gradeFadeProgress
                } else {
                  // 병과 23명 (10-32): 100%에서 40%로 fade
                  circle.targetAlpha = 1.0 - (1.0 - 0.4) * gradeFadeProgress
                }
              } else {
                // 배치 중에는 fade in
                circle.targetAlpha = arrange33Progress
              }
              circle.targetRadius = baseRadius
            }
          } else if (isOther9Selected) {
            // 이전 10개 중 선택되지 않은 9개: fade out
            circle.targetAlpha = 1.0 - arrange33Progress
            // 위치는 유지
            if (alignProgress > 0) {
              const selectedIndex = selectedIndices.indexOf(index)
              const totalSelected = 10
              const totalWidth = (totalSelected - 1) * spacing
              const centerX = canvas.width / 2
              const centerY = canvas.height / 2
              const startX = centerX - totalWidth / 2
              const targetX = startX + selectedIndex * spacing
              const targetY = centerY
              circle.targetX = circle.startX + (targetX - circle.startX) * alignProgress
              circle.targetY = circle.startY + (targetY - circle.startY) * alignProgress
            } else {
              circle.targetX = circle.startX
              circle.targetY = circle.startY
            }
            circle.targetRadius = baseRadius
          }
        } else if (circle.isSelected) {
          // 선택된 10개 (33명 배치 전)
          if (alignProgress > 0) {
            // 한 행으로 정렬
            const selectedIndex = selectedIndices.indexOf(index)
            const totalSelected = 10
            const totalWidth = (totalSelected - 1) * spacing
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const startX = centerX - totalWidth / 2
            const targetX = startX + selectedIndex * spacing
            const targetY = centerY
            
            circle.targetX = circle.startX + (targetX - circle.startX) * alignProgress
            circle.targetY = circle.startY + (targetY - circle.startY) * alignProgress
          } else {
            circle.targetX = circle.startX
            circle.targetY = circle.startY
          }

          // 왼쪽 첫 번째 원만 선택 (크기 증가), 나머지 9개는 40% fade
          if (index === firstSelectedIndex) {
            // 왼쪽 첫 번째: 크기 증가, 100% 유지
            circle.targetRadius = baseRadius + (selectedRadius - baseRadius) * selectProgress
            circle.targetAlpha = 1.0
          } else {
            // 나머지 9개: 40% fade
            circle.targetRadius = baseRadius
            circle.targetAlpha = 1.0 - (1.0 - 0.4) * selectProgress
          }
        } else {
          // 선택되지 않은 90개: 먼저 40%로 fade, 그 다음 정렬 시작할 때 0%로 fade
          // 1단계: 40%로 fade
          const alpha40 = 1.0 - (1.0 - 0.4) * fadeTo40Progress
          // 2단계: 정렬 시작할 때 0%로 fade
          const alpha0 = alpha40 - (alpha40 - 0) * fadeTo0Progress
          circle.targetAlpha = alpha0
          circle.targetX = circle.startX
          circle.targetY = circle.startY
          circle.targetRadius = baseRadius
        }
      })
    }

    // 원들 그리기 및 업데이트
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      circles.forEach(circle => {
        circle.update()
        circle.draw(ctx)
      })
      requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 실행

    // 리사이즈 핸들러
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      // 원 위치 재계산
      const newTotalWidth = (cols - 1) * spacing
      const newTotalHeight = (rows - 1) * spacing
      const newStartX = (canvas.width - newTotalWidth) / 2
      const newStartY = (canvas.height - newTotalHeight) / 2
      
      circles.forEach((circle, index) => {
        const row = Math.floor(index / cols)
        const col = index % cols
        circle.x = newStartX + col * spacing
        circle.y = newStartY + row * spacing
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="section section-4">
      <div className="section-4-content">
        {/* 첫 번째 텍스트 (중앙 정렬) */}
        <div className="text-block text-block-1">
          <p>많은 사람들은 시험제를 가장 공정하다고 여깁니다.</p>
          <p>기준이 공개되고 객관적인 점수로 결정되기 때문입니다.</p>
          <p>현재 우리가 가장 익숙하게 사용하는 방식이기도 합니다.</p>
        </div>

        {/* 두 번째 텍스트 (중앙 정렬) */}
        <div className="text-block text-block-2">
          <p>시험을 통해 인재를 선발하는 구조는 현대뿐 아니라 역사 속에서도 꾸준히 등장해 왔습니다.</p>
          <p>그 대표적인 예가 바로 조선의 과거제로, 일정한 절차와 기준을 갖춘 시험을 통해 관리를 선발하던 제도입니다.</p>
          <p>이름은 익숙한 이 과거제, 구체적으로 어떻게 운영되었는지 알고 있나요?</p>
        </div>

        {/* 세 번째 텍스트와 원 그리드 (왼쪽 정렬 + 오른쪽 원 고정) */}
        <div className="text-blocks-wrapper">
          <div className="text-blocks-container">
            {/* 세 번째 텍스트 */}
            <div className="text-block text-block-3">
              <p>조선의 과거제는 문과·무과·잡과로 이루어진</p>
              <p>국가 시험 제도였습니다.</p>
              <p className="text-spacer">시험은 기본적으로 3년마다 치르는 식년시가</p>
              <p>중심이었고, 국가의 경사나 필요에 따라 부정기 시험이</p>
              <p>추가로 시행되었습니다.</p>
              <p className="text-spacer">여러 과거 시험 중에서 국가 핵심 관료를 뽑는 중심은 문과였습니다.</p>
            </div>

            {/* 네 번째 텍스트 */}
            <div className="text-block-4-wrapper">
              <div className="text-block-4-container">
                <div className="text-block text-block-4" ref={textBlock4Ref}>
                  <p>조선의 문과 시험은 초시–복시–전시로 이어지는</p>
                  <p>세 단계의 구조를 갖고 있었으며,</p>
                  <p>각 단계마다 다시 초장·중장·종장의 세 번의 시험을</p>
                  <p>치렀습니다.</p>
                  <p className="text-spacer">첫 번째 단계인 초시는 지역별로 나뉘어</p>
                  <p>실시되었는데, 서울의 유생은 한성시에, 성균관 유생은</p>
                  <p>관시에, 지방 유생은 각 도에서 치르는 향시에</p>
                  <p>응시했습니다.</p>
                  <p className="text-spacer">이 초시에서 약 240명이 선발되었는데,</p>
                  <p>실제 응시자 수는 지역마다 수천 명에 달했기 때문에</p>
                  <p>대부분은 이 단계에서 탈락했습니다.</p>
                </div>
              </div>
            </div>

            {/* 다섯 번째 텍스트 */}
            <div className="text-block-5-wrapper">
              <div className="text-block-5-container">
                <div className="text-block text-block-5" ref={textBlock5Ref}>
                  <p>초시를 통과한 응시자들은 모두 한양으로 모여</p>
                  <p>복시를 치렀습니다.</p>
                  <p className="text-spacer">복시도 초장·중장·종장으로</p>
                  <p>이루어졌으며, 초시와 비슷했지만 더 높은 수준의</p>
                  <p>논리·문장력·경전 이해도를 요구했습니다.</p>
                  <p className="text-spacer">이 단계에서 240여 명 중 단 33명이 선발되었으며,</p>
                  <p>이 33명이 사실상 문과 합격자로 인정되었습니다.</p>
                  <p>숫자로 보면 약 85% 이상이 복시에서 걸러진 셈입니다.</p>
                </div>
              </div>
            </div>

            {/* 여섯 번째 텍스트 */}
            <div className="text-block-6-wrapper">
              <div className="text-block-6-container">
                <div className="text-block text-block-6" ref={textBlock6Ref}>
                  <p>마지막 단계인 전시는 왕 앞에서 치르는</p>
                  <p>시험이라는 점에서 상징적 의미가 컸습니다.</p>
                  <p className="text-spacer">전시는 복시 합격자 33명을 대상으로 열렸고,</p>
                  <p>더 이상 탈락 없이 최종 순위만 결정되었습니다.</p>
                  <p className="text-spacer">전시 결과에 따라 갑과 3인, 을과 7인,</p>
                  <p>병과 23인으로 등급이 나뉘었고,</p>
                  <p>이 중 1등이 바로 장원급제로 기록되었습니다.</p>
                  <p className="text-spacer">특히 갑과 합격자는 시험 직후 높은 관직으로</p>
                  <p>곧바로 진출했습니다.</p>
                </div>
              </div>
            </div>

          </div>

          {/* 오른쪽 고정 원 그리드 */}
          <div className="circles-grid-container">
            <canvas ref={canvasRef} className="circles-grid-canvas" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section4GwageoIntro

