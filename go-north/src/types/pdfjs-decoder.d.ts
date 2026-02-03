declare module 'pdfjs-dist/legacy/image_decoders/pdf.image_decoders.mjs' {
  export const JpxImage: {
    setOptions(options: {
      handler: any
      useWasm: boolean
      useWorkerFetch: boolean
      wasmUrl: string
    }): void
  }
}
