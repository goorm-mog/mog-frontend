import { useEffect } from 'react';

export function useReceiptPageBackground(backgroundColor: string) {
  useEffect(() => {
    const root = document.getElementById('root');
    const themeColor = getThemeColorMetaElement();
    const previousThemeColor = themeColor.content;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousRootBackground = root?.style.backgroundColor ?? '';

    themeColor.content = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;

    if (root) {
      root.style.backgroundColor = backgroundColor;
    }

    return () => {
      themeColor.content = previousThemeColor;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      document.body.style.backgroundColor = previousBodyBackground;

      if (root) {
        root.style.backgroundColor = previousRootBackground;
      }
    };
  }, [backgroundColor]);
}

function getThemeColorMetaElement() {
  const existingThemeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  if (existingThemeColor) {
    return existingThemeColor;
  }

  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  document.head.append(themeColor);

  return themeColor;
}
