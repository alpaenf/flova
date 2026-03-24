export type UserRole = 'admin' | 'staff' | 'viewer'

export interface ServiceLog {
  id: string
  customer_name: string
  service_stage: string
  start_time: string
  end_time: string
  duration: number // in minutes
  created_at: string
  user_id: string
}

export interface ServiceStage {
  id: string
  name: string
  display_order: number
  created_at: string
}

export interface StageAnalytics {
  stage: string
  count: number
  totalDuration: number
  avgDuration: number
  percentage: number
}

export interface HourlyData {
  hour: number
  count: number
  avgDuration: number
}

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string
}
