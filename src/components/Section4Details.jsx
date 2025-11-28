import { useEffect, useRef } from 'react'
import '../styles/Section4Details.css'

function Section4Details() {
  const cardsRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    const cards = cardsRef.current?.querySelectorAll('.detail-card')
    cards?.forEach(card => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="section section-4">
      <div className="content-wrapper">
        <h2 className="section-title">과거제는 어떻게 시행되었는가</h2>

        <div className="detail-grid" ref={cardsRef}>
          {/* 시험 종류 */}
          <div className="detail-card">
            <h3>시험 종류</h3>
            <div className="card-content">
              <div className="test-type">
                <h4>문과 (文科)</h4>
                <p>문관을 선발하는 시험. 가장 명예로운 과거로 여겨졌습니다.</p>
                <blockquote className="historical-quote">
                  "文科取士, 以經義策論爲主"<br />
                  <span className="quote-source">- 經國大典</span>
                </blockquote>
              </div>
              <div className="test-type">
                <h4>무과 (武科)</h4>
                <p>무관을 선발하는 시험. 무예와 병법을 평가했습니다.</p>
                <blockquote className="historical-quote">
                  "武科取士, 試以騎射步射"<br />
                  <span className="quote-source">- 經國大典</span>
                </blockquote>
              </div>
              <div className="test-type">
                <h4>잡과 (雜科)</h4>
                <p>기술관을 선발하는 시험. 의학, 천문, 지리, 외국어 등 전문 기술을 평가했습니다.</p>
              </div>
            </div>
          </div>

          {/* 시험 절차 */}
          <div className="detail-card">
            <h3>시험 절차/단계</h3>
            <div className="card-content">
              <div className="stage-flow">
                <div className="stage">
                  <div className="stage-number">1</div>
                  <h4>초시 (初試)</h4>
                  <p>각 지방에서 실시하는 예비시험</p>
                  <p className="stage-detail">합격자: 약 240명</p>
                </div>
                <div className="stage-arrow">→</div>
                <div className="stage">
                  <div className="stage-number">2</div>
                  <h4>복시 (覆試)</h4>
                  <p>한양에서 실시하는 본 시험</p>
                  <p className="stage-detail">합격자: 33명</p>
                </div>
                <div className="stage-arrow">→</div>
                <div className="stage">
                  <div className="stage-number">3</div>
                  <h4>전시 (殿試)</h4>
                  <p>왕 앞에서 치르는 최종 시험</p>
                  <p className="stage-detail">등급 결정: 갑과/을과/병과</p>
                </div>
              </div>
              <blockquote className="historical-quote">
                "科試之制, 先初試於外方, 次覆試於京中, 終殿試於闕庭"<br />
                <span className="quote-source">- 世宗實錄</span>
              </blockquote>
            </div>
          </div>

          {/* 시험 내용 */}
          <div className="detail-card">
            <h3>시험 내용</h3>
            <div className="card-content">
              <div className="content-item">
                <h4>사서오경 (四書五經)</h4>
                <p>유교 경전에 대한 이해를 묻는 문제</p>
                <ul>
                  <li>四書: 論語, 孟子, 大學, 中庸</li>
                  <li>五經: 詩經, 書經, 易經, 禮記, 春秋</li>
                </ul>
              </div>
              <div className="content-item">
                <h4>책문 (策問)</h4>
                <p>국가 정책과 시사 문제에 대한 논술</p>
                <blockquote className="historical-quote">
                  "策問以時務, 使陳其見"<br />
                  <span className="quote-source">- 經國大典</span>
                </blockquote>
              </div>
              <div className="content-item">
                <h4>시부 (詩賦)</h4>
                <p>한시와 부(賦)를 짓는 문학 시험</p>
              </div>
            </div>
          </div>

          {/* 합격 이후 */}
          <div className="detail-card">
            <h3>합격 이후</h3>
            <div className="card-content">
              <div className="ranking-system">
                <div className="rank rank-gold">
                  <h4>갑과 (甲科)</h4>
                  <p className="rank-number">3명</p>
                  <p>장원(狀元), 방안(榜眼), 탐화(探花)</p>
                  <p className="position">종6품 이상 관직 배치</p>
                </div>
                <div className="rank rank-silver">
                  <h4>을과 (乙科)</h4>
                  <p className="rank-number">7명</p>
                  <p>정7품~종6품 관직 배치</p>
                </div>
                <div className="rank rank-bronze">
                  <h4>병과 (丙科)</h4>
                  <p className="rank-number">23명</p>
                  <p>정8품~정7품 관직 배치</p>
                </div>
              </div>
              <blockquote className="historical-quote">
                "殿試分三等, 甲科三人, 乙科七人, 丙科二十三人"<br />
                <span className="quote-source">- 經國大典</span>
              </blockquote>
            </div>
          </div>

          {/* 응시 자격 */}
          <div className="detail-card">
            <h3>응시 자격</h3>
            <div className="card-content">
              <div className="eligibility-info">
                <h4>응시 가능자</h4>
                <ul>
                  <li>양반 가문의 남성</li>
                  <li>생원과/진사과 합격자 (소과 합격자)</li>
                  <li>일정 나이 이상의 성인 남성</li>
                </ul>
              </div>
              <div className="eligibility-info excluded">
                <h4>응시 제한</h4>
                <ul className="excluded-list">
                  <li>서얼 (첩의 자식) - 제한적 허용</li>
                  <li>천민 (노비, 백정 등)</li>
                  <li>여성</li>
                  <li>역모자의 후손</li>
                </ul>
              </div>
              <blockquote className="historical-quote">
                "科擧應試, 良人之子, 雖庶孽, 亦許赴擧"<br />
                <span className="quote-source">- 成宗實錄</span>
              </blockquote>
            </div>
          </div>

          {/* 기타 정보 */}
          <div className="detail-card">
            <h3>기타 정보</h3>
            <div className="card-content">
              <div className="info-section">
                <h4>방 (榜) - 합격자 발표</h4>
                <p>합격자 명단을 방에 적어 대궐 문에 게시했습니다.</p>
                <blockquote className="historical-quote">
                  "榜出, 揭於闕門"<br />
                  <span className="quote-source">- 太宗實錄</span>
                </blockquote>
              </div>
              <div className="info-section">
                <h4>시권 작성 방식</h4>
                <p>공정성을 위해 답안지에 이름을 가리는 '봉미법(封彌法)'을 사용했습니다.</p>
              </div>
              <div className="info-section">
                <h4>시험 일정</h4>
                <p>식년시(式年試)는 3년마다 정기적으로 실시되었으며, 부정기적으로 별시(別試)와 증광시(增廣試)가 있었습니다.</p>
              </div>
              <div className="info-section">
                <h4>채점 방식</h4>
                <p>여러 시험관이 교차 채점하여 공정성을 확보했습니다.</p>
                <blockquote className="historical-quote">
                  "試官分掌, 互相考閱, 以杜私弊"<br />
                  <span className="quote-source">- 中宗實錄</span>
                </blockquote>
              </div>
            </div>
          </div>

          {/* 생원과/진사과 */}
          <div className="detail-card">
            <h3>생원과/진사과 (小科)</h3>
            <div className="card-content">
              <p>대과(문과)에 응시하기 위한 예비 시험</p>
              <div className="sogwa-types">
                <div className="sogwa-type">
                  <h4>생원과 (生員科)</h4>
                  <p>경학(經學) 시험</p>
                  <p className="detail-text">사서오경의 깊이 있는 이해를 평가</p>
                </div>
                <div className="sogwa-type">
                  <h4>진사과 (進士科)</h4>
                  <p>문학 시험</p>
                  <p className="detail-text">시부(詩賦) 창작 능력을 평가</p>
                </div>
              </div>
              <p className="note">합격자는 성균관 입학 자격과 대과 응시 자격을 얻었습니다.</p>
            </div>
          </div>
        </div>

        <div className="summary-box">
          <h3>과거제의 이상</h3>
          <p>
            과거제는 혈통이나 재산이 아닌 <strong>개인의 능력과 학식</strong>으로
            관료를 선발하고자 한 제도였습니다. 이론적으로는 누구나 공부를 통해
            관직에 오를 수 있는 기회를 제공했습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Section4Details
