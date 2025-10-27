import { IndexedEntity, Entity, Env } from "./core-utils";
import type { User, PlumberProfile, Job, Review, MarketRequest, AnalyticsData } from "@shared/types";
import { MOCK_USERS, MOCK_PLUMBER_PROFILES, MOCK_JOBS, MOCK_REVIEWS } from "@shared/mock-data";

export class UserEntity extends IndexedEntity<User> {static readonly entityName = "user";static readonly indexName = "users";static readonly initialState: User = {} as User;static seedData = MOCK_USERS;
}

export class PlumberProfileEntity extends IndexedEntity<PlumberProfile> {
  static readonly entityName = "plumberProfile";
  static readonly indexName = "plumberProfiles";
  static readonly initialState: PlumberProfile = {} as PlumberProfile;
  static seedData = MOCK_PLUMBER_PROFILES;
}

export class JobEntity extends IndexedEntity<Job> {
  static readonly entityName = "job";
  static readonly indexName = "jobs";
  static readonly initialState: Job = {} as Job;
  static seedData = MOCK_JOBS;
}

export class ReviewEntity extends IndexedEntity<Review> {
  static readonly entityName = "review";
  static readonly indexName = "reviews";
  static readonly initialState: Review = {} as Review;
  static seedData = MOCK_REVIEWS;
}

export class MarketRequestEntity extends IndexedEntity<MarketRequest> {
  static readonly entityName = "marketRequest";
  static readonly indexName = "marketRequests";
  static readonly initialState: MarketRequest = {} as MarketRequest;
}

export class AnalyticsEntity extends Entity<AnalyticsData> {
  static readonly entityName = "analytics";
  static readonly initialState: AnalyticsData = { id: 'singleton', pageViews: 0 };
  constructor(env: Env) {
    super(env, 'singleton');
  }
  async incrementPageViews(): Promise<number> {
    const state = await this.mutate((s) => ({ ...s, pageViews: (s.pageViews || 0) + 1 }));
    return state.pageViews;
  }
}