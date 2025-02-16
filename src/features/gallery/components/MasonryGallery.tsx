'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import debounce from 'lodash/debounce';

import AssetCard from '@/components/AssetCard';
import { fetchAssets } from '@/app/api/clips';
import Skeleton from '@/components/Skeleton';
import Title from '@/components/Title';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

const MasonryGallery = () => {
  const containerRef = useRef(null);
  const [showAssets, setShowAssets] = useState(true);

  const {
    data,
    status,
    isLoading: loading,
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage,
  } = useInfiniteQuery<Page>({
    queryKey: ['assets'],
    queryFn: ({ pageParam = null }: { pageParam: unknown }) =>
      fetchAssets({ cursor: pageParam as string | null }),
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
    initialPageParam: undefined,
  });

  const memoizedImages = useMemo(
    () => data?.pages.flatMap((page) => (page as Page).data.clips) || [],
    [data]
  );
  const totalCount = data?.pages[0]?.data.total ?? 0;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300 && !loading && hasMore) {
      fetchNextPage();
    }
  }, [loading, hasMore, fetchNextPage]);

  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 100),
    [handleScroll]
  );

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [debouncedScroll]);

  // Update the distributeImages function with proper types
  const distributeImages = useCallback(() => {
    if (typeof window === 'undefined') return [];

    const rows: CalculatedImageItem[][] = [];
    let currentRow: CalculatedImageItem[] = [];
    let currentRowWidth = 0;
    const containerWidth = window?.innerWidth - 64;
    const maxItemWidth = containerWidth / 2;
    const gapWidth = 16;

    const finalizeRow = (
      row: CalculatedImageItem[],
      rowWidth: number
    ): CalculatedImageItem[] => {
      if (row.length === 0) return row;

      const totalGaps = row.length - 1;
      const availableWidth = containerWidth - totalGaps * gapWidth;
      const scale = availableWidth / (rowWidth - totalGaps * gapWidth);

      return row.map((item) => ({
        ...item,
        calculatedWidth: Math.floor(item.calculatedWidth * scale),
      }));
    };

    memoizedImages.forEach((image: ImageItem) => {
      const aspectRatio = image.width / image.height;
      let normalizedWidth = Math.floor(228 * aspectRatio);

      if (normalizedWidth > maxItemWidth) {
        normalizedWidth = maxItemWidth;
      }

      if (
        currentRowWidth + normalizedWidth > containerWidth &&
        currentRow.length > 0
      ) {
        rows.push(finalizeRow(currentRow, currentRowWidth));
        currentRow = [];
        currentRowWidth = 0;
      }

      currentRow.push({ ...image, calculatedWidth: normalizedWidth });
      currentRowWidth +=
        normalizedWidth + (currentRow.length > 1 ? gapWidth : 0);

      if (currentRowWidth >= containerWidth * 0.85) {
        rows.push(finalizeRow(currentRow, currentRowWidth));
        currentRow = [];
        currentRowWidth = 0;
      }
    });

    if (currentRow.length > 0) {
      rows.push(finalizeRow(currentRow, currentRowWidth));
    }

    return rows;
  }, [memoizedImages]);

  const memoizedRows = useMemo(() => distributeImages(), [distributeImages]);

  const renderRow = ({ index, key, style }: RowProps) => {
    if (index >= memoizedRows.length) return null;
    const row = memoizedRows[index];

    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          gap: '16px',
          padding: '0 16px',
          width: '100%',
        }}
        role="row"
      >
        {row.map(({ calculatedWidth, ...image }, imageIndex) => (
          <div
            key={`${index}-${image.id}`}
            className="masonry-item"
            style={{
              width: `${calculatedWidth}px`,
              flexShrink: 0,
            }}
            role="gridcell"
          >
            <AssetCard
              key={image.id}
              height={228}
              width={calculatedWidth}
              clip={image as Clip}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef}>
      <Title
        title="Assets"
        count={totalCount}
        onClick={() => setShowAssets(!showAssets)}
      />

      {status === 'pending' ? (
        <Skeleton type="assets" />
      ) : (
        showAssets && (
          <div role="grid" aria-label="Image gallery">
            <WindowScroller>
              {({ height, isScrolling, registerChild, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <div ref={registerChild as React.LegacyRef<HTMLDivElement>}>
                      <List
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        rowCount={memoizedRows.length}
                        rowHeight={248}
                        rowRenderer={renderRow}
                        scrollTop={scrollTop}
                        width={width}
                        style={{ outline: 'none' }}
                        overscanRowCount={3}
                      />
                    </div>
                  )}
                </AutoSizer>
              )}
            </WindowScroller>

            {isFetchingNextPage && <Skeleton type="assets" />}
            {!hasMore && !loading && (
              <div className="end-message">No more images to load</div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default MasonryGallery;
