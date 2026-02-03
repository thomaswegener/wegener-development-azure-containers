import { useMemo } from 'react'
import { BrowserRouter, useSearchParams } from 'react-router-dom'
import {
  contactTopics,
  defaultPdfSlug,
  defaultVideoId,
  pdfPackages,
  socialLinks,
  videoCollections,
  videosById,
} from './data'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import VideoPlayer from './components/VideoPlayer'
import PdfViewer from './components/PdfViewer'
import ContactForm from './components/ContactForm'

type ViewState =
  | { type: 'video'; videoId: string }
  | { type: 'pdf'; slug: string }
  | { type: 'contact' }

const Content = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const view = useMemo<ViewState>(() => {
    const contact = searchParams.get('contact')
    const videoId = searchParams.get('video')
    const pdfSlug = searchParams.get('pdf')

    if (contact) {
      return { type: 'contact' }
    }
    if (videoId && videosById[videoId]) {
      return { type: 'video', videoId }
    }
    if (pdfSlug && pdfPackages.some((pkg) => pkg.slug === pdfSlug)) {
      return { type: 'pdf', slug: pdfSlug }
    }
    return { type: 'video', videoId: defaultVideoId }
  }, [searchParams])

  const setVideo = (videoId: string) => {
    setSearchParams({ video: videoId })
  }

  const setPdf = (slug: string) => {
    setSearchParams({ pdf: slug })
  }

  const openContact = () => {
    setSearchParams({ contact: '1' })
  }

  return (
    <div className="app-shell">
      <Header
        onVideoSelect={setVideo}
        onPdfSelect={setPdf}
        onContactSelect={openContact}
        activeVideoId={view.type === 'video' ? view.videoId : undefined}
        videoCollections={videoCollections}
        packages={pdfPackages}
        homeVideoId={defaultVideoId}
        defaultPdfSlug={defaultPdfSlug}
      />
      <main className="main-panel">
        {view.type === 'video' && (
          <VideoPlayer video={videosById[view.videoId]} />
        )}
        {view.type === 'pdf' && (
          <PdfViewer
            pkg={pdfPackages.find((pkg) => pkg.slug === view.slug) ?? pdfPackages[0]}
          />
        )}
        {view.type === 'contact' && (
          <ContactForm topics={contactTopics} onBack={() => setVideo(defaultVideoId)} />
        )}
      </main>
      <Footer
        socialLinks={socialLinks}
        videoCollections={videoCollections}
        onVideoSelect={setVideo}
      />
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <Content />
  </BrowserRouter>
)

export default App
