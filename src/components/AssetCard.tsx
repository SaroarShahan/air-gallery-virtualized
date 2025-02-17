import { useState } from 'react';
import Link from 'next/link';
import Img from 'next/image';

import { getSize } from '@/utils';

interface CardProps {
  clip: Clip;
  height?: number;
  width?: number;
}

const AssetCard = ({ clip, height, width }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = clip.ext === 'mp4';
  const imageSrc = clip.assets?.image;
  const videoSrc = clip.assets?.previewVideo;

  return (
    <div
      className="group relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:to-gray-800 inset-[-6px] rounded-md border-4 border-transparent hover:border-gray-200 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height, width }}
    >
      {imageSrc ? (
        <Img
          src={imageSrc}
          alt={clip.title ?? ''}
          width={clip.width}
          height={clip.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-auto object-cover rounded-md"
          loading="lazy"
        />
      ) : null}

      {isVideo && videoSrc && isHovered ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 h-full w-full object-cover rounded-md opacity-0 group-hover:opacity-100 transition-all fade-in"
        />
      ) : null}

      {isVideo && !isHovered ? (
        <p className="absolute right-4 bottom-4 bg-gray-800 text-white text-xs rounded-sm px-2 py-1 z-10 opacity-80">
          {clip.duration}
        </p>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 flex h-[100px] flex-col justify-end rounded rounded-t-none bg-gradient-to-b from-black/0 to-black/90 px-2 pb-2 pt-1 opacity-0 group-hover:opacity-100 transition-all">
        <div className="pointer-events-none flex">
          <Link
            href="/"
            className="truncate text-left font-medium hover:underline text-white"
          >
            {clip.title ?? ''}
          </Link>
        </div>

        <p className="truncate text-12 text-white uppercase">
          {clip.ext} · {getSize(clip.size)} · {`${clip.width} x ${clip.height}`}
        </p>
      </div>
    </div>
  );
};

export default AssetCard;
