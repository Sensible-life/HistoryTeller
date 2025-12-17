import { useEffect, useRef, useState } from 'react'
import '../styles/Section1Opening.css'

function Section1Opening() {
  const [talents, setTalents] = useState([])
  const [hoveredTalent, setHoveredTalent] = useState(null)
  const [transitionOpacity, setTransitionOpacity] = useState(0)
  const circleRef = useRef(null)
  const transitionRef = useRef(null)

  useEffect(() => {
    // Generate 50 talents with random Union images
    const generateTalents = () => {
      const talentTypes = [
        { type: '지능형', description: '뛰어난 학습 능력과 분석력을 가진 인재' },
        { type: '성취형', description: '목표 달성에 집중하는 실행력 있는 인재' },
        { type: '책임형', description: '공동체를 위한 희생과 헌신을 아끼지 않는 인재' },
        { type: '애국형', description: '나라와 민족을 최우선으로 생각하는 인재' },
        { type: '윤리형', description: '도덕적 가치와 원칙을 중시하는 인재' },
        { type: '창의형', description: '새로운 아이디어와 혁신을 추구하는 인재' },
        { type: '협력형', description: '팀워크와 소통을 중시하는 인재' },
        { type: '리더형', description: '조직을 이끄는 통솔력을 지닌 인재' },
        { type: '전문형', description: '특정 분야의 깊은 전문성을 가진 인재' },
        { type: '실용형', description: '현실적이고 실천적인 해결책을 제시하는 인재' },
        { type: '탐구형', description: '끊임없이 질문하고 탐색하는 인재' },
        { type: '봉사형', description: '타인을 돕는 것에 보람을 느끼는 인재' },
        { type: '도전형', description: '새로운 시도를 두려워하지 않는 인재' },
        { type: '안정형', description: '신중하고 체계적인 접근을 선호하는 인재' },
        { type: '감성형', description: '공감 능력과 정서 지능이 높은 인재' },
        { type: '논리형', description: '체계적 사고와 합리적 판단을 중시하는 인재' },
        { type: '추진형', description: '빠른 실행력으로 일을 완수하는 인재' },
        { type: '전략형', description: '장기적 계획과 전략 수립에 능한 인재' },
        { type: '혁신형', description: '기존 틀을 깨고 변화를 주도하는 인재' },
        { type: '조화형', description: '균형과 조화를 추구하는 인재' },
        { type: '독립형', description: '자율적이고 주도적으로 일하는 인재' },
        { type: '소통형', description: '효과적인 의사소통으로 관계를 이어가는 인재' },
        { type: '통찰형', description: '본질을 꿰뚫어보는 직관력을 가진 인재' },
        { type: '인내형', description: '어려움 속에서도 끝까지 버티는 인재' },
        { type: '유연형', description: '변화에 빠르게 적응하는 인재' },
        { type: '성실형', description: '맡은 바 책임을 다하는 인재' },
        { type: '겸손형', description: '자신을 낮추고 타인을 존중하는 인재' },
        { type: '진취형', description: '적극적으로 앞으로 나아가는 인재' },
        { type: '신중형', description: '신중하게 생각하고 행동하는 인재' },
        { type: '열정형', description: '일에 대한 열정과 에너지가 넘치는 인재' },
        { type: '분석형', description: '데이터와 사실에 기반한 판단을 하는 인재' },
        { type: '공정형', description: '공평과 정의를 중요시하는 인재' },
        { type: '절제형', description: '자기 관리와 절제를 실천하는 인재' },
        { type: '용기형', description: '어려운 결정 앞에서 용기를 내는 인재' },
        { type: '신뢰형', description: '신뢰와 믿음을 바탕으로 행동하는 인재' },
        { type: '배려형', description: '타인을 먼저 생각하는 마음을 가진 인재' },
        { type: '관찰형', description: '세밀한 관찰력으로 상황을 파악하는 인재' },
        { type: '목표형', description: '명확한 목표 설정과 달성에 집중하는 인재' },
        { type: '실천형', description: '생각을 행동으로 옮기는 인재' },
        { type: '긍정형', description: '긍정적 태도로 주변에 활력을 주는 인재' },
        { type: '신념형', description: '확고한 신념을 가지고 행동하는 인재' },
        { type: '겸양형', description: '겸손하고 온화한 태도를 지닌 인재' },
        { type: '융합형', description: '다양한 영역을 연결하고 통합하는 인재' },
        { type: '헌신형', description: '자신을 바쳐 일에 몰두하는 인재' },
        { type: '지혜형', description: '경험에서 지혜를 얻어 적용하는 인재' },
        { type: '정직형', description: '정직과 투명성을 실천하는 인재' },
        { type: '도덕형', description: '높은 도덕성을 바탕으로 행동하는 인재' },
        { type: '충성형', description: '조직과 동료에 대한 충성심이 강한 인재' },
        { type: '의리형', description: '의리와 신의를 중시하는 인재' },
        { type: '명예형', description: '명예와 자긍심을 소중히 여기는 인재' }
      ]

      const talents = []
      const radius = 350 // 큰 원의 반지름
      const centerX = 0
      const centerY = 0

      const count = [-2, -1, 0, 1, 2]

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 5; j++) {
          const angle = (i / 10) * 2 * Math.PI + count[j] * 0.015 * 2 * Math.PI
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          const randomUnion = Math.floor(Math.random() * 49) + 1
          const talentIndex = i * 5 + j // 0-49
          const randomDelay = Math.random() * 3

          talents.push({
            id: talentIndex,
            x,
            y,
            image: `/assets/Union-${randomUnion}.png`,
            angle,
            delay: randomDelay,
            ...talentTypes[talentIndex]
          })
        }
      }
      return talents
    }

    setTalents(generateTalents())
  }, [])

  // Scroll-based fade in/out for transition section
  useEffect(() => {
    const handleScroll = () => {
      if (!transitionRef.current || !circleRef.current) return

      const transitionElement = transitionRef.current
      const section1Element = circleRef.current.closest('.section-opening')
      
      const transitionRect = transitionElement.getBoundingClientRect()
      const section1Rect = section1Element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 섹션1이 완전히 지나갔는지 확인 (섹션1의 bottom이 화면 위로 완전히 사라짐)
      const section1Passed = section1Rect.bottom < 0

      if (!section1Passed) {
        // 섹션1이 아직 지나가지 않았으면 transition은 보이지 않음
        setTransitionOpacity(0)
        return
      }

      // transition 섹션의 실제 위치를 기준으로 계산
      // transitionRect.top: transition 섹션의 상단이 화면 상단에서 얼마나 떨어져 있는지 (픽셀)
      // - 양수: 화면 아래에 있음 (아직 안 보임)
      // - 음수: 화면 위로 지나갔음 (이미 지나감)
      // - 0 근처: 화면 상단에 있음
      const transitionTop = transitionRect.top
      const transitionBottom = transitionRect.bottom
      const transitionCenter = transitionTop + (transitionBottom - transitionTop) / 2
      
      // 화면 중앙의 위치 (픽셀)
      const windowCenter = windowHeight / 2
      
      // transition 섹션의 중심이 화면 중앙에서 얼마나 떨어져 있는지 계산 (절댓값)
      // 작을수록 중앙에 가까움, 클수록 중앙에서 멀음
      const distanceFromCenter = Math.abs(transitionCenter - windowCenter)
      
      // Fade in 구간: 섹션이 멀리 있을 때(큰 값) → 가까이 올 때(작은 값)
      // 타이밍을 늦춤 (나오는 타이밍을 늦춤)
      const fadeInStartDistance = windowHeight * 0.5  // 멀리 있을 때 (fade in 시작) - 늦춤
      const fadeInEndDistance = windowHeight * 0.3    // 가까이 올 때 (fade in 완료)
      
      // Fade out 구간: fade-in의 정반대로 (대칭)
      // fade-in이 0.6vh → 0.4vh로 가면, fade-out은 0.4vh → 0.6vh로 감
      const fadeOutStartDistance = windowHeight * 0.3  // fade-in의 끝점 (fade out 시작)
      const fadeOutEndDistance = windowHeight * 0.5    // fade-in의 시작점 (fade out 완료, 정반대)

      let opacity = 0

      // distanceFromCenter가 작을수록 중앙에 가까움 (opacity 높음)
      // distanceFromCenter가 클수록 중앙에서 멀음 (opacity 낮음)
      // 작은 값부터 큰 값 순서로 체크
      
      // fadeInEndDistance(0.4vh) == fadeOutStartDistance(0.4vh)이므로
      // 이 값이 완전히 보이는 구간의 경계입니다
      
      if (distanceFromCenter <= fadeInEndDistance) {
        // 완전히 보이는 구간 (중앙에 매우 가까움, 0.4vh 이하)
        opacity = 1
      } else if (distanceFromCenter <= fadeInStartDistance) {
        // Fade in 중 (가까워지는 중, 0.4vh ~ 0.6vh)
        // distanceFromCenter가 큰 값(0.6vh)에서 작은 값(0.4vh)로 갈수록 opacity 증가
        const progress = (fadeInStartDistance - distanceFromCenter) / (fadeInStartDistance - fadeInEndDistance)
        opacity = Math.max(0, Math.min(1, progress))
      } else if (distanceFromCenter <= fadeOutEndDistance) {
        // Fade out 중 (멀어지는 중, 0.6vh까지)
        // fade-in의 정반대: fade-in이 0.6→0.4면 fade-out은 0.4→0.6
        const progress = (distanceFromCenter - fadeOutStartDistance) / (fadeOutEndDistance - fadeOutStartDistance)
        opacity = Math.max(0, Math.min(1, 1 - progress))
      } else {
        // 너무 멀리 있음 (0.6vh 이상)
        opacity = 0
      }

      setTransitionOpacity(opacity)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <section className="section section-opening">
      <div className="opening-container">
        {/* Circular talent visualization */}
        <div className="talent-circle-container" ref={circleRef}>
          {/* Content inside the circle */}
          <div className="circle-inner-content">
            <h1 className="opening-title">나라에 걸맞는 인재를 어떻게 선발할까?</h1>

            <div className="opening-content">
              <p className="opening-text">
                한국 사회에서 '어떤 인재가 좋은 인재인가'에 대한 기준은 시대마다 달라져 왔습니다.
              </p>
              <p className="opening-text">
                어떤 시기에는 지능과 성취가 중요한 덕목으로 여겨졌고,
              </p>
              <p className="opening-text">
                또 어떤 시기에는 공동체에 대한 책임감·애국심·윤리성 같은 보이지 않는 자질이 더 우선되었습니다.
              </p>
            </div>

            <div className="opening-content secondary">
              <p className="opening-text">
                이 글은 인재 선발 과정에서 무엇을 우선해야 공정하다고 말할 수 있는지,
              </p>
              <p className="opening-text">
                그리고 그것을 어떻게 검증할 수 있을지에 대해 생각해보도록 안내합니다.
              </p>
            </div>
            <div className="opening-instruction">
              <p className="opening-text-instruction">
                아래 원형 도표 위에 마우스를 올려 다양한 인재상을 탐색해보세요.
              </p>
            </div>
          </div>

          {/* Talents on the circle outline */}
          <div className="talent-circle">
            {talents.map((talent) => (
              <div
                key={talent.id}
                className="talent-item"
                style={{
                  left: `calc(50% + ${talent.x}px)`,
                  top: `calc(50% + ${talent.y}px)`,
                  animationDelay: `${talent.delay}s`
                }}
                onMouseEnter={() => setHoveredTalent(talent)}
                onMouseLeave={() => setHoveredTalent(null)}
              >
                <img src={talent.image} alt="" className="talent-icon" />
              </div>
            ))}

            {/* Hover tooltip */}
            {hoveredTalent && (
              <div
                className="talent-tooltip"
                style={{
                  left: `calc(50% + ${hoveredTalent.x}px)`,
                  top: hoveredTalent.y < 0 
                    ? `calc(50% + ${hoveredTalent.y + 80}px)` 
                    : `calc(50% + ${hoveredTalent.y - 80}px)`
                }}
              >
                <h4>{hoveredTalent.type}</h4>
                <p>{hoveredTalent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Transition Question */}
    <section className="section section-transition" ref={transitionRef}>
      {/* 실제 공간을 차지하는 스페이서 */}
      <div className="transition-spacer"></div>
      <div className="transition-container" style={{ opacity: transitionOpacity }}>
        <h2 className="transition-question">
          각 선발 제도는 이런 서로 다른 특성을 어떤 방식으로 평가하고, 어떤 절차로 인재를 뽑을까요?
        </h2>
      </div>
    </section>
    </>
  )
}

export default Section1Opening
