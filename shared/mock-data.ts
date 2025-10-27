import { User, UserRole, PlumberProfile, Job, JobStatus, Review, Testimonial } from './types';
// MOCK USERS
export const MOCK_USERS: User[] = [
  { id: 'user-customer-1', role: UserRole.CUSTOMER, email: 'customer1@example.com', passwordHash: 'hash', name: 'Alice Johnson', phone: '+39 333 1234567', createdAt: new Date('2023-10-01T10:00:00Z').toISOString() },
  { id: 'user-customer-2', role: UserRole.CUSTOMER, email: 'customer2@example.com', passwordHash: 'hash', name: 'Bob Williams', phone: '+39 333 2345678', createdAt: new Date('2023-10-02T11:00:00Z').toISOString() },
  { id: 'user-plumber-1', role: UserRole.PLUMBER, email: 'plumber1@example.com', passwordHash: 'hash', name: 'Mario Rossi', phone: '+39 347 1112233', createdAt: new Date('2023-09-15T08:00:00Z').toISOString() },
  { id: 'user-plumber-2', role: UserRole.PLUMBER, email: 'plumber2@example.com', passwordHash: 'hash', name: 'Luigi Verdi', phone: '+39 347 4445566', createdAt: new Date('2023-09-16T09:00:00Z').toISOString() },
  { id: 'user-admin-1', role: UserRole.ADMIN, email: 'admin@plumbit.com', passwordHash: 'hash', name: 'Admin User', phone: '+39 02 123456', createdAt: new Date('2023-09-01T00:00:00Z').toISOString() },
];
// MOCK PLUMBER PROFILES
export const MOCK_PLUMBER_PROFILES: PlumberProfile[] = [
  { id: 'user-plumber-1', userId: 'user-plumber-1', bio: '20 years of experience in residential and commercial plumbing. Specializing in emergency leak repairs.', radiusKm: 15, baseRate: 60, avgRating: 4.9, reviewCount: 85, isAvailable: true },
  { id: 'user-plumber-2', userId: 'user-plumber-2', bio: 'Certified boiler technician and installation expert. Fast, friendly, and reliable service.', radiusKm: 25, baseRate: 50, avgRating: 4.7, reviewCount: 42, isAvailable: true },
];
// MOCK JOBS
export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1', customerId: 'user-customer-1', plumberId: 'user-plumber-1', status: JobStatus.COMPLETED,
    description: 'Kitchen sink is completely blocked. Water is not draining at all.',
    photos: [], scheduledAt: new Date('2023-10-25T14:00:00Z').toISOString(), address: 'Via Dante 10, 20121 Milano MI, Italy',
    timeline: [
      { status: JobStatus.REQUESTED, timestamp: new Date('2023-10-25T13:00:00Z').toISOString() },
      { status: JobStatus.ACCEPTED, timestamp: new Date('2023-10-25T13:05:00Z').toISOString() },
      { status: JobStatus.EN_ROUTE, timestamp: new Date('2023-10-25T13:30:00Z').toISOString() },
      { status: JobStatus.ON_SITE, timestamp: new Date('2023-10-25T13:55:00Z').toISOString() },
      { status: JobStatus.COMPLETED, timestamp: new Date('2023-10-25T14:45:00Z').toISOString() },
    ],
    createdAt: new Date('2023-10-25T13:00:00Z').toISOString(),
  },
  {
    id: 'job-2', customerId: 'user-customer-2', plumberId: 'user-plumber-2', status: JobStatus.ON_SITE,
    description: 'My boiler is making a strange noise and there is no hot water.',
    photos: [], scheduledAt: new Date().toISOString(), address: 'Corso Buenos Aires 5, 20124 Milano MI, Italy',
    timeline: [
      { status: JobStatus.REQUESTED, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { status: JobStatus.ACCEPTED, timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
      { status: JobStatus.EN_ROUTE, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { status: JobStatus.ON_SITE, timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-3', customerId: 'user-customer-1', status: JobStatus.REQUESTED,
    description: 'Need to install a new dishwasher. All connections are ready.',
    photos: [], scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), address: 'Via Dante 10, 20121 Milano MI, Italy',
    timeline: [{ status: JobStatus.REQUESTED, timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  },
];
// MOCK REVIEWS
export const MOCK_REVIEWS: Review[] = [
  { id: 'review-1', jobId: 'job-1', authorId: 'user-customer-1', plumberId: 'user-plumber-1', rating: 5, comment: 'Mario was fantastic! He arrived on time, fixed the problem quickly, and was very professional. Highly recommended!', createdAt: new Date('2023-10-25T15:00:00Z').toISOString() },
];
// MOCK TESTIMONIALS
export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 'testimonial1', name: 'Elena Ricci', location: 'Milan', rating: 5 },
  { id: 'testimonial2', name: 'Marco Bianchi', location: 'Milan', rating: 5 },
  { id: 'testimonial3', name: 'Giulia Conti', location: 'Milan', rating: 4 },
];