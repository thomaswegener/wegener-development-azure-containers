import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ContactTopic } from '../data'

type ContactFormProps = {
  topics: ContactTopic[]
  onBack?: () => void
}

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
  topicIds: Set<string>
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  topicIds: new Set<string>(),
}

const ContactForm = ({ topics, onBack }: ContactFormProps) => {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (key: keyof Omit<FormState, 'topicIds'>, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTopic = (id: string) => {
    setForm((prev) => {
      const nextIds = new Set(prev.topicIds)
      if (nextIds.has(id)) {
        nextIds.delete(id)
      } else {
        nextIds.add(id)
      }
      return { ...prev, topicIds: nextIds }
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="panel contact-panel">
      <div className="panel-header">
        <h1>Leave your contact information</h1>
        <p>Tell us what you are planning and we will follow up shortly.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Your name / Company
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
        </label>
        <label>
          E-mail address
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </label>
        <label>
          Phone number
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </label>
        <label>
          Company or group
          <input
            type="text"
            value={form.company}
            onChange={(event) => updateField('company', event.target.value)}
          />
        </label>
        <fieldset>
          <legend>What do you want us to contact you about?</legend>
          {topics.map((topic) => (
            <label key={topic.id} className="checkbox">
              <input
                type="checkbox"
                checked={form.topicIds.has(topic.id)}
                onChange={() => toggleTopic(topic.id)}
              />
              {topic.label}
            </label>
          ))}
        </fieldset>
        <label>
          Anything else we should know?
          <textarea
            rows={4}
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
          />
        </label>
        <div className="actions">
          <button type="submit" className="primary">
            Send
          </button>
          {onBack && (
            <button type="button" onClick={onBack}>
              Back to videos
            </button>
          )}
        </div>
        {submitted && (
          <p className="panel-note">
            Thanks! This demo stores your message locally. Hook it up to your CRM or
            form provider to start receiving submissions.
          </p>
        )}
      </form>
    </section>
  )
}

export default ContactForm
