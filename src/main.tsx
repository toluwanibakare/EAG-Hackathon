import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/wagmi'
import './index.css'
import App from './App'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'

if (localStorage.getItem('runda-dark') === 'true') {
  document.documentElement.classList.add('dark')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={localStorage.getItem('runda-dark') === 'true' ? darkTheme() : lightTheme()}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
