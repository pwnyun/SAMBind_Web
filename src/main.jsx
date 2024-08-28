import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import ErrorPage from "./pages/ErrorPage.jsx";
import CollectionFormForOld from "./pages/CollectionFormForOld.jsx";
import SAMBind from "./pages/SAMBind.jsx";
import Goods from "./pages/Goods.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CollectionFormForOld />,
    errorElement: <ErrorPage/>
  }, {
    path: '/goods',
    element: <Goods/>,
  }, {
    path: '/sam-bind',
    element: <SAMBind/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
