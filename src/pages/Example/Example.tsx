import { Link } from 'react-router-dom';

function Example() {
  return (
    <div className="flex flex-col p-10 gap-5">
      <title>예시 모음</title>
      <h1 className="text-head1 text-mog-text">예시 모음</h1>

      <Link
        to="/example/design-system"
        className="text-caption bg-point px-4 py-2 w-fit rounded-md text-background"
      >
        디자인 시스템
      </Link>
    </div>
  );
}

export default Example;
