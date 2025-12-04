import { useEffect, useRef } from 'react'
import '../styles/Section2SystemComparison.css'

class Circle {
  constructor(x, y, radius, imageSrc = null) {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.radius = radius
    this.targetRadius = radius
    this.alpha = 0.4  // 초기 투명도: 40%
    this.targetAlpha = 0.4
    this.image = null
    this.imageSrc = imageSrc
    this.color = 'normal' // 색상은 그대로 유지
    this.targetColor = 'normal'
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

  update() {
    // 위치는 부드럽게 보간 (시험제 단계에서는 자연스러운 이동을 위해)
    this.x += (this.targetX - this.x) * 0.1
    this.y += (this.targetY - this.y) * 0.1
    this.radius += (this.targetRadius - this.radius) * 0.05
    this.alpha += (this.targetAlpha - this.alpha) * 0.05
    this.color = this.targetColor
  }

  draw(ctx) {
    if (!this.image) return
    
    ctx.save()
    
    // 투명도 및 색상 필터 적용
    if (this.color === 'black') {
      // Black: 검은색 필터 + 원본 투명도
    ctx.globalAlpha = this.alpha
      ctx.filter = 'grayscale(100%) brightness(0)'
    } else {
      // Normal: 투명도만 조절 (40% opacity)
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

// 원 배열 설정 상수
const CIRCLE_CONFIG = {
  rows: 5,
  cols: 10,
  baseRadius: 25,
  selectedRadius: 35, // 선택된 원의 크기
  spacing: 100
}

function Section2SystemComparison() {
  const canvasRef = useRef(null)
  const circlesRef = useRef([])
  const animationRef = useRef(null)
  const selectedCirclesRef = useRef(new Set()) // 선택된 원들 추적 (추첨)
  const candidatesRef = useRef([]) // 후보자들 (선거)
  const largestCandidateRef = useRef(null) // 가장 큰 후보자
  const hereditaryGenerationRef = useRef(0) // 세습 세대 (0: 첫 세대, 1: 다음 세대)
  const dividedCirclesRef = useRef([]) // 분열된 원들 (세습 2세대)
  const purchaseSelectedRef = useRef(null) // 매관에서 선택된 원 (위 열)
  const purchaseSelectedLowerRef = useRef(null) // 매관에서 선택된 원 (아래 열)
  const recommendationSelectedRef = useRef(null) // 천거에서 선택된 원 (아래 열)
  const examCirclesRef = useRef([]) // 시험제 단계의 원 배열 (3*10)
  const examLineProgressRef = useRef(0) // 시험제 선 그리기 진행도
  const examCirclesAppearProgressRef = useRef(0) // 시험제 원 배열 나타나기 진행도
  const examMoveProgressRef = useRef(0) // 시험제 원 이동 진행도
  const examPassProgressRef = useRef(0) // 시험제 통과한 원들 100% 변환 진행도
  const examPassedCirclesRef = useRef([]) // 시험 통과한 원들 (5개)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize circles with union images
    const { rows, cols, baseRadius, spacing: baseSpacing } = CIRCLE_CONFIG
    const spacing = Math.min(canvas.width / (cols + 1), baseSpacing)
    const startX = (canvas.width - (cols - 1) * spacing) / 2
    const startY = (canvas.height - (rows - 1) * spacing) / 2 + canvas.height * 0.1

    circlesRef.current = []
    const initialY = canvas.height + 100  // 초기 위치 (화면 아래)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = startX + j * spacing
        const targetY = startY + i * spacing
        // Random union image (1-49)
        const randomUnion = Math.floor(Math.random() * 49) + 1
        const imageSrc = `/assets/Union-${randomUnion}.png`
        const circle = new Circle(x, initialY, baseRadius, imageSrc)
        circle.targetY = initialY  // 초기 목표 위치도 아래
        circle.targetAlpha = 0.4  // 초기 투명도: 40%
        circlesRef.current.push(circle)
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      circlesRef.current.forEach(circle => {
        circle.update()
        circle.draw(ctx)
      })
      // 분열된 원들도 그리기
      dividedCirclesRef.current.forEach(circle => {
        circle.update()
        circle.draw(ctx)
      })
      
      // 시험제 단계: 선 그리기
      const examLineProgress = examLineProgressRef.current
      if (examLineProgress > 0) {
        ctx.save()
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        const centerY = canvas.height / 2
        const lineStartX = 0
        const lineEndX = canvas.width * examLineProgress  // 진행도에 따라 선 길이 조절
        ctx.beginPath()
        ctx.moveTo(lineStartX, centerY)
        ctx.lineTo(lineEndX, centerY)
        ctx.stroke()
        ctx.restore()
      }
      
      // 시험제 단계: 원 배열 처리
      const examCirclesAppearProgress = examCirclesAppearProgressRef.current
      const examMoveProgress = examMoveProgressRef.current
      const examPassProgress = examPassProgressRef.current
      const passedIndices = examPassedCirclesRef.current
      
      if (examCirclesAppearProgress > 0 && examCirclesRef.current.length > 0) {
        const totalCircles = examCirclesRef.current.length
        const centerY = canvas.height / 2
        const lineEndX = canvas.width  // 선의 끝 (오른쪽 끝)
        
        examCirclesRef.current.forEach((circle, index) => {
          const isPassed = passedIndices.includes(index)
          
          // 1단계: 원 배열 순차적 나타나기
          if (examMoveProgress === 0) {
            // 순차적으로 나타나기: 각 원은 자신의 순서에 맞춰 fade in
            const circleProgress = (index + 1) / totalCircles
            const appearProgress = examCirclesAppearProgress >= circleProgress 
              ? Math.min(1, (examCirclesAppearProgress - circleProgress) / (1 / totalCircles))
              : 0
            
            circle.targetAlpha = 0.4 * appearProgress  // 40% opacity로 나타남
            
            // 초기 위치 유지 (항상 startX, startY 위치에 고정)
            if (circle.startX !== undefined && circle.startY !== undefined) {
              circle.targetX = circle.startX
              circle.targetY = circle.startY
              circle.x = circle.startX
              circle.y = circle.startY
            }
          } 
          // 2단계: 원 이동 (모든 원이 동시에 위로 이동, 불규칙한 속도)
          else if (examMoveProgress > 0 && examPassProgress === 0) {
            // 제자리(원 배열이 나타난 위치)에서 출발
            const startX = circle.startX
            const startY = circle.startY
            const speed = circle.examSpeed || 0.5  // 각 원의 속도
            
            // 모든 원이 위로 이동하되, 속도에 따라 다른 거리 이동
            if (isPassed) {
              // 통과한 원: 빠른 속도로 선 위쪽의 정렬된 위치로 이동
              const finalX = circle.finalX
              const finalY = circle.finalY
              const horizontalOffset = circle.horizontalOffset || 0
              
              // Y 이동: 위로 이동 (startY에서 finalY로)
              const totalDistanceY = finalY - startY
              const moveDistanceY = totalDistanceY * speed * examMoveProgress
              circle.targetY = startY + moveDistanceY
              
              // X 이동: 정렬된 위치로 이동 (startX에서 finalX로, 약간의 좌우 움직임 포함)
              const totalDistanceX = finalX - startX
              const moveDistanceX = totalDistanceX * speed * examMoveProgress
              // 좌우 움직임은 이동 중간에 더 크게, 끝에서는 줄어듦
              const wiggleAmount = horizontalOffset * Math.sin(examMoveProgress * Math.PI)
              circle.targetX = startX + moveDistanceX + wiggleAmount
              
              circle.targetAlpha = 0.4  // 이동 중에는 40% 유지
            } else {
              // 통과하지 못한 원: 느린 속도로 선 근처에서 멈춤
              const stopY = circle.stopY
              const totalDistance = stopY - startY
              const moveDistance = totalDistance * speed * examMoveProgress
              const finalY = startY + moveDistance
              
              // 선 아래쪽을 넘지 않도록 제한
              circle.targetY = Math.min(finalY, stopY)
              
              // X는 약간의 불규칙성 추가 (클러스터 효과)
              const clusterOffsetX = circle.clusterOffsetX || 0
              circle.targetX = startX + clusterOffsetX * examMoveProgress
              circle.targetAlpha = 0.4  // 회색으로 유지
            }
          }
          // 3단계: 통과한 5개를 100%로 변환하고 선 위쪽에 정렬
          else if (examPassProgress > 0) {
            if (isPassed) {
              // 통과한 원들: 이미 정렬된 위치에서 100%로 변환
              const finalX = circle.finalX || circle.x
              const finalY = circle.finalY || (centerY - 150)
              
              // 정렬된 위치로 완전히 이동
              const currentX = circle.x
              const currentY = circle.y
              circle.targetX = currentX + (finalX - currentX) * examPassProgress
              circle.targetY = currentY + (finalY - currentY) * examPassProgress
              circle.x = circle.targetX
              circle.y = circle.targetY
              
              // 40% -> 100% fade in
              circle.targetAlpha = 0.4 + (1.0 - 0.4) * examPassProgress
              circle.targetColor = 'black'  // 검은색으로 변경
            } else {
              // 통과하지 못한 원들: 선 아래쪽에 회색으로 유지
              circle.targetAlpha = 0.4  // 회색 유지
              circle.targetColor = 'normal'  // 회색 유지
            }
          }
          
          circle.update()
          circle.draw(ctx)
        })
      }
      
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

  // 스크롤에 따라 원 배열이 올라오도록
  useEffect(() => {
    const handleScroll = () => {
    const canvas = canvasRef.current
      const section2 = document.querySelector('.section-2')
      if (!section2 || !canvas) return
      
      const windowHeight = window.innerHeight
      const section2Rect = section2.getBoundingClientRect()
      
      // Section2가 화면에 들어오는 정도 계산
      // 더 일찍 올라오도록 타이밍 조정
      const section2Top = section2Rect.top
      const fadeInStart = windowHeight * 1.0  // 더 일찍 시작 (화면 상단에서 100% 지점)
      const fadeInEnd = -windowHeight * 0.5   // 화면 위로 지나갈 때 완료
      
      // Section2가 화면에 들어오는 정도 (0 ~ 1) - 원 배열이 올라오는 progress
      let progress = 0
      if (section2Top < fadeInStart) {
        progress = (fadeInStart - section2Top) / (fadeInStart - fadeInEnd)
        progress = Math.max(0, Math.min(1, progress))
      }
      
      // 추첨 텍스트 fade-in/out
      const lotteryTextFadeInStart = -windowHeight * 0.8
      const lotteryTextFadeInEnd = -windowHeight * 1.5
      const lotteryTextFadeOutStart = -windowHeight * 2.0
      const lotteryTextFadeOutEnd = -windowHeight * 2.5
      
      let lotteryTextOpacity = 0
      if (section2Top < lotteryTextFadeInStart) {
        if (section2Top > lotteryTextFadeOutStart) {
          // Fade in
          const textProgress = (lotteryTextFadeInStart - section2Top) / (lotteryTextFadeInStart - lotteryTextFadeInEnd)
          lotteryTextOpacity = Math.max(0, Math.min(1, textProgress))
        } else {
          // Fade out
          const textProgress = (lotteryTextFadeOutStart - section2Top) / (lotteryTextFadeOutStart - lotteryTextFadeOutEnd)
          lotteryTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        }
      }
      
      // 추첨 단계: 랜덤 선택 애니메이션 시작 시점
      const lotterySelectionStart = -windowHeight * 0.9
      const lotterySelectionEnd = -windowHeight * 1.2
      let lotterySelectionProgress = 0
      if (section2Top < lotterySelectionStart) {
        lotterySelectionProgress = (lotterySelectionStart - section2Top) / (lotterySelectionStart - lotterySelectionEnd)
        lotterySelectionProgress = Math.max(0, Math.min(1, lotterySelectionProgress))
      }
      
      // 선거 단계: 후보자들에 점들이 모이는 애니메이션
      // 추첨 텍스트가 fade-out 완료된 후 시작 (추첨 로직 완성 후)
      const electionStart = -windowHeight * 2.5  // 추첨 텍스트 fade-out 완료 후
      const electionMoveEnd = -windowHeight * 3.0  // 이동 완료 시점 (이동 중에 크기 조절 완료)
      const electionVoterFadeOutStart = -windowHeight * 3.2  // 투표자들 fade-out 시작
      const electionVoterFadeOutEnd = -windowHeight * 3.4  // 투표자들 fade-out 완료
      const electionResizeStart = -windowHeight * 3.4  // 후보자 크기 조절 시작 (투표자 fade-out 완료 후)
      const electionResizeEnd = -windowHeight * 3.6  // 후보자 크기 조절 완료
      const electionCandidateFadeOutStart = -windowHeight * 3.6  // 후보자 fade-out 시작
      const electionEnd = -windowHeight * 3.8      // 선거 완료 시점 (후보자 fade-out 완료)
      
      // 선거 텍스트 fade-out (선거 완료 후 스크롤 간격을 두고)
      const electionTextFadeOutStart = -windowHeight * 4.2  // 선거 텍스트 fade-out 시작
      const electionTextFadeOutEnd = -windowHeight * 4.5  // 선거 텍스트 fade-out 완료
      
      // 세습 단계: 선거 텍스트 fade-out과 동시에 시작
      const hereditaryStart = -windowHeight * 4.2  // 세습 시작 (선거 텍스트 fade-out과 동시)
      const hereditaryTextFadeInStart = -windowHeight * 4.2  // 세습 텍스트 fade-in 시작
      const hereditaryTextFadeInEnd = -windowHeight * 4.5  // 세습 텍스트 fade-in 완료
      const hereditaryTextFadeOutStart = -windowHeight * 5.5  // 세습 텍스트 fade-out 시작
      const hereditaryTextFadeOutEnd = -windowHeight * 5.8  // 세습 텍스트 fade-out 완료
      const hereditaryResetStart = -windowHeight * 4.5  // 원 5개를 100%로 맞추기 시작 (세습 텍스트 fade-in 완료 시점)
      const hereditaryResetEnd = -windowHeight * 4.7  // 원 5개를 100%로 맞추기 완료
      const hereditaryDivisionStart = -windowHeight * 5.0  // 원 분열 시작 (스크롤 텀 추가)
      const hereditaryDivisionEnd = -windowHeight * 5.3  // 원 분열 완료

      // 매관 단계: 분열 완료 후 긴 스크롤 텀을 두고 시작
      const purchaseStart = -windowHeight * 5.8  // 매관 시작 (긴 스크롤 텀)
      const purchaseMergeStart = -windowHeight * 5.8  // 위 열 중앙 모이기 + 아래 열 40% fade 시작
      const purchaseMergeEnd = -windowHeight * 6.2  // 위 열 중앙 모이기 + 아래 열 40% fade 완료
      const purchaseTextFadeInStart = -windowHeight * 5.8  // 매관 텍스트 fade-in 시작 (모이기와 동시)
      const purchaseTextFadeInEnd = -windowHeight * 6.2  // 매관 텍스트 fade-in 완료 (모이기 완료와 동시)
      const purchaseSelectStart = -windowHeight * 6.5  // 아래 열 선택된 원 위로 이동 + 위 열 재정렬 시작
      const purchaseSelectEnd = -windowHeight * 6.8  // 아래 열 선택된 원 위로 이동 + 위 열 재정렬 완료
      const purchaseOpacityStart = -windowHeight * 7.0  // opacity 변경 시작 (위 열 40%, 선택된 원 100%)
      const purchaseOpacityEnd = -windowHeight * 7.3  // opacity 변경 완료

      // 천거 단계: 매관 완료 후 긴 스크롤 텀을 두고 시작
      const recommendationStart = -windowHeight * 7.8  // 천거 시작 (긴 스크롤 텀)
      const recommendationTextFadeInStart = -windowHeight * 7.8  // 천거 텍스트 fade-in 시작
      const recommendationTextFadeInEnd = -windowHeight * 8.2  // 천거 텍스트 fade-in 완료
      const recommendationTextFadeOutStart = -windowHeight * 9.5  // 천거 텍스트 fade-out 시작 (늦춤)
      const recommendationTextFadeOutEnd = -windowHeight * 9.8  // 천거 텍스트 fade-out 완료 (늦춤)
      
      // 시험제 단계: 천거 완료 후 시작
      const examStart = -windowHeight * 9.8  // 시험제 시작 (천거 텍스트 fade-out 완료 시점)
      const examTextFadeInStart = -windowHeight * 9.8  // 시험제 텍스트 fade-in 시작
      const examTextFadeInEnd = -windowHeight * 10.2  // 시험제 텍스트 fade-in 완료
      const examTextFadeOutStart = -windowHeight * 12.0  // 시험제 텍스트 fade-out 시작 (늦춤 - 통과 완료 후)
      const examTextFadeOutEnd = -windowHeight * 12.3  // 시험제 텍스트 fade-out 완료
      const examLineStart = -windowHeight * 9.8  // 선 그리기 시작 (텍스트 fade-in과 동시)
      const examLineEnd = -windowHeight * 10.0  // 선 그리기 완료
      const examCirclesAppearStart = -windowHeight * 10.0  // 원 배열 나타나기 시작 (선 그리기 완료 후)
      const examCirclesAppearEnd = -windowHeight * 10.5  // 원 배열 나타나기 완료
      const examMoveStart = -windowHeight * 10.8  // 원 이동 시작 (원 배열 나타나기 완료 후 스크롤 텀)
      const examMoveEnd = -windowHeight * 11.5  // 원 이동 완료
      const examPassStart = -windowHeight * 11.5  // 통과한 5개 100% 변환 시작
      const examPassEnd = -windowHeight * 11.8  // 통과한 5개 100% 변환 완료
      const recommendationMergeStart = -windowHeight * 7.8  // 위 행 2개 합치기 + 아래 행 4개 재정렬 시작
      const recommendationMergeEnd = -windowHeight * 8.2  // 위 행 2개 합치기 + 아래 행 4개 재정렬 완료
      const recommendationSelectStart = -windowHeight * 8.5  // 아래 행 랜덤 1개 선택 시작 (스크롤 텀)
      const recommendationSelectEnd = -windowHeight * 8.8  // 아래 행 랜덤 1개 선택 완료 (100% fade in)

      // 선거 텍스트 fade-in/out
      const electionTextFadeInStart = electionStart
      const electionTextFadeInEnd = electionMoveEnd
      
      let electionTextOpacity = 0
      if (section2Top < electionTextFadeInStart) {
        if (section2Top > electionTextFadeOutStart) {
          // Fade in
          const textProgress = (electionTextFadeInStart - section2Top) / (electionTextFadeInStart - electionTextFadeInEnd)
          electionTextOpacity = Math.max(0, Math.min(1, textProgress))
        } else if (section2Top > electionTextFadeOutEnd) {
          // Fade out
          const textProgress = (electionTextFadeOutStart - section2Top) / (electionTextFadeOutStart - electionTextFadeOutEnd)
          electionTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        } else {
          // Fade out 완료
          electionTextOpacity = 0
        }
      }
      
      let electionProgress = 0
      let moveProgress = 0  // 이동 진행도 (0 ~ 1) - 이동 중에 크기 조절도 함께 진행
      let voterFadeOutProgress = 0  // 투표자 fade-out 진행도 (0 ~ 1)
      let candidateResizeProgress = 0  // 후보자 크기 조절 진행도 (0 ~ 1)
      let candidateFadeOutProgress = 0  // 후보자 fade-out 진행도 (0 ~ 1)
      
      // 세습 단계 진행도
      let hereditaryTextOpacity = 0
      let hereditaryResetProgress = 0  // 원 5개를 100%로 맞추기 진행도
      let hereditaryDivisionProgress = 0  // 원 분열 진행도

      // 매관 단계 진행도
      let purchaseTextOpacity = 0  // 매관 텍스트 투명도
      let purchaseMergeProgress = 0  // 위 열 중앙 모이기 + 아래 열 40% fade 진행도
      let purchaseSelectProgress = 0  // 아래 열 선택된 원 위로 이동 + 위 열 재정렬 진행도
      let purchaseOpacityProgress = 0  // opacity 변경 진행도

      // 천거 단계 진행도
      let recommendationTextOpacity = 0  // 천거 텍스트 투명도
      let recommendationMergeProgress = 0  // Phase 1: 위 행 2개 합치기 + 아래 행 4개 재정렬 진행도
      let recommendationSelectProgress = 0  // Phase 2: 아래 행 랜덤 1개 선택 진행도
      
      // 시험제 단계 진행도
      let examTextOpacity = 0  // 시험제 텍스트 투명도
      let examLineProgress = 0  // 선 그리기 진행도
      let examCirclesAppearProgress = 0  // 원 배열 나타나기 진행도
      let examMoveProgress = 0  // 원 이동 진행도
      let examPassProgress = 0  // 통과한 원들 100% 변환 진행도

      if (section2Top < electionStart) {
        const totalRange = electionStart - electionEnd
        const currentProgress = (electionStart - section2Top) / totalRange
        electionProgress = Math.max(0, Math.min(1, currentProgress))
        
        // 이동 단계 (크기 조절 포함), 투표자 fade-out, 후보자 크기 조절, 후보자 fade-out 분리
        const moveRange = electionStart - electionMoveEnd
        const voterFadeOutRange = electionVoterFadeOutStart - electionVoterFadeOutEnd
        const candidateResizeRange = electionResizeStart - electionResizeEnd
        const candidateFadeOutRange = electionCandidateFadeOutStart - electionEnd
        
        if (section2Top > electionMoveEnd) {
          // 이동 단계 (이동 중에 크기 조절도 함께 완료)
          moveProgress = (electionStart - section2Top) / moveRange
          moveProgress = Math.max(0, Math.min(1, moveProgress))
          voterFadeOutProgress = 0
          candidateResizeProgress = 0
          candidateFadeOutProgress = 0
        } else if (section2Top > electionVoterFadeOutEnd) {
          // 투표자 fade-out 단계
          moveProgress = 1
          voterFadeOutProgress = (electionVoterFadeOutStart - section2Top) / voterFadeOutRange
          voterFadeOutProgress = Math.max(0, Math.min(1, voterFadeOutProgress))
          candidateResizeProgress = 0
          candidateFadeOutProgress = 0
        } else if (section2Top > electionResizeEnd) {
          // 후보자 크기 조절 단계 (투표자 fade-out 완료 후)
          moveProgress = 1
          voterFadeOutProgress = 1
          candidateResizeProgress = (electionResizeStart - section2Top) / candidateResizeRange
          candidateResizeProgress = Math.max(0, Math.min(1, candidateResizeProgress))
          candidateFadeOutProgress = 0
        } else {
          // 후보자 fade-out 단계 (크기 조절 완료 후)
          moveProgress = 1
          voterFadeOutProgress = 1
          candidateResizeProgress = 1
          candidateFadeOutProgress = (electionCandidateFadeOutStart - section2Top) / candidateFadeOutRange
          candidateFadeOutProgress = Math.max(0, Math.min(1, candidateFadeOutProgress))
        }
      }
      
      // 세습 단계 처리
      if (section2Top < hereditaryStart) {
        // 세습 텍스트 fade-in/out (선거 텍스트와 동일한 로직)
        if (section2Top > hereditaryTextFadeOutStart) {
          // Fade in
          const textProgress = (hereditaryTextFadeInStart - section2Top) / (hereditaryTextFadeInStart - hereditaryTextFadeInEnd)
          hereditaryTextOpacity = Math.max(0, Math.min(1, textProgress))
        } else if (section2Top > hereditaryTextFadeOutEnd) {
          // Fade out
          const textProgress = (hereditaryTextFadeOutStart - section2Top) / (hereditaryTextFadeOutStart - hereditaryTextFadeOutEnd)
          hereditaryTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        } else {
          // Fade out 완료
          hereditaryTextOpacity = 0
        }

        // 원 5개를 100%로 맞추기
        if (section2Top < hereditaryResetEnd) {
          hereditaryResetProgress = (hereditaryResetStart - section2Top) / (hereditaryResetStart - hereditaryResetEnd)
          hereditaryResetProgress = Math.max(0, Math.min(1, hereditaryResetProgress))
        } else {
          hereditaryResetProgress = 1
        }

        // 원 분열 진행도 계산
        if (section2Top < hereditaryDivisionStart) {
          if (section2Top > hereditaryDivisionEnd) {
            hereditaryDivisionProgress = (hereditaryDivisionStart - section2Top) / (hereditaryDivisionStart - hereditaryDivisionEnd)
            hereditaryDivisionProgress = Math.max(0, Math.min(1, hereditaryDivisionProgress))
          } else {
            hereditaryDivisionProgress = 1
          }
        }
      }

      // 매관 단계 처리
      if (section2Top < purchaseStart) {
        // 세습 단계 변수들을 1로 유지 (매관 로직이 실행되도록)
        hereditaryResetProgress = 1
        hereditaryDivisionProgress = 1

        // 매관 텍스트 fade-in/out
        const purchaseTextFadeOutStart = recommendationTextFadeInStart  // 천거 시작과 동시에 fade-out
        const purchaseTextFadeOutEnd = recommendationTextFadeInEnd  // 천거 텍스트 fade-in 완료 시점

        if (section2Top > purchaseTextFadeOutStart) {
          // Fade in
          if (section2Top > purchaseTextFadeInEnd) {
            const textProgress = (purchaseTextFadeInStart - section2Top) / (purchaseTextFadeInStart - purchaseTextFadeInEnd)
            purchaseTextOpacity = Math.max(0, Math.min(1, textProgress))
          } else {
            purchaseTextOpacity = 1
          }
        } else if (section2Top > purchaseTextFadeOutEnd) {
          // Fade out
          const textProgress = (purchaseTextFadeOutStart - section2Top) / (purchaseTextFadeOutStart - purchaseTextFadeOutEnd)
          purchaseTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        } else {
          // Fade out 완료
          purchaseTextOpacity = 0
        }

        // 위 열 원들이 중앙으로 모이는 진행도
        if (section2Top > purchaseMergeEnd) {
          purchaseMergeProgress = (purchaseMergeStart - section2Top) / (purchaseMergeStart - purchaseMergeEnd)
          purchaseMergeProgress = Math.max(0, Math.min(1, purchaseMergeProgress))
        } else {
          purchaseMergeProgress = 1
        }

        // Phase 2: 아래 열 선택된 원 위로 이동 + 위 열 재정렬 진행도
        if (section2Top < purchaseSelectStart) {
          if (section2Top > purchaseSelectEnd) {
            purchaseSelectProgress = (purchaseSelectStart - section2Top) / (purchaseSelectStart - purchaseSelectEnd)
            purchaseSelectProgress = Math.max(0, Math.min(1, purchaseSelectProgress))
          } else {
            purchaseSelectProgress = 1
          }
        }

        // Phase 3: opacity 변경 진행도
        if (section2Top < purchaseOpacityStart) {
          if (section2Top > purchaseOpacityEnd) {
            purchaseOpacityProgress = (purchaseOpacityStart - section2Top) / (purchaseOpacityStart - purchaseOpacityEnd)
            purchaseOpacityProgress = Math.max(0, Math.min(1, purchaseOpacityProgress))
          } else {
            purchaseOpacityProgress = 1
          }
        }

        // 랜덤 선택 (한 번만 실행) - 위 열용
        if (purchaseMergeProgress > 0 && purchaseSelectedRef.current === null && candidatesRef.current.length > 0) {
          const randomIndex = Math.floor(Math.random() * candidatesRef.current.length)
          purchaseSelectedRef.current = candidatesRef.current[randomIndex]
        }

        // 랜덤 선택 (한 번만 실행) - 아래 열용
        if (purchaseMergeProgress > 0 && purchaseSelectedLowerRef.current === null && dividedCirclesRef.current.length > 0) {
          const randomIndex = Math.floor(Math.random() * dividedCirclesRef.current.length)
          purchaseSelectedLowerRef.current = randomIndex
        }
      }

      // 천거 단계 처리
      if (section2Top < recommendationStart) {
        // 천거 텍스트 fade-in/out
        if (section2Top > recommendationTextFadeOutStart) {
          // Fade in
          const textProgress = (recommendationTextFadeInStart - section2Top) / (recommendationTextFadeInStart - recommendationTextFadeInEnd)
          recommendationTextOpacity = Math.max(0, Math.min(1, textProgress))
        } else if (section2Top > recommendationTextFadeOutEnd) {
          // Fade out
          const textProgress = (recommendationTextFadeOutStart - section2Top) / (recommendationTextFadeOutStart - recommendationTextFadeOutEnd)
          recommendationTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        } else {
          // Fade out 완료
          recommendationTextOpacity = 0
        }

        // Phase 1: 위 행 2개 합치기 + 아래 행 4개 재정렬 진행도
        if (section2Top > recommendationMergeEnd) {
          recommendationMergeProgress = (recommendationMergeStart - section2Top) / (recommendationMergeStart - recommendationMergeEnd)
          recommendationMergeProgress = Math.max(0, Math.min(1, recommendationMergeProgress))
          recommendationSelectProgress = 0  // Phase 1 진행 중에는 Phase 2는 0
        } else {
          recommendationMergeProgress = 1
          
          // Phase 2: 아래 행 랜덤 1개 선택 (Phase 1 완료 후 한 번만 실행)
          if (recommendationSelectProgress === 0 && recommendationSelectedRef.current === null && dividedCirclesRef.current.length > 0) {
            // 아래 행 4개 중에서 랜덤으로 1개 선택 (이미 위로 올라간 원 제외)
            const availableIndices = []
            for (let i = 0; i < dividedCirclesRef.current.length; i++) {
              if (i !== purchaseSelectedLowerRef.current) {
                availableIndices.push(i)
              }
            }
            if (availableIndices.length > 0) {
              const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
              recommendationSelectedRef.current = randomIndex
            }
          }
          
          // Phase 2: 아래 행 랜덤 1개 선택 진행도 (Phase 1 완료 후 시작)
          if (section2Top > recommendationSelectEnd) {
            recommendationSelectProgress = (recommendationSelectStart - section2Top) / (recommendationSelectStart - recommendationSelectEnd)
            recommendationSelectProgress = Math.max(0, Math.min(1, recommendationSelectProgress))
          } else {
            recommendationSelectProgress = 1
          }
        }
      }
      
      // 시험제 단계 처리
      if (section2Top < examStart) {
        // 시험제 텍스트 fade-in/out (다른 텍스트들과 동일한 로직)
        if (section2Top > examTextFadeOutStart) {
          // Fade in
          const textProgress = (examTextFadeInStart - section2Top) / (examTextFadeInStart - examTextFadeInEnd)
          examTextOpacity = Math.max(0, Math.min(1, textProgress))
        } else if (section2Top > examTextFadeOutEnd) {
          // Fade out
          const textProgress = (examTextFadeOutStart - section2Top) / (examTextFadeOutStart - examTextFadeOutEnd)
          examTextOpacity = Math.max(0, Math.min(1, 1 - textProgress))
        } else {
          // Fade out 완료
          examTextOpacity = 0
        }
        
        // 선 그리기 진행도
        if (section2Top > examLineEnd) {
          examLineProgress = (examLineStart - section2Top) / (examLineStart - examLineEnd)
          examLineProgress = Math.max(0, Math.min(1, examLineProgress))
          examCirclesAppearProgress = 0  // 선 그리기 완료 전에는 원 배열은 0
        } else {
          examLineProgress = 1
          
          // 원 배열 나타나기 진행도 (선 그리기 완료 후)
          if (section2Top > examCirclesAppearEnd) {
            examCirclesAppearProgress = (examCirclesAppearStart - section2Top) / (examCirclesAppearStart - examCirclesAppearEnd)
            examCirclesAppearProgress = Math.max(0, Math.min(1, examCirclesAppearProgress))
            examMoveProgress = 0  // 원 배열 나타나기 중에는 이동은 0
            examPassProgress = 0  // 원 배열 나타나기 중에는 통과는 0
          } else {
            examCirclesAppearProgress = 1
            
            // 원 이동 진행도 (원 배열 나타나기 완료 후)
            if (section2Top > examMoveEnd) {
              examMoveProgress = (examMoveStart - section2Top) / (examMoveStart - examMoveEnd)
              examMoveProgress = Math.max(0, Math.min(1, examMoveProgress))
              examPassProgress = 0  // 이동 중에는 통과는 0
            } else {
              examMoveProgress = 1
              
              // 통과한 원들 100% 변환 진행도 (이동 완료 후)
              if (section2Top > examPassEnd) {
                examPassProgress = (examPassStart - section2Top) / (examPassStart - examPassEnd)
                examPassProgress = Math.max(0, Math.min(1, examPassProgress))
              } else {
                examPassProgress = 1
              }
            }
          }
        }
        
        // 통과한 5개 원 선택 (원 배열 생성 시 한 번만 실행)
        if (examCirclesAppearProgress > 0 && examPassedCirclesRef.current.length === 0 && examCirclesRef.current.length > 0) {
          // 30개 중 랜덤으로 5개 선택
          const allIndices = examCirclesRef.current.map((_, index) => index)
          const shuffled = allIndices.sort(() => Math.random() - 0.5)
          examPassedCirclesRef.current = shuffled.slice(0, 5)
          
          // 통과한 5개의 최종 정렬 위치 계산
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const spacing = 80
          const totalWidth = (examPassedCirclesRef.current.length - 1) * spacing
          const startX = centerX - totalWidth / 2
          const targetY = centerY - 150  // 선 위쪽
          
          // 각 원에 불규칙한 속도와 목표 위치 부여
          examCirclesRef.current.forEach((circle, index) => {
            const isPassed = examPassedCirclesRef.current.includes(index)
            if (isPassed) {
              // 통과한 원: 빠른 속도 (0.8 ~ 1.0)
              circle.examSpeed = 0.8 + Math.random() * 0.2
              // 통과한 원의 최종 정렬 위치
              const passedIndex = examPassedCirclesRef.current.indexOf(index)
              circle.finalX = startX + passedIndex * spacing
              circle.finalY = targetY
              // 약간의 좌우 움직임을 위한 오프셋
              circle.horizontalOffset = (Math.random() - 0.5) * 40
            } else {
              // 통과하지 못한 원: 느린 속도 (0.3 ~ 0.6)
              circle.examSpeed = 0.3 + Math.random() * 0.3
              // 선 아래쪽에 멈춤 위치
              circle.stopY = centerY + 30 + Math.random() * 80
              circle.clusterOffsetX = (Math.random() - 0.5) * 50
            }
          })
        }
        
        // ref에 진행도 저장 (animate 함수에서 사용)
        examLineProgressRef.current = examLineProgress
        examCirclesAppearProgressRef.current = examCirclesAppearProgress
        examMoveProgressRef.current = examMoveProgress
        examPassProgressRef.current = examPassProgress
        
        // 시험제 원 배열 생성 (한 번만 실행)
        if (examLineProgress > 0 && examCirclesRef.current.length === 0) {
          const examRows = 3
          const examCols = 10
          const { baseRadius: examBaseRadius, spacing: examBaseSpacing } = CIRCLE_CONFIG
          const examSpacing = Math.min(canvas.width / (examCols + 1), examBaseSpacing)
          const examStartX = (canvas.width - (examCols - 1) * examSpacing) / 2
          const examCenterY = canvas.height / 2
          const examStartY = examCenterY + 50  // 선 아래에 배치
          
          // Union 이미지 경로
          const unionImagePath = '/assets/Union.png'
          
          for (let row = 0; row < examRows; row++) {
            for (let col = 0; col < examCols; col++) {
              const x = examStartX + col * examSpacing
              const y = examStartY + row * examSpacing
              const circle = new Circle(x, y, examBaseRadius, unionImagePath)
              circle.targetAlpha = 0  // 처음에는 보이지 않음
              circle.alpha = 0
              // 초기 위치 저장 (이동 시작점)
              circle.startX = x
              circle.startY = y
              circle.x = x
              circle.y = y
              circle.targetX = x
              circle.targetY = y
              examCirclesRef.current.push(circle)
            }
          }
        }
      }
      
      // 시험제 단계가 시작되면 이전 원들 숨기기
      if (examLineProgress > 0) {
        // 이전 원들 모두 숨기기
    circlesRef.current.forEach(circle => {
          circle.targetAlpha = 0
        })
        dividedCirclesRef.current.forEach(circle => {
          circle.targetAlpha = 0
        })
      }
      
      // 시험제 단계가 시작되면 이전 원들 숨기기
      if (examLineProgress > 0) {
        // 이전 원들 모두 숨기기
        circlesRef.current.forEach(circle => {
          circle.targetAlpha = 0
        })
        dividedCirclesRef.current.forEach(circle => {
          circle.targetAlpha = 0
        })
      }
      
      // 전체 원 배열이 아래에서 올라오도록 (배열 구조 유지)
      if (circlesRef.current.length > 0 && examLineProgress === 0) {
        const { rows, cols, baseRadius, selectedRadius, spacing: baseSpacing } = CIRCLE_CONFIG
        const spacing = Math.min(canvas.width / (cols + 1), baseSpacing)
        const startX = (canvas.width - (cols - 1) * spacing) / 2
        const startY = (canvas.height - (rows - 1) * spacing) / 2 + windowHeight * 0.1
        const initialOffset = canvas.height + 100
        const targetOffset = 0
        
        // 전체 그룹의 offset 계산 (progress에 따라)
        const groupOffset = initialOffset + (targetOffset - initialOffset) * progress
        
        // 추첨 단계: 랜덤 선택 (한 번만 실행)
        if (lotterySelectionProgress > 0 && selectedCirclesRef.current.size === 0) {
      const selected = new Set()
          while (selected.size < 5) { // 5개로 변경
        selected.add(Math.floor(Math.random() * circlesRef.current.length))
      }
          selectedCirclesRef.current = selected
        }
        
        // 선거 단계: 후보자 선택 (한 번만 실행)
        if (electionProgress > 0 && candidatesRef.current.length === 0 && selectedCirclesRef.current.size > 0) {
          // 추첨에서 선택된 5개 중에서 후보자 선택 (랜덤 순서)
          const selectedIndices = Array.from(selectedCirclesRef.current)
          // 순서를 랜덤하게 섞기
          const shuffled = selectedIndices.sort(() => Math.random() - 0.5)
          const candidateIndices = shuffled.slice(0, 5) // 5개 후보자
          candidatesRef.current = candidateIndices
        }
        
        // 선거 단계: 후보자들을 화면 가운데에 정렬
        const candidatePositions = []
        if (electionProgress > 0 && candidatesRef.current.length > 0) {
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2 + groupOffset
          const candidateSpacing = spacing * 2.5  // 간격 더 늘림
          const totalWidth = (candidatesRef.current.length - 1) * candidateSpacing
          const startCandidateX = centerX - totalWidth / 2
          
          candidatesRef.current.forEach((candidateIndex, idx) => {
            candidatePositions.push({
              index: candidateIndex,
              x: startCandidateX + idx * candidateSpacing,
              y: centerY
            })
          })
        }
        
        // 선거 단계: 고정된 득표수 할당 (20, 10, 10, 7, 3)
        const fixedVotes = [20, 10, 10, 7, 3] // 총 50표
        const candidateVotes = new Map()
        if (electionProgress > 0 && candidatePositions.length > 0) {
          candidatePositions.forEach(({ index: candidateIndex }, idx) => {
            // 고정된 득표수 할당
            const votes = fixedVotes[idx] || 0
            candidateVotes.set(candidateIndex, votes)
          })
          
          // 가장 많은 표를 받은 후보자 찾기
          let maxVotes = 0
          let largestCandidate = null
          candidateVotes.forEach((votes, candidateIndex) => {
            if (votes > maxVotes) {
              maxVotes = votes
              largestCandidate = candidateIndex
            }
          })
          largestCandidateRef.current = largestCandidate
        }
        
        // 최대 득표수 계산 (크기 비례를 위해)
        const maxVotes = candidateVotes.size > 0 
          ? Math.max(...Array.from(candidateVotes.values()))
          : 0
        
      circlesRef.current.forEach((circle, index) => {
          const row = Math.floor(index / cols)
          const col = index % cols
          const baseY = startY + row * spacing
          
          const isSelected = selectedCirclesRef.current.has(index)
          const isCandidate = candidatesRef.current.includes(index)
          
          // 추첨 단계: 선택된 원들 처리
          if (lotterySelectionProgress > 0 && isSelected && electionProgress === 0) {
            // 추첨 단계: 선택된 원
            circle.y = baseY + groupOffset
            circle.x = startX + col * spacing
            circle.targetY = circle.y
            circle.targetX = circle.x
            circle.targetColor = 'black'
            circle.targetRadius = selectedRadius
            circle.targetAlpha = 1.0
          } else if (lotterySelectionProgress > 0 && !isSelected && electionProgress === 0) {
            // 추첨 단계: 선택되지 않은 원
            circle.y = baseY + groupOffset
            circle.x = startX + col * spacing
            circle.targetY = circle.y
            circle.targetX = circle.x
            circle.targetColor = 'normal'
            circle.targetRadius = baseRadius
            circle.targetAlpha = 0.4
          } else if (electionProgress > 0 && moveProgress !== undefined) {
            if (isCandidate) {
              // 후보자: 화면 가운데에 정렬
              const candidatePos = candidatePositions.find(pos => pos.index === index)
              if (candidatePos) {
                const originalX = startX + col * spacing
                const originalY = baseY + groupOffset
                
                // 가운데로 이동하는 애니메이션 (moveProgress에 따라)
                circle.targetX = originalX + (candidatePos.x - originalX) * moveProgress
                circle.targetY = originalY + (candidatePos.y - originalY) * moveProgress
                circle.x = circle.targetX
                circle.y = circle.targetY
              }
              
              circle.targetColor = 'black'
              
              // 득표수에 비례해서 크기 증가 (더 극명하게)
              const votes = candidateVotes.get(index) || 0
              const voteRatio = maxVotes > 0 ? votes / maxVotes : 0
              
              // 이동 완료 시점에 크기 조절 완료 (이동 중에 크기 조절)
              const minRadius = baseRadius
              const maxRadius = baseRadius + (selectedRadius - baseRadius) * 8  // 크기 차이를 더 크게
              
              // 이동 중에 득표수 비율에 따라 크기 조절 완료
              const voteBasedRadius = minRadius + (maxRadius - minRadius) * voteRatio * moveProgress
              
              // 후보자 크기 조절 단계: 당선자는 크게, 나머지는 원래 크기로
              if (candidateResizeProgress > 0) {
                if (index === largestCandidateRef.current && maxVotes > 0) {
                  // 당선자: 크게 증가
                  const targetMaxRadius = baseRadius + (selectedRadius - baseRadius) * 6
                  circle.targetRadius = voteBasedRadius + (targetMaxRadius - voteBasedRadius) * candidateResizeProgress
                } else {
                  // 다른 후보자: 원래 크기로 감소
                  circle.targetRadius = voteBasedRadius + (baseRadius - voteBasedRadius) * candidateResizeProgress
                }
              } else {
                // 크기 조절 전: 이동 완료 시점의 크기 유지
                circle.targetRadius = voteBasedRadius
              }
              
              // fade-out 단계에서 크기 조절: 당선자는 추첨 시 선택된 정도까지, 나머지는 원래 크기로
              // 세습 단계가 시작되기 전에만 적용
              if (candidateFadeOutProgress > 0 && hereditaryResetProgress === 0) {
                const isLargest = index === largestCandidateRef.current && maxVotes > 0
                
                if (isLargest) {
                  // 당선자: 추첨 시 선택된 정도의 사이즈까지 줄어듦
                  const currentRadius = circle.targetRadius
                  const targetRadius = selectedRadius  // 추첨 시 선택된 정도
                  circle.targetRadius = currentRadius + (targetRadius - currentRadius) * candidateFadeOutProgress
                } else {
                  // 다른 후보자: 원래 원만큼 사이즈가 줄어듦
                  const currentRadius = circle.targetRadius
                  const targetRadius = baseRadius  // 원래 크기
                  circle.targetRadius = currentRadius + (targetRadius - currentRadius) * candidateFadeOutProgress
                }
              }
              
              // 후보자 투명도: 크기 조절 완료 전까지는 모두 100%, 크기 조절 완료 후 당선 후보만 100% 나머지 40%
              if (candidateResizeProgress < 1) {
                // 크기 조절 완료 전: 모든 후보자 100%
                circle.targetAlpha = 1.0
              } else if (candidateFadeOutProgress >= 1) {
                // fade-out 단계 완료 후: 당선 후보만 100%, 나머지 40%
                if (index === largestCandidateRef.current && maxVotes > 0) {
                  circle.targetAlpha = 1.0
                } else {
                  circle.targetAlpha = 0.4
                }
              } else if (candidateFadeOutProgress > 0) {
                // fade-out 단계 중: 크기 조절 중에는 모두 100%, 크기 조절 완료 후 투명도 변경
                // 크기 조절이 완료된 후에만 투명도 변경 (fade-out 진행도가 0.5 이상일 때)
                if (candidateFadeOutProgress >= 0.5) {
                  if (index === largestCandidateRef.current && maxVotes > 0) {
                    // 당선자: 100% 유지
                    circle.targetAlpha = 1.0
                  } else {
                    // 다른 후보자: 40%로 변경 (크기 조절 완료 후)
                    const fadeAlphaProgress = (candidateFadeOutProgress - 0.5) / 0.5  // 0.5 ~ 1.0 구간에서 0 ~ 1로 변환
                    circle.targetAlpha = 1.0 + (0.4 - 1.0) * fadeAlphaProgress
                  }
                } else {
                  // 크기 조절 중: 모두 100%
                  circle.targetAlpha = 1.0
                }
              } else {
                // 크기 조절 완료 후: 당선 후보만 100%, 나머지 40%
                if (index === largestCandidateRef.current && maxVotes > 0) {
                  circle.targetAlpha = 1.0
                } else {
                  circle.targetAlpha = 0.4
                }
              }
              
              // 세습 단계: 원 5개를 100%로 맞추기 (세습 텍스트 fade-in 완료 시점)
              if (hereditaryResetProgress > 0) {
    const canvas = canvasRef.current
                const centerX = canvas.width / 2
                const centerY = canvas.height / 2 + groupOffset
                const candidateSpacing = spacing * 2.5
                const totalWidth = (candidatesRef.current.length - 1) * candidateSpacing
                const startCandidateX = centerX - totalWidth / 2

                // 후보자 인덱스 찾기
                const candidateIdx = candidatesRef.current.indexOf(index)
                const divisionGap = spacing * 1.5  // 위아래 간격 (더 크게)

                if (candidateIdx !== -1 && candidateIdx < 5) {
                  // 가운데에 정렬된 위치
                  const originalX = startCandidateX + candidateIdx * candidateSpacing
                  const originalY = centerY

                  // 천거 단계가 시작되면 천거 우선, 아니면 매관
                  if (recommendationMergeProgress > 0) {
                    // 천거 단계: 위 행 2개 합치기 + 아래 행 4개 재정렬
                    const targetCenterX = canvas.width / 2
                    const targetCenterY = canvas.height / 2 - windowHeight * 0.1
                    const candidateSpacing = spacing * 2.5

                    // 상단 행 원들: 2개 → 1개 (중앙으로 합치기)
                    const startX = originalX
                    const startY = originalY

                    // 선택된 원인지 확인
                    const isSelectedUpper = index === purchaseSelectedRef.current

                    if (isSelectedUpper) {
                      // 선택된 원 (왼쪽에 있던 원): 중앙으로 이동
                      // Phase 3 완료 후 위치 (왼쪽)
                      const totalCircles = 2
                      const totalWidth = (totalCircles - 1) * candidateSpacing
                      const phase3StartX = targetCenterX - totalWidth / 2
                      const phase3X = phase3StartX  // 왼쪽 위치

                      // 중앙으로 이동 (X, Y 모두 중앙으로)
                      circle.targetX = phase3X + (targetCenterX - phase3X) * recommendationMergeProgress
                      circle.targetY = startY + (targetCenterY - startY) * recommendationMergeProgress  // Y도 중앙으로
                      circle.x = circle.targetX
                      circle.y = circle.targetY
                      circle.targetRadius = selectedRadius
                      circle.targetColor = 'black'
                      circle.targetAlpha = 0.4  // 40% 유지
                    } else {
                      // 선택되지 않은 원들: 계속 사라진 상태
                      circle.targetAlpha = 0
                    }

                    // 하단 행 원들: 4개를 중앙에 재정렬
                    if (dividedCirclesRef.current.length > candidateIdx) {
                      const dividedCircle = dividedCirclesRef.current[candidateIdx]
                      const dividedX = originalX
                      const dividedY = originalY + divisionGap

                      if (candidateIdx === purchaseSelectedLowerRef.current) {
                        // 선택된 원 (위로 올라간 원): 중앙으로 이동하여 합쳐짐
                        // Phase 3 완료 후 위치 (오른쪽)
                        const totalCircles = 2
                        const totalWidth = (totalCircles - 1) * candidateSpacing
                        const phase3StartX = targetCenterX - totalWidth / 2
                        const phase3X = phase3StartX + 1 * candidateSpacing  // 오른쪽 위치

                        // 중앙으로 이동
                        dividedCircle.targetX = phase3X + (targetCenterX - phase3X) * recommendationMergeProgress
                        dividedCircle.targetY = targetCenterY
                        dividedCircle.x = dividedCircle.targetX
                        dividedCircle.y = dividedCircle.targetY
                        dividedCircle.targetRadius = selectedRadius
                        dividedCircle.targetColor = 'black'
                        dividedCircle.targetAlpha = 1.0  // 100% 유지
                      } else {
                        // 선택되지 않은 원들 (아래 행 4개): 4개 기준으로 중앙 재정렬
                        // 현재는 5개 기준 배치에서 한 칸이 비어있음
                        // 4개 기준으로 재정렬

                        // 선택되지 않은 원들의 새로운 인덱스 계산
                        let newIndex = 0
                        for (let i = 0; i < dividedCirclesRef.current.length; i++) {
                          if (i === purchaseSelectedLowerRef.current) continue
                          if (i === candidateIdx) break
                          newIndex++
                        }

                        // 4개 원을 중앙에 정렬
                        const totalCircles = 4
                        const totalWidth = (totalCircles - 1) * candidateSpacing
                        const newStartX = targetCenterX - totalWidth / 2
                        const newTargetX = newStartX + newIndex * candidateSpacing

                        dividedCircle.targetX = dividedX + (newTargetX - dividedX) * recommendationMergeProgress
                        dividedCircle.targetY = dividedY
                        dividedCircle.x = dividedCircle.targetX
                        dividedCircle.y = dividedCircle.targetY
                        dividedCircle.targetRadius = selectedRadius
                        dividedCircle.targetColor = 'black'
                        
                        // Phase 2: 선택된 원은 100%로 fade in, 나머지는 40% 유지
                        if (recommendationSelectProgress > 0) {
                          if (candidateIdx === recommendationSelectedRef.current) {
                            // 선택된 원: 40% -> 100% fade in
                            dividedCircle.targetAlpha = 0.4 + (1.0 - 0.4) * recommendationSelectProgress
                          } else {
                            // 나머지 원들: 40% 유지
                            dividedCircle.targetAlpha = 0.4
                          }
                        } else {
                          // Phase 1 완료 전: 40% 유지
                          dividedCircle.targetAlpha = 0.4
                        }
                      }
                    }
                  } else if (purchaseMergeProgress > 0 || purchaseSelectProgress > 0 || purchaseOpacityProgress > 0) {
                    // 매관 단계: Phase 1, 2, 3
                    const targetCenterX = canvas.width / 2
                    const targetCenterY = canvas.height / 2 - windowHeight * 0.1
                    const candidateSpacing = spacing * 2.5

                    // 상단 행 원들
                    const startX = originalX
                    const startY = originalY

                    // 선택된 원인지 확인
                    const isSelectedUpper = index === purchaseSelectedRef.current

                    if (isSelectedUpper) {
                      // 선택된 원: Phase 1에서 중앙으로, Phase 2에서 왼쪽으로 재정렬

                      // Phase 1 완료 후 위치 (중앙)
                      let phase1X = targetCenterX
                      let phase1Y = targetCenterY

                      // Phase 2: 2개 원 (선택된 1개 + 아래에서 올라온 1개)을 중앙에 재정렬
                      const totalCircles = 2
                      const totalWidth = (totalCircles - 1) * candidateSpacing
                      const phase2StartX = targetCenterX - totalWidth / 2
                      const phase2TargetX = phase2StartX  // 왼쪽 (첫 번째 위치)
                      const phase2TargetY = targetCenterY

                      if (purchaseSelectProgress > 0) {
                        // Phase 2: 왼쪽으로 재정렬
                        circle.targetX = phase1X + (phase2TargetX - phase1X) * purchaseSelectProgress
                        circle.targetY = phase1Y + (phase2TargetY - phase1Y) * purchaseSelectProgress
                      } else {
                        // Phase 1: 중앙으로 이동
                        circle.targetX = startX + (phase1X - startX) * purchaseMergeProgress
                        circle.targetY = startY + (phase1Y - startY) * purchaseMergeProgress
                      }

                      circle.x = circle.targetX
                      circle.y = circle.targetY
                      circle.targetRadius = selectedRadius
                      circle.targetColor = 'black'

                      // Phase 3: opacity 변경
                      if (purchaseOpacityProgress > 0) {
                        // 선택된 원: 100% → 40%
                        circle.targetAlpha = 1.0 + (0.4 - 1.0) * purchaseOpacityProgress
                      } else {
                        // Phase 1, 2: 100%
                        circle.targetAlpha = 1.0
                      }
                    } else {
                      // 선택되지 않은 원들: Phase 1에서 사라짐
                      circle.targetX = startX
                      circle.targetY = startY
                      circle.x = startX
                      circle.y = startY
                      circle.targetRadius = selectedRadius
                      circle.targetColor = 'black'

                      // Phase 1에서 fade out, 이후 계속 0
                      if (purchaseSelectProgress > 0 || purchaseOpacityProgress > 0) {
                        circle.targetAlpha = 0
                      } else {
                        circle.targetAlpha = 1.0 + (0 - 1.0) * purchaseMergeProgress
                      }
                    }

                    // 하단 행 원들
                    if (dividedCirclesRef.current.length > candidateIdx) {
                      const dividedCircle = dividedCirclesRef.current[candidateIdx]
                      const dividedX = originalX
                      const dividedY = originalY + divisionGap

                      if (candidateIdx === purchaseSelectedLowerRef.current) {
                        // 선택된 원: Phase 2에서 위로 이동 (오른쪽)
                        if (purchaseSelectProgress > 0) {
                          // Phase 2: 2개 원을 중앙에 배치 (왼쪽: 선택된 위 열, 오른쪽: 아래에서 올라온 원)
                          const totalCircles = 2
                          const totalWidth = (totalCircles - 1) * candidateSpacing
                          const phase2StartX = targetCenterX - totalWidth / 2
                          const phase2SelectedX = phase2StartX + 1 * candidateSpacing  // 오른쪽 (두 번째 위치)
                          const phase2SelectedY = targetCenterY

                          dividedCircle.targetX = dividedX + (phase2SelectedX - dividedX) * purchaseSelectProgress
                          dividedCircle.targetY = dividedY + (phase2SelectedY - dividedY) * purchaseSelectProgress
                          dividedCircle.x = dividedCircle.targetX
                          dividedCircle.y = dividedCircle.targetY

                          // 이동 중에 검은색으로 변경
                          dividedCircle.targetColor = 'black'

                          // Phase 3: 선택된 원만 100% 유지
                          if (purchaseOpacityProgress > 0) {
                            dividedCircle.targetAlpha = 1.0
                          } else {
                            dividedCircle.targetAlpha = 1.0
                          }
                        } else {
                          // Phase 1: 아래에서 40%로 fade
                          dividedCircle.targetX = dividedX
                          dividedCircle.targetY = dividedY
                          dividedCircle.x = dividedX
                          dividedCircle.y = dividedY
                          dividedCircle.targetColor = 'black'
                          dividedCircle.targetAlpha = 1.0 + (0.4 - 1.0) * purchaseMergeProgress
                        }
                      } else {
                        // 선택되지 않은 원들: 그대로 유지, 40%
                        dividedCircle.targetX = dividedX
                        dividedCircle.targetY = dividedY
                        dividedCircle.x = dividedX
                        dividedCircle.y = dividedY
                        dividedCircle.targetColor = 'black'
                        dividedCircle.targetAlpha = 1.0 + (0.4 - 1.0) * purchaseMergeProgress
                      }

                      dividedCircle.targetRadius = selectedRadius
                    }
                  } else if (hereditaryDivisionProgress > 0) {
                    // 분열 단계: 원이 위아래로 분열
                    
                    // 원래 원은 위치 고정 (움직이지 않음)
                    circle.targetY = originalY
                    circle.y = originalY

                    // 위치는 고정, 투명도는 40%로 페이드
                    circle.targetX = originalX
                    circle.x = originalX
                    circle.targetAlpha = 1.0 + (0.4 - 1.0) * hereditaryDivisionProgress  // 100% -> 40%
                    circle.targetRadius = selectedRadius

                    // 분열된 원 생성 (한 번만 실행)
                    if (dividedCirclesRef.current.length < 5) {
                      const dividedCircle = new Circle(originalX, originalY, selectedRadius, circle.imageSrc)
                      dividedCircle.targetAlpha = 0  // 처음에는 투명
                      dividedCircle.alpha = 0
                      dividedCircle.targetColor = 'black'
                      dividedCirclesRef.current.push(dividedCircle)
                    }

                    // 분열된 원 업데이트 (아래로만 이동하면서 나타남)
                    if (dividedCirclesRef.current.length > candidateIdx) {
                      const dividedCircle = dividedCirclesRef.current[candidateIdx]
                      const targetLowerY = originalY + divisionGap  // 아래로만 이동

                      dividedCircle.targetY = originalY + (targetLowerY - originalY) * hereditaryDivisionProgress
                      dividedCircle.y = dividedCircle.targetY
                      dividedCircle.targetX = originalX
                      dividedCircle.x = originalX
                      dividedCircle.targetAlpha = hereditaryDivisionProgress  // 서서히 나타남
                      dividedCircle.targetRadius = selectedRadius
                      dividedCircle.targetColor = 'black'
                    }
                  } else {
                    // 분열 전: 리셋 단계
                    // 현재 투명도와 크기 가져오기 (선거 단계에서의 상태)
                    const currentAlpha = circle.targetAlpha
                    const currentRadius = circle.targetRadius

                    // 모든 원을 100% 투명도로
                    circle.targetAlpha = currentAlpha + (1.0 - currentAlpha) * hereditaryResetProgress

                    // 모든 원을 당선자 크기(selectedRadius)로 맞추기
                    circle.targetRadius = currentRadius + (selectedRadius - currentRadius) * hereditaryResetProgress

                    // 위치는 가운데 유지
                    circle.targetX = originalX
                    circle.targetY = originalY
                    circle.x = originalX
                    circle.y = originalY
                  }
                }
              }
            } else {
              // 후보자가 아닌 원들(투표자들): 고정된 득표수에 따라 각 후보자에게 배분
              // 총 50표를 각 후보자에게 배분 (20, 10, 10, 7, 3)
              const fixedVotes = [20, 10, 10, 7, 3]
              
              // 투표자 fade-out 완료 후: 투표자들은 모두 숨김
              if (voterFadeOutProgress >= 1) {
                circle.targetAlpha = 0
                circle.targetRadius = 0
                return
              }
              
              // 현재 원이 후보자가 아닌 원들 중 몇 번째인지 계산
              let nonCandidateIndex = 0
              circlesRef.current.forEach((otherCircle, otherIndex) => {
                if (!candidatesRef.current.includes(otherIndex) && otherIndex < index) {
                  nonCandidateIndex++
                }
              })
              
              // 득표수에 따라 후보자 배정
              let voteCount = 0
              let assignedCandidateIdx = 0
              for (let i = 0; i < fixedVotes.length; i++) {
                if (nonCandidateIndex >= voteCount && nonCandidateIndex < voteCount + fixedVotes[i]) {
                  assignedCandidateIdx = i
        break
    }
                voteCount += fixedVotes[i]
              }
              
              const targetCandidatePos = candidatePositions[assignedCandidateIdx]
              const assignedCandidateOriginalIndex = candidatesRef.current[assignedCandidateIdx] // 후보자의 원래 인덱스
              
              if (targetCandidatePos) {
                // 점들이 후보자에게 모이는 애니메이션
                const originalX = startX + col * spacing
                const originalY = baseY + groupOffset
                
                circle.targetX = originalX + (targetCandidatePos.x - originalX) * moveProgress
                circle.targetY = originalY + (targetCandidatePos.y - originalY) * moveProgress
                circle.x = circle.targetX
                circle.y = circle.targetY
              }
              
              circle.targetColor = 'normal'
              circle.targetRadius = baseRadius
              
              // 투표자 fade-out 애니메이션 적용
              const baseAlpha = 0.4
              
              // 후보자 이동 중에는 모든 원들 40%, 이동 완료 후 당선 후보에 모인 원들만 100%
              if (moveProgress < 1) {
                // 이동 중: 후보자가 아닌 모든 원들 40%
                circle.targetAlpha = baseAlpha * (1 - voterFadeOutProgress)
              } else {
                // 이동 완료 후: 당선 후보에 모인 원들만 100%, 나머지 40% (투표자 fade-out 전까지)
                // assignedCandidateOriginalIndex가 당선 후보의 원래 인덱스와 일치하는지 확인
                if (assignedCandidateOriginalIndex === largestCandidateRef.current && maxVotes > 0) {
                  circle.targetAlpha = 1.0
                } else {
                  circle.targetAlpha = (baseAlpha * (1 - voterFadeOutProgress))
                }
              }
            }
          } else if (lotterySelectionProgress > 0 && isSelected) {
            // 추첨 단계: 선택된 원
            circle.y = baseY + groupOffset
            circle.x = startX + col * spacing
            circle.targetY = circle.y
            circle.targetX = circle.x
            circle.targetColor = 'black'
            circle.targetRadius = selectedRadius
            circle.targetAlpha = 1.0
          } else {
            // 기본 원
            circle.y = baseY + groupOffset
            circle.x = startX + col * spacing
            circle.targetY = circle.y
            circle.targetX = circle.x
            circle.targetColor = 'normal'
            circle.targetRadius = baseRadius
            circle.targetAlpha = 0.4
          }
        })
      }
      
      // Canvas는 항상 보이도록 (원 배열은 먼저 띄움)
      if (canvas) {
        canvas.style.opacity = 1
      }
      
      // 텍스트 표시
      const lotteryContent = document.querySelector('.lottery-content')
      const electionContent = document.querySelector('.election-content')
      const hereditaryContent = document.querySelector('.hereditary-content')
      const purchaseContent = document.querySelector('.purchase-content')
      const recommendationContent = document.querySelector('.recommendation-content')

      if (lotteryContent) {
        lotteryContent.style.opacity = lotteryTextOpacity
        lotteryContent.style.pointerEvents = lotteryTextOpacity > 0.1 ? 'auto' : 'none'
      }

      if (electionContent) {
        electionContent.style.opacity = electionTextOpacity
        electionContent.style.pointerEvents = electionTextOpacity > 0.1 ? 'auto' : 'none'
      }

      if (hereditaryContent) {
        hereditaryContent.style.opacity = hereditaryTextOpacity
        hereditaryContent.style.pointerEvents = hereditaryTextOpacity > 0.1 ? 'auto' : 'none'
      }

      if (purchaseContent) {
        purchaseContent.style.opacity = purchaseTextOpacity
        purchaseContent.style.pointerEvents = purchaseTextOpacity > 0.1 ? 'auto' : 'none'
      }

      if (recommendationContent) {
        recommendationContent.style.opacity = recommendationTextOpacity
        recommendationContent.style.pointerEvents = recommendationTextOpacity > 0.1 ? 'auto' : 'none'
      }

      const examContent = document.querySelector('.exam-content')
      if (examContent) {
        examContent.style.opacity = examTextOpacity
        examContent.style.pointerEvents = examTextOpacity > 0.1 ? 'auto' : 'none'
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 실행
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <section className="section section-2">
      <div className="sticky-container">
        <canvas ref={canvasRef} className="systems-canvas" />
      </div>
      <div className="scroll-content">
        <div className="step" data-system="lottery">
          <div className="step-content lottery-content">
            <h2>추첨</h2>
            <p>지원자 간 차이를 고려하지 않고 무작위 절차를 통해 선발이 이루어지는 방식입니다.</p>
            <p>모든 사람에게 동일한 확률이 주어지며, 제비뽑기 등 일정한 절차로 진행됩니다.</p>
          </div>
        </div>
        <div className="step" data-system="election">
          <div className="step-content election-content">
            <h2>선거</h2>
            <p>구성원들이 투표를 통해 특정 후보를 선택함으로써 선발이 결정되는 방식입니다.</p>
            <p>등록된 후보 중 득표 수나 규정된 집계 방식에 따라 결과가 정해집니다.</p>
          </div>
        </div>
        <div className="step" data-system="hereditary">
          <div className="step-content hereditary-content">
            <h2>세습</h2>
            <p>지위나 역할이 특정 가계·가문에 따라 승계되는 방식입니다.</p>
            <p>승계 규칙에 따라 다음 보유자가 자동적으로 확정되며, 절차는 가문 내부의 고정된 기준을 따릅니다.</p>
          </div>
        </div>
        <div className="step" data-system="purchase">
          <div className="step-content purchase-content">
            <h2>매관</h2>
            <p>지위나 권한이 금전이나 자원을 제공한 사람에게 이전되는 방식입니다.</p>
            <p>정해진 대가나 조건을 충족하면 선발이 확정되는 구조로 운영됩니다.</p>
          </div>
        </div>
        <div className="step" data-system="recommendation">
          <div className="step-content recommendation-content">
            <h2>천거</h2>
            <p>권한을 가진 인물이나 기관이 적합하다고 판단한 사람을 추천해 선발이 이루어지는 방식입니다.</p>
            <p>추천권자에 의해 후보군이 형성되고, 선발은 이 추천된 범위 안에서 진행됩니다.</p>
          </div>
        </div>
        <div className="step" data-system="exam">
          <div className="step-content exam-content">
            <h2>시험제</h2>
            <p>시험을 통해 성적·점수 기반으로 선발하는 방식입니다. 출제와 채점 절차를 거쳐 규정된 합격 기준에 따라 결정됩니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Section2SystemComparison
