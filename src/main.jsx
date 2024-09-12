import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import ErrorPage from "./pages/ErrorPage.jsx";
import CollectionFormForOld from "./pages/CollectionFormForOld.jsx";
import SAMBind from "./pages/SAMBind.jsx";
import Goods from "./pages/Goods.jsx";
import Feedback from "./pages/Feedback.jsx";

import {FpjsProvider} from '@fingerprintjs/fingerprintjs-pro-react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <CollectionFormForOld/>,
    errorElement: <ErrorPage/>
  }, {
    path: '/goods',
    element: <Goods/>,
  }, {
    path: '/sam-bind',
    element: <SAMBind/>
  }, {
    path: '/feedback',
    element: <Feedback/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FpjsProvider
      loadOptions={{
        apiKey: "8Zketj5Hyu4Gxrn2SLQn",
        region: "ap"
      }}
    >
      <RouterProvider router={router}/>
    </FpjsProvider>
  </React.StrictMode>
)
