import sharp from 'sharp';

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

export type OptimizedImage = {
  buffer: Buffer;
  width?: number;
  height?: number;
};

export const optimizeImage = async (buffer: Buffer, mimetype: string): Promise<OptimizedImage> => {
  let pipeline = sharp(buffer).rotate();

  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.height) {
    const overMax = metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION;
    if (overMax) {
      pipeline = pipeline.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }

  if (mimetype === 'image/jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (mimetype === 'image/png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (mimetype === 'image/webp') {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height
  };
};
