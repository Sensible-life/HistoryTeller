import { useEffect, useRef } from 'react'
import '../styles/Section3Introduction.css'

function Section3Introduction() {
  const timelineRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateX(0)'
        }
      })
    }, observerOptions)

    const items = timelineRef.current?.querySelectorAll('.timeline-item')
    items?.forEach(item => {
      item.style.opacity = '0'
      item.style.transform = 'translateX(-30px)'
      item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="section section-3">
      <div className="content-wrapper">
        <h2 className="section-title">과거제 (科擧)</h2>
        <div className="intro-content">
          <p className="intro-text">
            과거(科擧)는 한나라에서 기원하고 수나라에서 제도적으로 정착된
            <strong> 동아시아식 시험 기반 관료 선발 제도</strong>입니다.
          </p>
          <p className="intro-text">
            기존의 세습 귀족 중심 통치 구조를 약화시키고,
            <strong> 능력 있는 지식인을 등용</strong>하기 위해 도입되었습니다.
          </p>
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>한나라 (漢)</h3>
                <p>과거제의 기원</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>수나라 (隋)</h3>
                <p>제도적 정착</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>고려/조선</h3>
                <p>한반도 도입 및 발전</p>
              </div>
            </div>
          </div>
          <p className="intro-text highlight">
            우리가 흔히 알고 있는 형태는 <strong>조선시대의 과거제</strong>입니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Section3Introduction
