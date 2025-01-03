import { DomainService } from 'libs/core/domain/services';
import { TripPlan } from '../trip-plan';
import { ActivityBooking } from '../entities/activity-booking';

export type FindActivitiesService = DomainService<
  TripPlan,
  Promise<ActivityBooking[]>
>;
