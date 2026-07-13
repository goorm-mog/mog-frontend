import type { Preview } from '@storybook/react-vite';
import MockDate from 'mockdate';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 390, margin: '0 auto', backgroundColor: '#fffaf3', minHeight: '100vh', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  async beforeEach() {
    MockDate.set('2025-06-29T12:00:00Z');
  },
};

export default preview;
