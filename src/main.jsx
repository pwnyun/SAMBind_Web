import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SAMBind from './pages/SAMBind.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SAMBind/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*<FpjsProvider*/}
    {/*  loadOptions={{*/}
    {/*    apiKey: '8Zketj5Hyu4Gxrn2SLQn',*/}
    {/*    region: 'ap',*/}
    {/*  }}*/}
    {/*>*/}
    <RouterProvider router={router}/>
    {/*</FpjsProvider>*/}
  </React.StrictMode>,
)
