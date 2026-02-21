import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <Navbar />
      <main className="pt-[72px]">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
