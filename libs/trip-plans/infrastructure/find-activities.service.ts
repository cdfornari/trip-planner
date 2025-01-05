import { IdGenerator } from 'libs/core/application/id-generator';
import { TripPlan } from '../domain/trip-plan';
import { PriceDetail } from '../domain/value-objects/price-detail';
import { generateRandomDate, selectRandom } from 'libs/core/utils/random';
import { FindActivitiesService } from '../domain/services/find-activities.service';
import { ActivityBooking } from '../domain/entities/activity-booking';
import { ActivityBookingId } from '../domain/value-objects/activity-booking-id';
import { ActivityDescription } from '../domain/value-objects/activity-description';
import { ActivityBookingDate } from '../domain/value-objects/activity-booking-date';
import { ActivityDuration } from '../domain/value-objects/activity-duration';

type Activity = {
  id: number;
  description: string;
  duration: {
    minutes: number;
    hours: number;
  };
  pricePerDay: number;
};

const activities: Activity[] = [
  {
    id: 1,
    description: 'Visit Soccer Stadium',
    duration: { minutes: 0, hours: 2 },
    pricePerDay: 15,
  },
  {
    id: 2,
    description: 'Visit Museum',
    duration: { minutes: 0, hours: 3 },
    pricePerDay: 20,
  },
  {
    id: 3,
    description: 'Visit Zoo',
    duration: { minutes: 0, hours: 4 },
    pricePerDay: 25,
  },
  {
    id: 4,
    description: 'Visit Aquarium',
    duration: { minutes: 0, hours: 2 },
    pricePerDay: 15,
  },
  {
    id: 5,
    description: 'Visit Park',
    duration: { minutes: 0, hours: 1 },
    pricePerDay: 10,
  },
  {
    id: 6,
    description: 'Visit Beach',
    duration: { minutes: 0, hours: 3 },
    pricePerDay: 20,
  },
  {
    id: 7,
    description: 'Visit Mountain',
    duration: { minutes: 0, hours: 4 },
    pricePerDay: 25,
  },
  {
    id: 8,
    description: 'Visit River',
    duration: { minutes: 0, hours: 2 },
    pricePerDay: 15,
  },
  {
    id: 9,
    description: 'Visit Lake',
    duration: { minutes: 0, hours: 1 },
    pricePerDay: 10,
  },
  {
    id: 10,
    description: 'Camping in Forest',
    duration: { minutes: 0, hours: 3 },
    pricePerDay: 20,
  },
];

export const FindActivitiesServiceSimulation =
  (idGenerator: IdGenerator<string>): FindActivitiesService =>
  async (tripPlan: TripPlan) => {
    if (tripPlan.availableBudget < 10) throw new Error('INSUFFICIENT_BUDGET');
    let acc = 0;
    const selectedActivities: Activity[] = [];
    for (const activity of activities) {
      const selectedActivity = selectRandom(activities);
      if (
        selectedActivities.some(
          (activity) => activity.id == selectedActivity.id,
        )
      )
        continue;
      if (
        selectedActivity.pricePerDay *
          tripPlan.durationDays *
          tripPlan.travelers.length +
          acc >
        tripPlan.availableBudget
      )
        continue;
      selectedActivities.push(selectedActivity);
    }
    return selectedActivities.map((activity) =>
      ActivityBooking.create(
        new ActivityBookingId(idGenerator.generateId()),
        new ActivityDescription(activity.description),
        new ActivityBookingDate(
          generateRandomDate(tripPlan.date.start, tripPlan.date.end),
        ),
        new ActivityDuration(
          activity.duration.hours,
          activity.duration.minutes,
        ),
        new PriceDetail(
          activity.pricePerDay *
            tripPlan.durationDays *
            tripPlan.travelers.length,
          'USD',
        ),
      ),
    );
  };
