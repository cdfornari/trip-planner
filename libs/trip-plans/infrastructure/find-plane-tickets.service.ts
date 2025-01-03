import { IdGenerator } from 'libs/core/application/id-generator';
import { PlaneTicket } from '../domain/entities/plane-ticket';
import { FindPlaneTicketsService } from '../domain/services/find-plane-tickets.service';
import { TripPlan } from '../domain/trip-plan';
import { PlaneTicketId } from '../domain/value-objects/plane-ticket-id';
import { PlaneTicketSeat } from '../domain/value-objects/plane-ticket-seat';
import { TravelerId } from '../domain/value-objects/traveler-id';
import { PriceDetail } from '../domain/value-objects/price-detail';
import { generateRandomNumber, probability, selectRandom } from 'libs/core/utils/random';

export const FindPlaneTicketsServiceSimulation =
  (idGenerator: IdGenerator<string>): FindPlaneTicketsService =>
  async (tripPlan: TripPlan) => {
    const passengers = tripPlan.travelers.map((traveler) => traveler.id.value);
    if(probability(10)) throw new Error('TICKETS_NOT_FOUND');
    if (tripPlan.availableBudget < 250) throw new Error('INSUFFICIENT_BUDGET');
    const ticketsPrice = generateRandomNumber(
      250,
      Math.max(tripPlan.availableBudget * 0.5, 250),
    );
    const planeTickets = passengers.map((passenger) =>
      PlaneTicket.create(
        new PlaneTicketId(idGenerator.generateId()),
        new PlaneTicketSeat(
          generateRandomNumber(1, 29),
          selectRandom(['A', 'B', 'C', 'D', 'E', 'F']),
        ),
        new TravelerId(passenger),
        new PriceDetail(ticketsPrice, '$'),
      ),
    );
    return planeTickets;
  };
