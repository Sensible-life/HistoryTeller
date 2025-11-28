import { useEffect } from 'react'
import Section1Opening from './components/Section1Opening'
import Section2SystemComparison from './components/Section2SystemComparison'
import Section3Introduction from './components/Section3Introduction'
import Section4Details from './components/Section4Details'
import './App.css'

function App() {
  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    })
  }, [])

  return (
    <div className="app">
      <Section1Opening />
      <Section2SystemComparison />
      <Section3Introduction />
      <Section4Details />
    </div>
  )
}

export default App
