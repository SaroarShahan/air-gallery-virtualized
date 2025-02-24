type Page = {
  data: {
    total: number;
    clips: Clip[];
  };
  pagination: {
    hasMore: boolean;
    cursor: null | string;
  };
};

interface ImageAsset {
  image: string;
}

interface ImageItem extends Clip {
  id: string;
  width: number;
  height: number;
  title?: string;
  ext: string;
  size: number;
}

interface CalculatedImageItem extends ImageItem {
  calculatedWidth: number;
}

interface RowProps {
  index: number;
  key: string;
  style: React.CSSProperties;
}
