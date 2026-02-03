import { useEffect, useRef } from 'react';
import './App.css';

const IFRAME_SRC =
  'https://e.notionhero.io/e1/p/43c696c-3102d7892bca6da96f6ec9a77402104';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const resizeIframe = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        const contentHeight = doc.body.scrollHeight;
        if (contentHeight) {
          iframe.style.height = `${contentHeight}px`;
        }
      } catch {
        // Cross-origin access can fail; keep the viewport height instead.
      }
    };

    const iframe = iframeRef.current;
    const onLoad = () => resizeIframe();

    iframe?.addEventListener('load', onLoad);
    window.addEventListener('resize', resizeIframe);

    resizeIframe();

    return () => {
      iframe?.removeEventListener('load', onLoad);
      window.removeEventListener('resize', resizeIframe);
    };
  }, []);

  return (
    <div className="page">
      <iframe
        ref={iframeRef}
        id="myIframe"
        src={IFRAME_SRC}
        title="Notion content"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
