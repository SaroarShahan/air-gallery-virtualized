import React from 'react';

interface CardVideoProps {
  isHovered: boolean;
  duration: number;
  ext: string;
  assets: Assets;
}

const CardVideo = ({ duration, ext, assets, isHovered }: CardVideoProps) => {
  const videoSrc = assets?.previewVideo;
  const isVideo = ext === 'mp4';

  return (
    <>
      {isVideo && isHovered && videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 h-full w-full object-cover rounded-md opacity-0 group-hover:opacity-100 transition-all fade-in"
        />
      )}

      {isVideo && !isHovered && (
        <p className="absolute right-4 bottom-4 bg-gray-800 text-white text-xs rounded-sm px-2 py-1 z-10 opacity-80">
          {duration}
        </p>
      )}
    </>
  );
};

export default CardVideo;
