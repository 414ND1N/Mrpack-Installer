import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@/hooks/localsConfig.tsx'

import { GlobalMessageProvider } from "@/context/GlobalMessageContext"
import GlobalMessageModal from "@/components/GlobalMessage/GlobalMessage.tsx"
import LoadingScreen from "@/components/loadingScreen/loadingScreen.tsx"
import { Toaster } from "@/components/Toast/toaster"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalMessageProvider>
    <GlobalMessageModal />
    <Suspense fallback={<LoadingScreen />}>
      <App />
    </Suspense>
    <Toaster />
  </GlobalMessageProvider>
)