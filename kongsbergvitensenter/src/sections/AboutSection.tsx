import { AboutCard } from '../components/AboutCard'
import { useAboutContent } from '../hooks/useAboutContent'

export const AboutSection = () => {
  const { profiles, isLoading, error } = useAboutContent()

  return (
    <section
      className="scroll-block scroll-block--about"
      data-scroll-section="about"
      data-gradient-start="#000000"
      data-gradient-end="#000000"
    >
      <div className="scroll-block__inner">
        <div id="om-oss" className="about-section">
          <div className="section-heading">
            <p className="eyebrow">Kongsberg Vitensenter</p>
            <h2>Om oss</h2>
            <p>
              Kongsberg Vitensenter har et spennende fritidstilbud for barn og unge som ønsker å vite mer om realfag og teknologi. Perfekt helgesyssel!
            </p>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="about-grid">
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="about-card shimmer" />
              ))}

            {!isLoading &&
              (profiles.length === 0 ? (
                <p className="empty-state">Innhold kommer straks.</p>
              ) : (
                profiles.map((profile) => (
                  <AboutCard key={profile.id} profile={profile} />
                ))
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
