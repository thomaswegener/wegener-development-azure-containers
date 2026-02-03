import { useEffect, useRef, useState } from 'react'
import type { VideoItem } from '../data'

type VideoWithSrc = VideoItem & { src: string }

type VideoPlayerProps = {
  video: VideoWithSrc
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setFinished(false)
    const node = videoRef.current
    if (node) {
      node.currentTime = 0
      void node.play().catch(() => {
        /* autoplay might be blocked */
      })
    }
  }, [video.src])

  return (
    <section className="panel video-panel">
      <div className="panel-header">
        <h1>{video.title}</h1>
        <p>{video.description}</p>
      </div>
      <video
        ref={videoRef}
        className="hero-video"
        controls
        autoPlay
        muted
        playsInline
        onEnded={() => setFinished(true)}
        src={video.src}
      >
        <track kind="captions" />
      </video>
      {finished && <div className="panel-note">Thanks for watching!</div>}
    </section>
  )
}

export default VideoPlayer
