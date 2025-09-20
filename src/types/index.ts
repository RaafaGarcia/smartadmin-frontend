export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

export interface DashboardMetrics {
  total_users: number;
  active_projects: number;
  completed_projects: number;
  monthly_revenue: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardData {
  metrics: DashboardMetrics;
  user_growth: ChartData;
  project_status: Record<string, number>;
  recent_activities: Array<{
    id: number;
    user: string;
    action: string;
    project: string;
    time: string;
  }>;
}

export interface AuthUser {
  access_token: string;
  token_type: string;
}