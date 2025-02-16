interface SkeletonProps {
  type?: 'board' | 'assets';
}

const Skeleton = ({ type = 'board' }: SkeletonProps) => {
  const isBoard = type === 'board';

  if (isBoard) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-72 h-40 rounded-md bg-gray-200 animate-pulse`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`w-full h-72 rounded-md bg-gray-200 animate-pulse break-inside-void mb-8`}
        />
      ))}
    </div>
  );
};

export default Skeleton;
