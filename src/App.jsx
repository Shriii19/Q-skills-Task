import { Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import Home from './pages/Home'
import Translator from './pages/Translator'
import StringGenerator from './pages/StringGenerator'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/string-generator" element={<StringGenerator />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  )
}
