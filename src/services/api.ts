import type { User, Project, DashboardData, AuthUser } from '../types';

export class ApiService {
  // IMPORTANTE: Cambia esta URL por tu API de Render
//   private static API_BASE = 'https://smartadmin-api.onrender.com/api';
    private static API_BASE = 'http://localhost:8000/api';
  private static getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private static setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private static removeToken(): void {
    localStorage.removeItem('access_token');
  }

  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Si token expirado, limpiar y redirigir
    if (response.status === 401) {
      this.removeToken();
      window.location.reload();
      throw new Error('Token expired');
    }

    return response;
  }

  // Auth mejorado
  static async login(email: string, password: string): Promise<AuthUser> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch(`${this.API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error:', errorText);
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await this.fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  static logout() {
    this.removeToken();
  }

  // Dashboard con mejor manejo de errores
  static async getDashboardMetrics(): Promise<DashboardData> {
    try {
      const response = await this.fetchWithAuth('/dashboard/metrics');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard metrics: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      return data;
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  }

  // Users
  static async getUsers(): Promise<User[]> {
    const response = await this.fetchWithAuth('/users/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.fetchWithAuth('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  static async deleteUser(id: number): Promise<void> {
    const response = await this.fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  // Projects
  static async getProjects(): Promise<Project[]> {
    const response = await this.fetchWithAuth('/projects/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return response.json();
  }

  static async createProject(projectData: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithAuth('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return response.json();
  }

  static async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithAuth(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return response.json();
  }

  static async deleteProject(id: number): Promise<void> {
    const response = await this.fetchWithAuth(`/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  }

  // Método para verificar si el token es válido
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decodificar JWT básico (sin librería)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar si no ha expirado
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
