import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const loc = useLocation();
  const { user, signOut } = useAuth();
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⏱️ Control de Horas Laboradas</h1>
        <nav className="flex gap-2 items-center">
          <Link
            to="/"
            className={`px-3 py-1 rounded ${loc.pathname === '/' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
          >
            Ver horas
          </Link>
          {user ? (
            <>
              <Link
                to="/admin"
                className={`px-3 py-1 rounded ${loc.pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
              >
                Editar
              </Link>
              <button
                onClick={signOut}
                className="px-3 py-1 rounded hover:bg-slate-700 text-sm"
              >
                Salir ({user.email})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-1 rounded ${loc.pathname === '/login' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
