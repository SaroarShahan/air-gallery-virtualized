import clsx from 'clsx';
import React from 'react';
import Link from 'next/link';
import Img from 'next/image';

interface CardProps {
  imageUrl: string | undefined;
  title: string;
}

const Card = ({ imageUrl, title }: CardProps) => {
  const classes = clsx(
    `group relative before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:to-gray-950 inset-[-6px] rounded-md overflow-hidden border-4 border-transparent hover:border-gray-200 transition-all h-[204px] w-full md:w-[236px]`
  );

  return (
    <div className={classes}>
      {imageUrl ? (
        <Img
          src={imageUrl}
          alt={title}
          width={236}
          height={204}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover rounded-md"
        />
      ) : null}

      <Link
        href="/"
        className="absolute bottom-3 px-2 text-base font-normal text-white hover:underline"
      >
        {title}
      </Link>
    </div>
  );
};

export default Card;
