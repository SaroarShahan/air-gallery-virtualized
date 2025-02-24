import Link from 'next/link';
import React from 'react';

interface CardLinkProps {
  title: string;
}

const CardLink = ({ title }: CardLinkProps) => {
  return (
    <Link
      href="/"
      className="absolute bottom-3 px-2 text-base font-normal text-white hover:underline"
    >
      {title}
    </Link>
  );
};

export default CardLink;
