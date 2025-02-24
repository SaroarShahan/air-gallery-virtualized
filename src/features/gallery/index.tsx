import { lazy, Suspense } from 'react';

import Skeleton from '@/components/Skeleton';

const Board = lazy(() => import('@/features/gallery/components/Board'));
const MasonryGallery = lazy(
  () => import('@/features/gallery/components/MasonryGallery')
);

const HomeGallery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton />}>
        <Board />
      </Suspense>

      <Suspense fallback={<Skeleton type="assets" />}>
        <MasonryGallery />
      </Suspense>
    </div>
  );
};

export default HomeGallery;
