import { createBrowserRouter } from "react-router-dom";

import IndexPage from '../pages/index'
import SignUpPage from "../pages/signup/SignUp";
import SignInPage  from "../pages/signin/SignIn";
import ChatPage from '@/pages/chat'
import MembersPage from "@/pages/members";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
    children: [
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'members',
        element: <MembersPage />
      }
    ]
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  }
])