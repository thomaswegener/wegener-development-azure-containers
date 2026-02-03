import type { AboutProfile } from '@shared/contentTypes'
import { renderRichText } from '../utils/richText'

interface Props {
  profile: AboutProfile
}

export const AboutCard = ({ profile }: Props) => (
  <article className="about-card">
    {profile.image && (
      <div className="about-card-image">
        <div className="about-card-image-inner">
          <img src={profile.image} alt={profile.name} />
        </div>
      </div>
    )}
    <div className="about-card-body">
      <h3>{profile.name}</h3>
      {profile.role && <p className="role">{profile.role}</p>}
      {profile.bio && <div className="bio">{renderRichText(profile.bio)}</div>}
      <ul className="focus-areas">
        {profile.focusAreas.map((focus) => (
          <li key={focus}>{focus}</li>
        ))}
      </ul>
      <div className="contact-line">
        {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
        {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
      </div>
    </div>
  </article>
)
