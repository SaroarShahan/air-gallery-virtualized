'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchBoards } from '@/app/api/boards';
import Skeleton from '@/components/Skeleton';
import Title from '@/components/Title';
import Card from '@/components/Card';

const Board = () => {
  const [showBoards, setShowBoards] = useState(true);

  const { data, status } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  return (
    <div className="mb-6">
      <Title
        showIcon={showBoards}
        title="Boards"
        count={data?.total ?? 0}
        onClick={() => setShowBoards(!showBoards)}
      />

      {status === 'pending' ? (
        <Skeleton />
      ) : (
        showBoards && (
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            {data?.data.map((board) => (
              <Card key={board.id} title={board.title} height={204} width={236}>
                {board?.thumbnails?.[0] && (
                  <Card.Image
                    src={board.thumbnails[0]}
                    alt={board.title}
                    height={204}
                    width={236}
                  />
                )}

                <Card.Link title={board.title} />
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Board;
