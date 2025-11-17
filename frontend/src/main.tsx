import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./index.css"
import App from './App.tsx'
import MainPage from './components/pages/mainpage.tsx';
import Customer from './components/pages/Customer.tsx';
import StoreManage from './components/pages/StoreManage.tsx';
import Employee from './components/pages/Employee.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { index: true, element: <MainPage/> },
      { path: "user", element: <Customer/> },
      { path: "manager", element: <StoreManage/> },
      { path: "member", element: <Employee/> }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
