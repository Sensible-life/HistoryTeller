import '../styles/Section5.css'
import ParetoChart from './ParetoChart'

function Section5() {
  return (
    <section className="section section-5">
      <div className="section-5-content">
        <div className="text-block-full-width">
          <div className="text-block">
            <p>법적으로는 양인이라면 누구나 응시할 수 있었기 때문에 과거에는 매우 많은 인원이 몰렸습니다.</p>
            <p>그중에서도 문과는 조선에서 고위 관료로 진출할 수 있는 거의 유일한 통로였기 때문에 지원자가 집중되었고,</p>
            <p>자연스럽게 문과의 경쟁률은 극단적으로 높아졌습니다.</p>
          </div>
        </div>

        {/* 장벽 목록 - 점점 어두워지는 배경 */}
        <div className="barrier-section">
          <div className="barrier-list">
            <p className="barrier-item left item-light">4대 조상의 신원을 모두 적어 제출할 수 있고,</p>
            <p className="barrier-item right item-light">6품 이상 관원의 보증을 받았고,</p>
            <p className="barrier-item left item-medium">조상 중 관직자가 없으면 관원 3명의 추천까지 받고,</p>
            <p className="barrier-item right item-medium">경우에 따라 예비 경전 시험을 미리 통과했으며,</p>
            <p className="barrier-item left item-dark">시험에 쓸 정해진 규격의 종이를 준비했고,</p>
            <p className="barrier-item right item-dark">배정받은 시험장에 충분히 갈 수 있는</p>
            <p className="barrier-item left item-dark">절차를 조금만 어겨도 응시가 취소되거나 처벌을 받았기에,</p>
          </div>

          <div className="barrier-conclusion">
            <p>여러 조건이 충족되어야만 시험에 응시할 수 있었습니다.</p>
            <p>그렇다 보니 실제 합격자의 출신을 살펴보면, 응시에 필요한 기반을 갖춘 특정 지역과 가문에 결과가 뚜렷하게 집중되는 모습이 드러납니다.</p>
          </div>
        </div>

        {/* 반대 그라데이션 - 점점 밝아지는 배경 */}
        <div className="barrier-fade-out"></div>

        {/* 가문 분석 설명 */}
        <div className="family-analysis-intro">
          <p>아래 그림은 과거 합격자의 가문을 보여줍니다. 상위 몇 개 가문이 전체 급제자의 큰 몫을 차지하고,</p>
          <p>그중에서도 전주 이씨는 다른 가문들과는 비교가 어려울 정도로 압도적인 비중을 보입니다.</p>
          <p>조선 왕실의 본관이 전주 이씨였기 때문에, 왕실과 연결된 방계 가문이 수적으로도 많았고,</p>
          <p>토지와 재산, 교육 기회, 인맥 등 시험 준비에 필요한 자원을 더 쉽게 확보할 수 있었습니다.</p>
        </div>

        {/* 파레토 차트 */}
        <ParetoChart />
      </div>
    </section>
  )
}

export default Section5
