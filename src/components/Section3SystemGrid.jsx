import '../styles/Section3SystemGrid.css'

function Section3SystemGrid() {
  const systems = [
    {
      title: '추첨',
      description: '지원자 간 차이를 고려하지 않고 무작위 절차를 통해 선발이 이루어지는 방식입니다.'
    },
    {
      title: '선거',
      description: '구성원들이 투표를 통해 특정 후보를 선택함으로써 선발이 결정되는 방식입니다.'
    },
    {
      title: '세습',
      description: '지위나 역할이 특정 가계·가문에 따라 승계되는 방식입니다.'
    },
    {
      title: '매관',
      description: '지위나 권한이 금전이나 자원을 제공한 사람에게 이전되는 방식입니다.'
    },
    {
      title: '천거',
      description: '권한을 가진 인물이나 기관이 적합하다고 판단한 사람을 추천해 선발이 이루어지는 방식입니다.'
    },
    {
      title: '시험제',
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
                {/* 각 제도의 시각화는 나중에 추가 */}
              </div>
              <p className="system-description">{system.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Section3SystemGrid

