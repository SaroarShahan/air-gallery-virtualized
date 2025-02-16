const boardId = 'c74bbbc8-602b-4c88-be71-9e21b36b0514';
const shortId = 'bDkBvnzpB';

export const fetchAssets = ({
  cursor,
}: {
  cursor: string | null;
}): Promise<ClipsListResponse> =>
  fetch(`https://api.air.inc/shorturl/${shortId}/clips/search`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      limit: 24,
      type: 'all',
      withOpenDiscussionStatus: true,
      filters: {
        board: {
          is: boardId,
        },
      },
      boardId,
      sortField: {
        direction: 'desc',
        name: 'dateModified',
      },
      descendantBoardId: boardId,
      cursor,
    }),
  }).then((r) => r.json());
