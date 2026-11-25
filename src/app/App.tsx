import { createBrowserRouter, RouterProvider } from 'react-router';
import { GiftsPage } from '../features/gifts/GiftsPage';
import { InvitationPage } from '../features/invitations/InvitationPage';
import { OwnersPage } from '../features/owners/OwnersPage';
import { HomePage } from './HomePage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/:slug', element: <InvitationPage /> },
  { path: '/:slug/regalos', element: <GiftsPage /> },
  { path: '/:slug/papis', element: <OwnersPage /> },
  { path: '*', element: <InvitationPage /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
