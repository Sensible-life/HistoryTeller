import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import '../styles/Section7.css'

function Section7() {
  const containerRef = useRef(null)
  const bookRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const introTextOpacity = useTransform(scrollYProgress, [0.05, 0.08, 0.12, 0.15], [0, 1, 1, 0])
  const bookOpacity = useTransform(scrollYProgress, [0.2, 0.25, 0.7, 0.75], [0, 1, 1, 0])
  const closingText1Opacity = useTransform(scrollYProgress, [0.75, 0.78, 0.83, 0.86], [0, 1, 1, 0])
  const closingText2Opacity = useTransform(scrollYProgress, [0.86, 0.9], [0, 1])
  
  // 총 16개의 페이지 이미지
  const totalPages = 16
  
  // 페이지별 텍스트 데이터
  const pageTexts = [
    {
      content: "다른 자제는 벼슬에 나아갈 길이 없사오니,\n이제부터는 문음과 공음의 자제외에,\n벼슬이 없는 자의 자제로서 나아가 18세 이상의 재간(才幹)이 있는 자도",
      source: "태종실록9권, 태종 5년 2월 9일"
    },
    {
      content: "시험을 관장한 사람은\n자기 아는 사람을 먼저 뽑고자 하여\n부정(不正)한 짓을 다투어 감행하고도",
      source: "세종실록115권, 세종 29년 3월 16일"
    },
    {
      content: "특별히 계급을 얻어서\n이 때문에 높아진 자가 매우 많은데",
      source: "성종실록4권, 성종 1년 3월 4일"
    },
    {
      content: "지방에서 인재를 뽑을 때에\n협잡의 폐단이 많이 있으니,\n어찌 한심하지 않겠습니까.",
      source: "명종실록30권, 명종 19년 2월 22일 乙丑 1번째기사"
    },
    {
      content: "어찌 지방에서 과거를 보일 수 있겠는가.\n대체에 어긋날 뿐만 아니라\n반드시 부정스런 폐단이 생길 것이다.",
      source: "선조실록150권, 선조 35년 5월 11일"
    },
    {
      content: "영남 사람은\n문과에 급제한 이가 매우 많습니다.",
      source: "영조실록13권, 영조 3년 9월 14일"
    },
    {
      content: "30, 40년 이래로 과장의 폐단이\n날마다 불어나고 달마다 증가하여\n이제 고질병이 되어 손을 쓸 수 없게 되었는데,",
      source: "정조실록39권, 정조 18년 2월 17일"
    },
    {
      content: "선비라는 자들은 공부를 전혀 하지 않고\n청탁만을 일삼고 있으며,",
      source: "고종실록22권, 고종 22년 2월 17일"
    }
  ]
  
  // 스크롤 progress에 따라 페이지 넣기
  useEffect(() => {
    let lastFlipTime = 0
    const minFlipInterval = 2000 // 최소 2000ms 간격으로 페이지 넘기기
    
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (bookRef.current && progress > 0.28) {
        const now = Date.now()
        if (now - lastFlipTime < minFlipInterval) return
        
        // 0.28~0.68 구간에서 모든 페이지 넘기기 (0.7 이후는 fade out 준비)
        const adjustedProgress = Math.min((progress - 0.28) / 0.40, 1) // 0.28~0.68을 0~1로 변환
        // 마지막 텍스트까지 표시하기 위해 최대 14까지 (index 7)
        const targetPage = Math.min(Math.floor(adjustedProgress * (totalPages / 2)) * 2, 14)
        
        if (targetPage !== currentPage && targetPage <= 14) {
          setCurrentPage(targetPage)
          lastFlipTime = now
          try {
            // 앞으로 가면 flipNext, 뒤로 가면 flipPrev
            if (targetPage > currentPage) {
              bookRef.current.pageFlip().flipNext()
            } else if (targetPage < currentPage) {
              bookRef.current.pageFlip().flipPrev()
            }
          } catch (e) {
            // 페이지 넣기 실패 무시
          }
        }
      }
    })
    
    return () => unsubscribe()
  }, [scrollYProgress, currentPage, totalPages])
  
  return (
    <div className="section-7-container" ref={containerRef}>
      <motion.div 
        className="intro-text-block"
        style={{ opacity: introTextOpacity }}
      >
        <p>다양한 정책을 도입해도 사회 구조적 문제는 쉽게 바뀌지 않았습니다.</p>
        <p>조선왕조실록의 기록을 보면 이 편중은 시대를 거쳐 꾸준히 지적되었고,</p>
        <p>이를 해결하려는 시도 역시 계속되어 왔음을 확인할 수 있습니다.</p>
      </motion.div>
      
      <motion.div 
        className="section-7-wrapper"
        style={{ opacity: bookOpacity }}
      >
        <div className="section-7-content">
        <div className="book-wrapper">
          <div className="book-container">
          <HTMLFlipBook 
            ref={bookRef}
            width={400} 
            height={622}
            maxShadowOpacity={0.5}
            drawShadow={true}
            showCover={false}
            size='fixed'
            className="flip-book"
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <div className="page" key={index}>
                <img 
                  src={`/assets/page${index + 1}.png`}
                  alt={`Page ${index + 1}`}
                  className="page-image"
                />
              </div>
            ))}
          </HTMLFlipBook>
          </div>
          
          {/* 페이지별 텍스트 오버레이 */}
          <div className="page-text-overlay">
            {pageTexts.map((text, index) => (
              <motion.div
                key={index}
                className="overlay-text-container"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: Math.floor(currentPage / 2) === index ? 1 : 0 
                }}
                transition={{ duration: 0.5 }}
              >
                <p className="overlay-content">{text.content}</p>
                <p className="overlay-source">{text.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </motion.div>

      {/* 첫 번째 마무리 텍스트 */}
      <motion.div 
        className="closing-text-block closing-text-1"
        style={{ opacity: closingText1Opacity }}
      >
        <p>이러한 기록을 보면, 지역 간 접근성과 교육 자원의 격차가</p>
        <p>시대와 제도가 달라져도 쉽게 해소되지 않는다는 사실을 깨닫게 됩니다.</p>
        <p>오래전의 사례임에도 불구하고 자연스럽게 오늘날의 지역 불균형 문제와 맞닿아 보이며,</p>
        <p>우리가 여전히 고민해야 할 과제가 무엇인지 되묻게 합니다.</p>
      </motion.div>

      {/* 두 번째 마무리 텍스트 */}
      <motion.div 
        className="closing-text-block closing-text-2"
        style={{ opacity: closingText2Opacity }}
      >
        <p>오래전 실록에 남겨진 불균형의 흔적은 오늘에도 여러 모습으로 이어지고 있습니다.</p>
        <p>그렇다면 앞으로의 시대를 살아가는 우리는, 어떤 모습을 기록하게 될까요?</p>
      </motion.div>
    </div>
  )
}

export default Section7
