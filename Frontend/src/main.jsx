import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import AppState from './Context/App_State.jsx'
import './Component/i18.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<AppState>
<App />,
</AppState> 
  </StrictMode>,
)
