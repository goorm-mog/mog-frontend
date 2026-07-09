import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function prepare() {
  if (import.meta.env.VITE_MSW_ENABLED === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest(request, print) {
        if (import.meta.env.VITE_MSW_MODE === 'network-first') return;

        const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
        const isApiRequest = apiBase
          ? request.url.startsWith(apiBase)
          : request.url.includes('/api/') || request.url.startsWith('/');
        if (isApiRequest) print.warning();
      },
    })
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
