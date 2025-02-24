import { getSize } from '@/utils';
import Link from 'next/link';
import React, { useMemo } from 'react';

interface CardContentProps {
  title: string;
  ext: string;
  size: number;
  width: number;
  height: number;
}

const CardContent = ({ title, ext, width, height, size }: CardContentProps) => {
  const cardDetails = useMemo(() => {
    return `${ext.toUpperCase()} · ${getSize(size)} · ${width} x ${height}`;
  }, [ext, size, width, height]);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex h-[100px] flex-col justify-end rounded rounded-t-none bg-gradient-to-b from-black/0 to-black/90 px-2 pb-2 pt-1 opacity-0 group-hover:opacity-100 transition-all">
      <div className="pointer-events-none flex">
        {title && (
          <Link
            href="/"
            className="truncate text-left font-medium hover:underline text-white"
          >
            {title}
          </Link>
        )}
      </div>

      <p className="truncate text-12 text-white uppercase">{cardDetails}</p>
    </div>
  );
};

export default CardContent;
