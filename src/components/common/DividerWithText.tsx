type DividerWithTextProps = {
  text: string;
};

function DividerWithText({ text }: DividerWithTextProps) {
  return (
    <div className="flex w-full items-center">
      <div className="min-w-0 flex-1 pr-[9px]">
        <div className="h-px w-full border-b border-dashed border-background" />
      </div>
      <span className="text-caption text-text/40">{text}</span>
      <div className="min-w-0 flex-1 pl-[9px]">
        <div className="h-px w-full border-b border-dashed border-background" />
      </div>
    </div>
  );
}

export default DividerWithText;
