import { createBrowserRouter, RouterProvider } from 'react-router';
import { InvitationPage } from '../features/invitations/InvitationPage';
import { HomePage } from './HomePage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/:slug', element: <InvitationPage /> },
  { path: '*', element: <InvitationPage /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
