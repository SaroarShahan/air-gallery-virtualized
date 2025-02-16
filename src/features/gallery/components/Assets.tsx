'use client';

import { useState } from 'react';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';

import { fetchAssets } from '@/app/api/clips';
import Skeleton from '@/components/Skeleton';
import Title from '@/components/Title';
import AssetCard from '@/components/AssetCard';

const Assets = () => {
  const [showAssets, setShowAssets] = useState(true);

  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery<Page>({
    queryKey: ['assets'],
    queryFn: ({ pageParam = null }: { pageParam: unknown }) =>
      fetchAssets({ cursor: pageParam as string | null }),
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    initialPageParam: undefined,
  });

  const assets = data?.pages.flatMap((page) => (page as Page).data.clips) || [];
  const totalCount = data?.pages[0]?.data.total ?? 0;

  return (
    <>
      <Title
        title="Assets"
        count={totalCount}
        onClick={() => setShowAssets(!showAssets)}
      />

      {status === 'pending' ? (
        <Skeleton type="assets" />
      ) : (
        showAssets && (
          <InfiniteScroll
            dataLength={assets.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<Skeleton type="assets" />}
          >
            <div className="columns-1 sm:columns-2 lg:columns-3 p-2 md:p-4 gap-4">
              {assets.map((asset) => (
                <AssetCard key={asset.id} clip={asset} />
              ))}
            </div>
          </InfiniteScroll>
        )
      )}
    </>
  );
};

export default Assets;
