import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@/hooks/localsConfig.tsx'

import { GlobalMessageProvider } from "@/context/GlobalMessageContext"
import GlobalMessageModal from "@/components/GlobalMessage/GlobalMessage.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalMessageProvider>
    {/* <React.StrictMode> */}
    <GlobalMessageModal />
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
    {/* </React.StrictMode>, */}
  </GlobalMessageProvider>
)