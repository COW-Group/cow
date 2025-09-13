import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/themes/theme-provider';
import '../src/styles.css';

// COW Brand theme for Storybook
const cowTheme = {
  base: 'light',
  brandTitle: 'COW Design System',
  brandUrl: 'https://cyclesofwealth.com',
  brandImage: undefined,
  brandTarget: '_self',
  
  colorPrimary: '#627EEA',
  colorSecondary: '#00B774',
  
  // UI
  appBg: '#F5E6D3',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '\"Inter\", sans-serif',
  fontCode: '\"JetBrains Mono\", monospace',
  
  // Text colors
  textColor: '#1F2937',
  textInverseColor: '#FFFFFF',
  
  // Toolbar default and active colors
  barTextColor: '#6B7280',
  barSelectedColor: '#627EEA',
  barBg: '#FFFFFF',
  
  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputTextColor: '#1F2937',
  inputBorderRadius: 6,
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: cowTheme,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F5E6D3',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#1F2937',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '768px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className=\"p-4\">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;