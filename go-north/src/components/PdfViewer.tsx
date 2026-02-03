import { lazy, Suspense, useMemo, useState } from 'react'
// Use the React-PDF bundle with the legacy worker to keep JPX decoding support.
import type { DocumentProps, PageProps } from 'react-pdf'
type PdfModule = typeof import('react-pdf')
type DecoderModule = typeof import('pdfjs-dist/legacy/image_decoders/pdf.image_decoders.mjs')
import { withAssetHost } from '../data'

const pdfModulePromise = import('react-pdf') as Promise<PdfModule>
const pdfWorker = import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
const decoderModulePromise = import(
  /* webpackIgnore: true */
  /* @vite-ignore */
  'pdfjs-dist/legacy/image_decoders/pdf.image_decoders.mjs'
) as Promise<DecoderModule>
const wasmUrl =
  (typeof window !== 'undefined' ? `${window.location.origin}/pdfjs/` : '') ||
  withAssetHost('/pdfjs/')
import type { PdfPackage } from '../data'
import { packagePdfUrl } from '../data'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

const pdfOptions = { nativeImageDecoderSupport: 'none' as const }

const LazyDocument = lazy(() =>
  Promise.all([pdfModulePromise, pdfWorker, decoderModulePromise]).then(
    ([module, workerSrc, decoders]) => {
      module.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc.default
      ;(module.pdfjs.GlobalWorkerOptions as any).nativeImageDecoderSupport = 'none'
      decoders.JpxImage?.setOptions({
        handler: null,
        useWasm: false,
        useWorkerFetch: false,
        wasmUrl, // still used for fallback module path
      })
      return { default: module.Document }
    },
  ),
) as React.ComponentType<DocumentProps>

const LazyPage = lazy(() =>
  pdfModulePromise.then((module) => ({ default: module.Page })),
) as React.ComponentType<PageProps>

type PdfViewerProps = {
  pkg: PdfPackage
}

const PdfViewer = ({ pkg }: PdfViewerProps) => {
  const fileUrl = useMemo(() => packagePdfUrl(pkg), [pkg])
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.1)
  const [error, setError] = useState<string | null>(null)

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setError(null)
  }

  const changePage = (offset: number) => {
    setPageNumber((prev) => {
      const next = prev + offset
      if (next < 1 || (numPages && next > numPages)) {
        return prev
      }
      return next
    })
  }

  const canGoPrev = pageNumber > 1
  const canGoNext = numPages > 0 && pageNumber < numPages

  const zoom = (delta: number) => {
    setScale((value) => {
      const next = Number((value + delta).toFixed(2))
      return Math.min(Math.max(next, 0.6), 2.4)
    })
  }

  return (
    <section className="panel pdf-panel">
      <div className="panel-header">
        <h1>{pkg.title}</h1>
        {pkg.description && <p>{pkg.description}</p>}
      </div>
      <div className="pdf-viewer">
        <div className="pdf-toolbar">
          <button type="button" onClick={() => changePage(-1)} disabled={!canGoPrev}>
            Prev
          </button>
          <span>
            Page {Math.min(pageNumber, numPages || pageNumber)}
            {numPages ? ` / ${numPages}` : ''}
          </span>
          <button type="button" onClick={() => changePage(1)} disabled={!canGoNext}>
            Next
          </button>
          <div className="pdf-toolbar-divider" />
          <button type="button" onClick={() => zoom(-0.15)}>
            –
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button type="button" onClick={() => zoom(0.15)}>
            +
          </button>
          <div className="pdf-toolbar-divider" />
          <a href={fileUrl} download>
            Download PDF
          </a>
          <a href={fileUrl} target="_blank" rel="noreferrer">
            Open full-view
          </a>
        </div>
        <div className="pdf-stage">
          {error && <p className="pdf-placeholder">Could not load PDF: {error}</p>}
          {!error && (
            <Suspense fallback={<div className="pdf-placeholder">Loading viewer…</div>}>
              <LazyDocument
                file={fileUrl}
                options={pdfOptions as any}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={(err) => setError(err.message)}
                className="pdf-document"
              >
                <LazyPage
                  pageNumber={pageNumber}
                  scale={scale}
                  className="pdf-page"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </LazyDocument>
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}

export default PdfViewer
