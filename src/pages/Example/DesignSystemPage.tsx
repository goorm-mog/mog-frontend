import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const colorTokens: { name: string; token: keyof typeof colors; className: string }[] = [
  { name: 'Background', token: 'background', className: 'bg-background' },
  { name: 'Dark Background', token: 'darkBackground', className: 'bg-dark-background' },
  { name: 'Border', token: 'border', className: 'bg-border' },
  { name: 'Dark Border', token: 'darkBorder', className: 'bg-dark-border' },
  { name: 'Point', token: 'point', className: 'bg-point' },
  { name: 'Alert', token: 'alert', className: 'bg-alert' },
  { name: 'Text', token: 'text', className: 'bg-text' },
];

const typographyTokens: { name: string; token: keyof typeof typography; sample: string }[] = [
  { name: 'Logo', token: 'logo', sample: '모그' },
  { name: 'Head1', token: 'head1', sample: '헤드라인 1' },
  { name: 'Head2', token: 'head2', sample: '헤드라인 2' },
  { name: 'Body', token: 'body', sample: '본문 텍스트' },
  { name: 'Caption', token: 'caption', sample: '캡션 텍스트' },
  { name: 'Body2', token: 'body2', sample: 'Monospace Text' },
];

function DesignSystemPage() {
  return (
    <div className="px-5 py-8">
      <h1 className="text-head1 text-mog-text mb-8">디자인 시스템</h1>

      {/* Colors */}
      <section className="mb-10">
        <h2 className="text-head2 text-mog-text mb-4">Color</h2>
        <div className="flex flex-col gap-3">
          {colorTokens.map(({ name, token, className }) => (
            <div key={token} className="flex items-center gap-4">
              <div
                className={`${className} w-12 h-12 rounded-lg border border-mog-dark-background shrink-0`}
              />
              <div>
                <p className="text-body text-mog-text">{name}</p>
                <p className="text-caption text-mog-border">{colors[token]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-head2 text-mog-text mb-4">Typography</h2>
        <div className="flex flex-col gap-6">
          {typographyTokens.map(({ name, token, sample }) => (
            <div
              key={token}
              className="border-b border-mog-dark-background pb-6 last:border-none last:pb-0"
            >
              <p className="text-caption text-mog-border mb-2">{name}</p>
              <p className={`${typography[token]} text-mog-text`}>{sample}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DesignSystemPage;
