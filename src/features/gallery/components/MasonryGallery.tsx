'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import debounce from 'lodash/debounce';

import { fetchAssets } from '@/app/api/clips';
import Skeleton from '@/components/Skeleton';
import Title from '@/components/Title';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import Card from '@/components/Card';

const CONTAINER_GAP = 16;

const MasonryGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
    initialPageParam: 0,
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
    () => debounce(handleScroll, 200),
    [handleScroll]
  );

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [debouncedScroll]);

  const distributeImages = useCallback(() => {
    const rows: CalculatedImageItem[][] = [];
    let currentRow: CalculatedImageItem[] = [];
    let currentRowWidth = 0;
    const containerWidth = containerRef.current?.clientWidth || 0;
    const maxItemWidth = containerWidth / 2;

    const finalizeRow = (
      row: CalculatedImageItem[],
      rowWidth: number
    ): CalculatedImageItem[] => {
      const totalGaps = row.length - 1;
      const availableWidth = containerWidth - totalGaps * CONTAINER_GAP;
      const scale = availableWidth / (rowWidth - totalGaps * CONTAINER_GAP);

      return row.map((item) => ({
        ...item,
        calculatedWidth: Math.min(
          Math.floor(item.calculatedWidth * scale),
          600
        ),
      }));
    };

    memoizedImages.forEach((image) => {
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
        normalizedWidth + (currentRow.length > 1 ? CONTAINER_GAP : 0);

      if (currentRowWidth >= containerWidth * 0.85) {
        rows.push(finalizeRow(currentRow, currentRowWidth));
        currentRow = [];
        currentRowWidth = 0;
      }
    });

    if (currentRow.length > 0) {
      const finalArr = finalizeRow(currentRow, currentRowWidth);

      if (finalArr.length >= 6)
        rows.push(finalizeRow(currentRow, currentRowWidth));
    }

    return rows;
  }, [memoizedImages]);

  const memoizedRows = useMemo(() => distributeImages(), [distributeImages]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const renderRow = ({ index, key, style }: RowProps) => {
    if (index >= memoizedRows.length) return null;
    const rows = memoizedRows[index];

    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          gap: `${CONTAINER_GAP}px`,
        }}
        role="row"
      >
        {rows.map((row) => (
          <div key={`${index}-${row.id}`} role="gridcell">
            <Card
              height={228}
              width={row.calculatedWidth}
              onEnter={handleMouseEnter}
              onLeave={handleMouseLeave}
              title={row.title ?? ''}
            >
              {row.assets?.image && (
                <Card.Image
                  src={row.assets.image}
                  alt={row.title ?? ''}
                  width={row.width}
                  height={row.height}
                />
              )}

              <Card.Video
                assets={row.assets}
                duration={row.duration!}
                ext={row.ext}
                isHovered={isHovered}
              />

              <Card.Content
                title={row?.title ?? ''}
                size={row.size}
                ext={row.ext}
                height={row.height}
                width={row.width}
              />
            </Card>
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
              <div className="flex justify-center text-lg font-bold">
                No more images to load
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default MasonryGallery;
