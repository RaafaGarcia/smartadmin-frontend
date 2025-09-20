import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@smartadmin.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('Iniciando login...');
    
    try {
      const success = await login(email, password);
      
      if (success) {
        setDebugInfo('Login exitoso! Redirigiendo...');
        // El AuthContext manejará el cambio de estado
      } else {
        setError('Error de login. Verifica tus credenciales.');
        setDebugInfo('Login falló - credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de conexión con el servidor.');
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    setDebugInfo('Probando conexión API...');
    try {
      const response = await fetch('https://smartadmin-api.onrender.com/health');
      const data = await response.json();
      setDebugInfo(`API Status: ${data.status} - Version: ${data.version}`);
    } catch (error) {
      setDebugInfo(`API Error: ${error instanceof Error ? error.message : 'Connection failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartAdmin</h1>
          <p className="text-gray-600">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@smartadmin.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin123"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="text-blue-600 text-sm text-center bg-blue-50 p-3 rounded-lg">
              {debugInfo}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Credenciales de demo:</strong><br/>
              Email: admin@smartadmin.com<br/>
              Password: admin123
            </p>
          </div>
          
          <button
            onClick={testApiConnection}
            className="w-full text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            🔍 Probar conexión API
          </button>
        </div>
      </div>
    </div>
  );
};