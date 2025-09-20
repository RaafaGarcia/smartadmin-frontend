import React from 'react';
import { Settings, Eye } from 'lucide-react';

export const SettingsPage: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h1>
      <p className="text-gray-600 mb-4">Esta página está en desarrollo</p>
      <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
        <Eye className="h-4 w-4 mr-2" />
        Próximamente: Configuraciones del sistema
      </div>
    </div>
  </div>
);