export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PLUMBER = 'PLUMBER',
  ADMIN = 'ADMIN',
}
export enum JobStatus {
  REQUESTED = 'REQUESTED',
  MATCHING = 'MATCHING',
  ACCEPTED = 'ACCEPTED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SITE = 'ON_SITE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export interface User {
  id: string;
  role: UserRole;
  email: string;
  passwordHash: string; // For simulation
  name: string;
  phone: string;
  createdAt: string;
}
export interface PlumberProfile {
  id: string; // Corresponds to a User ID
  userId: string;
  bio: string;
  radiusKm: number;
  baseRate: number; // For display only
  avgRating: number;
  reviewCount: number;
  isAvailable: boolean;
}
export interface JobTimelineEvent {
  status: JobStatus;
  timestamp: string;
  notes?: string;
}
export interface Job {
  id: string;
  customerId: string;
  plumberId?: string;
  status: JobStatus;
  description: string;
  photos: string[];
  scheduledAt: string;
  address: string;
  timeline: JobTimelineEvent[];
  createdAt: string;
}
export interface Review {
  id: string;
  jobId: string;
  authorId: string; // Customer ID
  plumberId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
}
// Market Validation Types
export interface MarketRequest {
  id: string;
  name: string;
  contact: string; // Can be email or phone
  address: string;
  description: string;
  createdAt: string;
}
export interface AnalyticsData {
  id: 'singleton';
  pageViews: number;
}