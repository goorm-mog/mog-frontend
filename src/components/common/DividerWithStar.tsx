function DividerWithStar() {
  return (
    <div className="flex w-full items-center">
      <div className="min-w-0 flex-1 pr-3">
        <div className="h-px w-full border-b border-dashed border-background" />
      </div>
      <span className="text-caption text-text/30">✦</span>
      <div className="min-w-0 flex-1 pl-3">
        <div className="h-px w-full border-b border-dashed border-background" />
      </div>
    </div>
  );
}

export default DividerWithStar;
