import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { DateScalar } from 'libs/core/infrastructure/gql/date.scalar';

@ObjectType()
class TripDate {
  @Field(() => DateScalar)
  start: Date;

  @Field(() => DateScalar)
  end: Date;
}

@ObjectType()
class TripBudget {
  @Field(() => Float)
  limit: number;

  @Field(() => String)
  currency: string;
}

@ObjectType()
class PriceDetail {
  @Field(() => Float)
  amount: number;

  @Field(() => String)
  currency: string;
}

@ObjectType()
class PlaneTicket {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  passengerId: string;

  @Field(() => String)
  seat: string;

  @Field(() => PriceDetail)
  price: PriceDetail;
}

@ObjectType()
class Traveler {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
class HotelBooking {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  bookedRoom: string;

  @Field(() => String)
  hotelAddress: string;

  @Field(() => String)
  hotelName: string;

  @Field(() => Int)
  hotelStars: number;

  @Field(() => PriceDetail)
  price: PriceDetail;
}

@ObjectType()
class VehicleRental {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  vehiclePlate: string;

  @Field(() => String)
  vehicleModel: string;

  @Field(() => String)
  vehicleBrand: string;

  @Field(() => Int)
  vehicleCapacity: number;

  @Field(() => Int)
  vehicleYear: number;

  @Field(() => PriceDetail)
  price: PriceDetail;
}

@ObjectType()
class Duration {
  @Field(() => Int)
  hours: number;

  @Field(() => Int)
  minutes: number;
}

@ObjectType()
class Activity {
  @Field(() => ID)
  id: string;

  @Field(() => DateScalar)
  date: Date;

  @Field(() => String)
  description: string;

  @Field(() => Duration)
  duration: Duration;

  @Field(() => PriceDetail)
  price: PriceDetail;
}

@ObjectType()
export class TripPlan {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  originCity: string;

  @Field(() => String)
  destinationCity: string;

  @Field(() => String)
  status: string;

  @Field(() => ID)
  requestedBy: string;

  @Field(() => TripDate)
  date: TripDate;

  @Field(() => TripBudget)
  budget: TripBudget;

  @Field(() => [PlaneTicket])
  planeTickets: PlaneTicket[];

  @Field(() => [Traveler])
  travelers: Traveler[];

  @Field(() => HotelBooking, { nullable: true })
  hotelBooking?: HotelBooking;

  @Field(() => VehicleRental, { nullable: true })
  vehicleRental?: VehicleRental;

  @Field(() => [Activity])
  activities: Activity[];
}
