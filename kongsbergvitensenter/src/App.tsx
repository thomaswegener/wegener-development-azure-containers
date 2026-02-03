import './App.css'
import { AboutSection } from './sections/AboutSection'
import { CalendarSection } from './sections/CalendarSection'
import { Footer } from './sections/Footer'
import { HeroSection } from './sections/HeroSection'
import { useScrollClass } from './hooks/useScrollClass'

const App = () => {
  useScrollClass()
  return (
    <div className="page">
      <HeroSection />
      <main>
        <CalendarSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
