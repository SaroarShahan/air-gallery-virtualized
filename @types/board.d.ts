interface Board {
  id: string;
  parentId: string | null;
  creatorId: string;
  workspaceId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  hasCurrentUser: boolean;
  thumbnails?: string[];
  ancestors?: Pick<Board, 'id' | 'title'>[];
  pos: number;
}

interface BoardsListResponse {
  data: Board[];
  pagination: {
    hasMore: boolean;
    cursor: string | null;
  };
  total: number;
}
