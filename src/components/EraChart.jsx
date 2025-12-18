import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import '../styles/EraChart.css'

// 시대별 수도(경기) 과대표 지수 데이터
const eraData = [
  { era_mid: 1375, RI_capital: 10.0, obs_capital_prop: 1.0 },
  { era_mid: 1425, RI_capital: 2.5, obs_capital_prop: 0.25 },
  { era_mid: 1475, RI_capital: 4.259259, obs_capital_prop: 0.425926 },
  { era_mid: 1525, RI_capital: 6.212471, obs_capital_prop: 0.621247 },
  { era_mid: 1575, RI_capital: 6.382114, obs_capital_prop: 0.638211 },
  { era_mid: 1625, RI_capital: 5.862069, obs_capital_prop: 0.586207 },
  { era_mid: 1675, RI_capital: 5.787037, obs_capital_prop: 0.578704 },
  { era_mid: 1725, RI_capital: 4.937695, obs_capital_prop: 0.493769 },
  { era_mid: 1775, RI_capital: 3.391225, obs_capital_prop: 0.339122 },
  { era_mid: 1825, RI_capital: 3.619120, obs_capital_prop: 0.361912 },
]

// 하이라이트할 인덱스와 해당 텍스트
const highlightIndices = [0, 1, 3, 8]
const highlightTexts = [
  [
    '시간이 흐를수록 지역 간 격차는 완전히 해소되지 않았지만, 제도 변화와 사회 구조의 변동에 따라 조금씩 다른 패턴이 나타납니다.',
    '노란 점을 눌러 각각의 시기마다 왜 이런 변화가 일어났는지 직접 탐색해보세요.'
  ],
  [
    '조선을 세운 태조와 태종은 새 왕조를 안정시키기 위해 한양 주변의 공신·중심 엘리트에 크게 의존했습니다.',
    '이 때문에 국가 운영의 핵심 인력이 모두 수도권에 집중되었고, 세종 초기에도 이러한 구조가 유지되었습니다.',
    '결과적으로 과거 합격자 역시 서울·경기 기반 가문이 압도적으로 많았습니다.'
  ],
  [
    '세종은 지방 인재를 키우기 위해 지역별 할당 제도를 정비하고 향교 교육을 강화했습니다.',
    '이후 성종은 서원·향교를 더욱 확충하며 지방의 학습 기반을 제도적으로 확대했습니다.',
    '이 시기에는 지방 출신의 과거 진출이 일시적으로 증가하는 효과가 나타났습니다.'
  ],
  [
    '명종과 선조 시기에는 한양을 중심으로 한 경화사족이 정치·학문·교육 자원을 독점하며 강력한 집단으로 성장했습니다.',
    '이들은 과거 준비에 필요한 사교육·정보·인맥을 모두 확보해 지방에 비해 압도적인 우위를 가졌습니다.',
    '그 결과 수도권 합격자 비율이 다시 크게 치솟는 시기가 됩니다.'
  ],
  [
    '영조는 지방 우수 인재를 선발하는 제도를 정비하며 서울 편중을 완화하려 했습니다.',
    '정조는 규장각 검서관 채용과 초계문신제를 운영하며 지방 출신을 적극적으로 기용했습니다.',
    '다만 정치적 갈등과 구조적 불균형 탓에 완전한 지역 균형으로 이어지지는 못했습니다.'
  ]
]

function EraChart() {
  const containerRef = useRef(null)

  // 스크롤 기반 fade in
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  // 각 하이라이트 포인트별 텍스트 opacity (fade in & fade out)
  const textOpacity0 = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.38], [0, 1, 1, 0])
  const textOpacity1 = useTransform(scrollYProgress, [0.4, 0.5, 0.53, 0.57], [0, 1, 1, 0])
  const textOpacity2 = useTransform(scrollYProgress, [0.55, 0.65, 0.68, 0.72], [0, 1, 1, 0])
  const textOpacity3 = useTransform(scrollYProgress, [0.7, 0.8, 0.83, 0.87], [0, 1, 1, 0])
  const textOpacity4 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 1])

  // 각 포인트별 노란색 이미지 opacity (fade in & fade out)
  const yellowOpacity0 = useTransform(scrollYProgress, [0.4, 0.5, 0.53, 0.57], [0, 1, 1, 0])
  const yellowOpacity1 = useTransform(scrollYProgress, [0.55, 0.65, 0.68, 0.72], [0, 1, 1, 0])
  const yellowOpacity2 = useTransform(scrollYProgress, [0.7, 0.8, 0.83, 0.87], [0, 1, 1, 0])
  const yellowOpacity3 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 1])

  // 각 포인트별 검은색(Union) 이미지 opacity (노란색과 반대 - fade out & fade in)
  const unionOpacity0 = useTransform(scrollYProgress, [0.4, 0.5, 0.53, 0.57], [1, 0, 0, 1])
  const unionOpacity1 = useTransform(scrollYProgress, [0.55, 0.65, 0.68, 0.72], [1, 0, 0, 1])
  const unionOpacity2 = useTransform(scrollYProgress, [0.7, 0.8, 0.83, 0.87], [1, 0, 0, 1])
  const unionOpacity3 = useTransform(scrollYProgress, [0.85, 0.9, 0.95, 1], [1, 0, 0, 0])

  // 차트 설정
  const width = 1000
  const height = 400
  const padding = { left: 60, right: 40, top: 0, bottom: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // X축 스케일 (연도)
  const minYear = 1350
  const maxYear = 1850
  const xScale = (year) => padding.left + ((year - minYear) / (maxYear - minYear)) * chartWidth

  // Y축 스케일 (RI 값)
  const minRI = 0
  const maxRI = 11
  const yScale = (ri) => padding.top + chartHeight - ((ri - minRI) / (maxRI - minRI)) * chartHeight

  // 데이터 포인트 변환
  const points = eraData.map(d => ({
    ...d,
    x: xScale(d.era_mid),
    y: yScale(d.RI_capital)
  }))

  // 라인 path 생성
  const linePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ')

  return (
    <div className="era-chart-container" ref={containerRef}>
      <motion.div className="era-content-wrapper" style={{ opacity }}>
        {/* 중앙 텍스트 */}
        <div className="era-text-block">
          <p>이러한 격차는 조선시대 전반에 걸쳐 반복되었습니다.</p>
          <p>여러 왕들이 지역 편중을 완화하기 위한 제도적 보완책을 내놓았지만, 그 효과는 시대마다 다르게 나타났습니다.</p>
        </div>

        {/* 차트 SVG */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="era-chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 라인 */}
          <path
            d={linePath}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 데이터 포인트 (Union 이미지) */}
          {points.map((point, index) => {
            const randomUnionIndex = Math.floor(Math.random() * 49) + 1
            const imageUrl = `/assets/Union-${randomUnionIndex}.png`
            const size = [0, 3, 8].includes(index) ? 30 : 20
            
            // 하이라이트 인덱스인 경우 opacity 적용
            const highlightPosition = highlightIndices.indexOf(index)
            const opacities = [unionOpacity0, unionOpacity1, unionOpacity2, unionOpacity3]
            const isHighlight = highlightPosition !== -1

            return (
              <motion.image
                key={point.era_mid}
                href={imageUrl}
                x={point.x - size / 2}
                y={point.y - size / 2}
                width={size}
                height={size}
                style={{ 
                  opacity: isHighlight ? opacities[highlightPosition] : 1,
                  cursor: 'pointer' 
                }}
                onClick={() => console.log(`Clicked: ${point.era_mid}년, RI: ${point.RI_capital.toFixed(2)}`)}
              />
            )
          })}

          {/* 하이라이트 포인트 - Yellow 이미지 (스크롤에 따라 fade in/out) */}
          {highlightIndices.map((highlightIdx, i) => {
            const point = points[highlightIdx]
            const size = 35
            const opacities = [yellowOpacity0, yellowOpacity1, yellowOpacity2, yellowOpacity3]

            return (
              <motion.image
                key={`yellow-${point.era_mid}`}
                href="/assets/yellow.png"
                x={point.x - size / 2}
                y={point.y - size / 2}
                width={size}
                height={size}
                style={{ opacity: opacities[i], cursor: 'pointer' }}
                onClick={() => console.log(`Clicked: ${point.era_mid}년, RI: ${point.RI_capital.toFixed(2)}`)}
              />
            )
          })}

          {/* X축 레이블 (연도) */}
          {[1400, 1500, 1600, 1700, 1800].map(year => (
            <text
              key={year}
              x={xScale(year)}
              y={padding.top + chartHeight + 30}
              textAnchor="middle"
              fontFamily="GyeongbokgungSumunjangTitleB, serif"
              fontSize="18"
              fontWeight="700"
              fill="var(--text-dark)"
            >
              {year}
            </text>
          ))}
        </svg>

        {/* 하이라이트 포인트별 설명 - 같은 위치에서 교체 */}
        <div className="highlight-text-wrapper">
          <motion.div className="highlight-text-container" style={{ opacity: textOpacity0 }}>
            {highlightTexts[0].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </motion.div>

          <motion.div className="highlight-text-container" style={{ opacity: textOpacity1 }}>
            {highlightTexts[1].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </motion.div>

          <motion.div className="highlight-text-container" style={{ opacity: textOpacity2 }}>
            {highlightTexts[2].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </motion.div>

          <motion.div className="highlight-text-container" style={{ opacity: textOpacity3 }}>
            {highlightTexts[3].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </motion.div>

          <motion.div className="highlight-text-container" style={{ opacity: textOpacity4 }}>
            {highlightTexts[4].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default EraChart
