import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, PlumberProfileEntity, JobEntity, ReviewEntity, MarketRequestEntity, AnalyticsEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_TESTIMONIALS } from "@shared/mock-data";
import { Job, JobStatus, Review, JobTimelineEvent, UserRole, MarketRequest } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // This route ensures that the mock data is loaded into the Durable Object.
  app.get('/api/seed', async (c) => {
    await UserEntity.ensureSeed(c.env);
    await PlumberProfileEntity.ensureSeed(c.env);
    await JobEntity.ensureSeed(c.env);
    await ReviewEntity.ensureSeed(c.env);
    return ok(c, { message: 'Data seeded successfully' });
  });
  // Mock endpoints for public data
  app.get('/api/testimonials', (c) => ok(c, MOCK_TESTIMONIALS));
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const { items } = await UserEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/plumber-profiles', async (c) => {
    const { items } = await PlumberProfileEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/plumber-profiles/:id', async (c) => {
    const { id } = c.req.param();
    const profileEntity = new PlumberProfileEntity(c.env, id);
    if (!(await profileEntity.exists())) return notFound(c);
    const profile = await profileEntity.getState();
    return ok(c, profile);
  });
  app.patch('/api/plumber-profiles/:id', async (c) => {
    const { id } = c.req.param();
    const updates = await c.req.json();
    const profileEntity = new PlumberProfileEntity(c.env, id);
    if (!(await profileEntity.exists())) return notFound(c);
    const updatedProfile = await profileEntity.mutate(profile => ({ ...profile, ...updates }));
    return ok(c, updatedProfile);
  });
  app.post('/api/users', async (c) => {
    const { email, password, name, phone, role } = await c.req.json();
    if (!isStr(email) || !isStr(password) || !isStr(name) || !isStr(phone) || !isStr(role) || !Object.values(UserRole).includes(role as UserRole)) {
      return bad(c, 'Missing or invalid required fields');
    }
    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      email,
      passwordHash: password, // PoC: plain text, to be replaced with hashing
      name,
      phone,
      role: role as UserRole,
      createdAt: new Date().toISOString(),
    };
    await UserEntity.create(c.env, newUser);
    c.status(201);
    return ok(c, newUser);
  });
  // --- CUSTOMER PORTAL API ---
  app.get('/api/jobs', async (c) => {
    const customerId = c.req.query('customerId');
    if (!isStr(customerId)) return bad(c, 'customerId is required');
    const { items: allJobs } = await JobEntity.list(c.env);
    const customerJobs = allJobs.filter(job => job.customerId === customerId);
    return ok(c, customerJobs);
  });
  app.post('/api/jobs', async (c) => {
    const { customerId, description, address, scheduledAt } = await c.req.json();
    if (!isStr(customerId) || !isStr(description) || !isStr(address) || !isStr(scheduledAt)) {
      return bad(c, 'Missing required fields');
    }
    const newJob: Job = {
      id: `job-${crypto.randomUUID()}`,
      customerId,
      description,
      address,
      scheduledAt,
      status: JobStatus.REQUESTED,
      photos: [],
      timeline: [{ status: JobStatus.REQUESTED, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    await JobEntity.create(c.env, newJob);
    return ok(c, newJob);
  });
  app.get('/api/jobs/:id', async (c) => {
    const { id } = c.req.param();
    const job = new JobEntity(c.env, id);
    if (!(await job.exists())) return notFound(c);
    const jobState = await job.getState();
    const plumberUserPromise = jobState.plumberId ? new UserEntity(c.env, jobState.plumberId).getState().catch(() => null) : Promise.resolve(null);
    const plumberProfilePromise = jobState.plumberId ? new PlumberProfileEntity(c.env, jobState.plumberId).getState().catch(() => null) : Promise.resolve(null);
    const customerPromise = new UserEntity(c.env, jobState.customerId).getState().catch(() => null);
    const reviewsPromise = ReviewEntity.list(c.env);
    const [plumberUser, plumberProfile, customer, { items: allReviews }] = await Promise.all([plumberUserPromise, plumberProfilePromise, customerPromise, reviewsPromise]);
    const hasReview = allReviews.some(r => r.jobId === id);
    return ok(c, { ...jobState, plumber: { user: plumberUser, profile: plumberProfile }, customer, hasReview });
  });
  app.post('/api/reviews', async (c) => {
    const { jobId, authorId, plumberId, rating, comment } = await c.req.json();
    if (!isStr(jobId) || !isStr(authorId) || !isStr(plumberId) || typeof rating !== 'number' || !isStr(comment)) {
      return bad(c, 'Missing required fields');
    }
    const newReview: Review = {
      id: `review-${crypto.randomUUID()}`,
      jobId,
      authorId,
      plumberId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    await ReviewEntity.create(c.env, newReview);
    return ok(c, newReview);
  });
  // --- PLUMBER PORTAL API ---
  app.get('/api/plumber/jobs/available', async (c) => {
    const { items: allJobs } = await JobEntity.list(c.env);
    const availableJobs = allJobs.filter(job => job.status === JobStatus.REQUESTED);
    return ok(c, availableJobs);
  });
  app.get('/api/plumber/jobs/assigned', async (c) => {
    const plumberId = c.req.query('plumberId');
    if (!isStr(plumberId)) return bad(c, 'plumberId is required');
    const { items: allJobs } = await JobEntity.list(c.env);
    const assignedJobs = allJobs.filter(job => job.plumberId === plumberId);
    return ok(c, assignedJobs);
  });
  app.patch('/api/jobs/:id/accept', async (c) => {
    const { id } = c.req.param();
    const { plumberId } = await c.req.json();
    if (!isStr(plumberId)) return bad(c, 'plumberId is required');
    const jobEntity = new JobEntity(c.env, id);
    if (!(await jobEntity.exists())) return notFound(c);
    const updatedJob = await jobEntity.mutate(job => {
      if (job.status !== JobStatus.REQUESTED) {
        throw new Error('Job has already been accepted.');
      }
      const newEvent: JobTimelineEvent = { status: JobStatus.ACCEPTED, timestamp: new Date().toISOString() };
      return { ...job, status: JobStatus.ACCEPTED, plumberId, timeline: [...job.timeline, newEvent] };
    });
    return ok(c, updatedJob);
  });
  app.patch('/api/jobs/:id/status', async (c) => {
    const { id } = c.req.param();
    const { status } = await c.req.json<{ status: JobStatus }>();
    if (!Object.values(JobStatus).includes(status)) return bad(c, 'Invalid status');
    const jobEntity = new JobEntity(c.env, id);
    if (!(await jobEntity.exists())) return notFound(c);
    const updatedJob = await jobEntity.mutate(job => {
      const newEvent: JobTimelineEvent = { status, timestamp: new Date().toISOString() };
      return { ...job, status, timeline: [...job.timeline, newEvent] };
    });
    return ok(c, updatedJob);
  });
  // --- ADMIN PORTAL API ---
  app.get('/api/admin/dashboard-stats', async (c) => {
    const [{ items: users }, { items: jobs }] = await Promise.all([
      UserEntity.list(c.env),
      JobEntity.list(c.env),
    ]);
    const stats = {
      totalCustomers: users.filter(u => u.role === UserRole.CUSTOMER).length,
      totalPlumbers: users.filter(u => u.role === UserRole.PLUMBER).length,
      activeJobs: jobs.filter(j => j.status !== JobStatus.COMPLETED && j.status !== JobStatus.CANCELLED).length,
      completedJobs: jobs.filter(j => j.status === JobStatus.COMPLETED).length,
    };
    return ok(c, stats);
  });
  app.get('/api/admin/users', async (c) => {
    const { items } = await UserEntity.list(c.env);
    return ok(c, items.filter(u => u.role === UserRole.CUSTOMER));
  });
  app.get('/api/admin/plumbers', async (c) => {
    const [{ items: users }, { items: profiles }] = await Promise.all([
      UserEntity.list(c.env),
      PlumberProfileEntity.list(c.env),
    ]);
    const plumbers = users
      .filter(u => u.role === UserRole.PLUMBER)
      .map(user => ({
        ...user,
        profile: profiles.find(p => p.userId === user.id)
      }));
    return ok(c, plumbers);
  });
  app.get('/api/admin/jobs', async (c) => {
    const { items } = await JobEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/admin/reviews', async (c) => {
    const { items } = await ReviewEntity.list(c.env);
    return ok(c, items);
  });
  app.patch('/api/admin/plumbers/:id/approve', async (c) => {
    const { id } = c.req.param();
    const { isAvailable } = await c.req.json<{ isAvailable: boolean }>();
    const profileEntity = new PlumberProfileEntity(c.env, id);
    if (!(await profileEntity.exists())) return notFound(c);
    const updatedProfile = await profileEntity.mutate(profile => ({ ...profile, isAvailable }));
    return ok(c, updatedProfile);
  });
  app.patch('/api/admin/jobs/:id/cancel', async (c) => {
    const { id } = c.req.param();
    const jobEntity = new JobEntity(c.env, id);
    if (!(await jobEntity.exists())) return notFound(c);
    const updatedJob = await jobEntity.mutate(job => {
      const newEvent: JobTimelineEvent = { status: JobStatus.CANCELLED, timestamp: new Date().toISOString(), notes: "Cancelled by Admin" };
      return { ...job, status: JobStatus.CANCELLED, timeline: [...job.timeline, newEvent] };
    });
    return ok(c, updatedJob);
  });
  app.delete('/api/admin/reviews/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ReviewEntity.delete(c.env, id);
    if (!deleted) return notFound(c);
    return ok(c, { id });
  });
  // --- MARKET VALIDATION API ---
  app.post('/api/market-request', async (c) => {
    const { name, contact, address, description } = await c.req.json();
    if (!isStr(name) || !isStr(contact) || !isStr(address) || !isStr(description)) {
      return bad(c, 'Missing required fields');
    }
    const newRequest: MarketRequest = {
      id: `mr-${crypto.randomUUID()}`,
      name,
      contact,
      address,
      description,
      createdAt: new Date().toISOString(),
    };
    await MarketRequestEntity.create(c.env, newRequest);
    return ok(c, newRequest);
  });
  app.post('/api/page-view', async (c) => {
    const analytics = new AnalyticsEntity(c.env);
    const newCount = await analytics.incrementPageViews();
    return ok(c, { pageViews: newCount });
  });
  // Placeholder for admin to view validation data
  app.get('/api/admin/market-requests', async (c) => {
    const { items } = await MarketRequestEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/admin/analytics', async (c) => {
    const analytics = new AnalyticsEntity(c.env);
    const data = await analytics.getState();
    return ok(c, data);
  });
}