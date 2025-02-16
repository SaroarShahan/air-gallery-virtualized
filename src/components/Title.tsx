interface TitleProps {
  showIcon?: boolean;
  title: string;
  count?: number;
  onClick: VoidFunction;
}

const Title = ({ showIcon = true, title, count = 0, onClick }: TitleProps) => {
  return (
    <div className="pb-3">
      <p
        className="text-sm font-bold text-gray-500 inline-flex items-center gap-2 uppercase cursor-pointer rounded-md p-2 transition-all hover:bg-gray-100"
        onClick={onClick}
      >
        {title} {`(${count})`} {showIcon ? '▼' : '▶'}
      </p>
    </div>
  );
};

export default Title;
