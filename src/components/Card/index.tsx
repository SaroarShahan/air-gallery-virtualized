import React, {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
} from 'react';

import CardImage from './CardImage';
import CardVideo from './CardVideo';
import CardContent from './CardContent';
import CardLink from './CardLink';

interface CardProps {
  title: string;
  height?: number;
  width?: number;
  onEnter?: VoidFunction;
  onLeave?: VoidFunction;
}

const Card = ({
  title,
  height,
  width,
  children,
  onEnter,
  onLeave,
}: PropsWithChildren<CardProps>) => {
  return (
    <div
      className="group relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:to-gray-800 inset-[-6px] rounded-md border-4 border-transparent hover:border-gray-200 transition-all"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ height, width }}
      role="Card"
      aria-label={title}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          throw new Error('Card only accepts valid React elements as children');
        }

        return cloneElement(child);
      })}
    </div>
  );
};

Card.Image = CardImage;
Card.Video = CardVideo;
Card.Content = CardContent;
Card.Link = CardLink;

export default Card;
