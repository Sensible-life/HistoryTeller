import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import '../styles/Section6.css'
import EraChart from './EraChart'

function Section6() {
  const sectionRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0])
  
  return (
    <motion.section 
      ref={sectionRef}
      className="section section-6"
      style={{ opacity }}
    >
      <div className="section-6-content">
        <EraChart />
      </div>
    </motion.section>
  )
}

export default Section6
