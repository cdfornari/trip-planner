import { DomainService } from 'libs/core/domain/services';
import { TripPlan } from '../trip-plan';
import { PlaneTicket } from '../entities/plane-ticket';

export type FindPlaneTicketsService = DomainService<
  TripPlan,
  Promise<PlaneTicket[]>
>;
