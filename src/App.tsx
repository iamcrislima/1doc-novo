import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/layout/Header'
import Subheader from './components/layout/Subheader'
import CentralDeAcoes from './pages/CentralDeAcoes'
import Administrativo from './pages/Administrativo'
import NovoDocumentoModal from './components/modals/NovoDocumentoModal'
import './App.css'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
      <p style={{ fontSize: 13 }}>Esta seção está em desenvolvimento.</p>
    </div>
  )
}

function AppLayout({ onNovoClick }: { onNovoClick: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()

  const breadcrumb = (() => {
    const root = { label: '1Doc', to: '/' }
    if (location.pathname === '/')          return [{ label: 'Central de Ações' }]
    if (location.pathname === '/atividades') return [root, { label: 'Atividades' }]
    if (location.pathname === '/documentos') return [root, { label: 'Documentos' }]
    if (location.pathname === '/assinaturas')return [root, { label: 'Assinaturas' }]
    if (location.pathname === '/comunicacao')return [root, { label: 'Comunicação' }]
    if (location.pathname === '/integracoes')return [root, { label: 'Integrações' }]
    if (location.pathname === '/relatorios') return [root, { label: 'Relatórios' }]
    if (location.pathname === '/configuracoes')    return [root, { label: 'Configurações' }]
    if (location.pathname.startsWith('/administrativo')) return [root, { label: 'Administrativo' }]
    return [{ label: 'Central de Ações' }]
  })()

  return (
    <div className="app-root">
      <div className="app-main">
        <Header onNovoClick={onNovoClick} />
        <Subheader breadcrumb={breadcrumb} />

        <div className="app-content">
          <Routes>
            <Route path="/"             element={<CentralDeAcoes />} />
            <Route path="/atividades"   element={<PlaceholderPage title="Atividades" />} />
            <Route path="/documentos"   element={<PlaceholderPage title="Documentos" />} />
            <Route path="/assinaturas"  element={<PlaceholderPage title="Assinaturas" />} />
            <Route path="/comunicacao"  element={<PlaceholderPage title="Comunicação" />} />
            <Route path="/integracoes"  element={<PlaceholderPage title="Integrações" />} />
            <Route path="/relatorios"   element={<PlaceholderPage title="Relatórios" />} />
            <Route path="/configuracoes"    element={<PlaceholderPage title="Configurações" />} />
            <Route path="/administrativo"  element={<Administrativo />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <BrowserRouter>
      <AppLayout onNovoClick={() => setModalOpen(true)} />
      <NovoDocumentoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </BrowserRouter>
  )
}
