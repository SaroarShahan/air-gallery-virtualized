import React from 'react';
import Img from 'next/image';

interface CardImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const CardImage = ({ src, alt, width, height }: CardImageProps) => {
  return (
    <Img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="w-full h-auto object-cover rounded-md"
      loading="lazy"
    />
  );
};

export default CardImage;
