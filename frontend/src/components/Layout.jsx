import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c2a33] via-primary to-[#2a3d4a]">
      <Navbar />
      <main className="pt-[72px]">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
