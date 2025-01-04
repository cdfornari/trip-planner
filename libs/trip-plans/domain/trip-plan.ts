import { AggregateRoot } from 'libs/core/domain/aggregate-root';
import { TripPlanId } from './value-objects/trip-plan-id';
import { InvalidTripPlanException } from './exceptions/invalid-trip-plan.exception';
import { OriginCity } from './value-objects/origin-city';
import { DestinationCity } from './value-objects/destination-city';
import { TripBudget } from './value-objects/trip-budget';
import { TripPlanStatus } from './value-objects/trip-plan-status';
import { TripDateRange } from './value-objects/trip-date-range';
import { ActivityBooking } from './entities/activity-booking';
import { HotelBooking } from './entities/hotel-booking';
import { Traveler } from './entities/traveler';
import { VehicleRental } from './entities/vehicle-rental';
import { PlaneTicket } from './entities/plane-ticket';
import { TripPlanRequested } from './events/trip-plan-requested.event';
import { DomainEvent } from 'libs/core/domain/events';
import { TravelerId } from './value-objects/traveler-id';
import { TravelerName } from './value-objects/traveler-name';
import { FlightsBooked } from './events/flights-booked.event';
import { PlaneTicketId } from './value-objects/plane-ticket-id';
import { PlaneTicketSeat } from './value-objects/plane-ticket-seat';
import { PriceDetail } from './value-objects/price-detail';
import { FlightsBookingFailed } from './events/flights-booking-failed.event';
import { VehicleRentalFailed } from './events/vehicle-rental-failed.event';
import { HotelBookingFailed } from './events/hotel-booking-failed.event';
import { TripPlanFailed } from './events/trip-plan-failed.event';
import { TripPlanCompleted } from './events/trip-plan-completed.event';
import { HotelBooked } from './events/hotel-booked.event';
import { HotelBookingId } from './value-objects/hotel-booking-id';
import { HotelName } from './value-objects/hotel-name';
import { HotelStars } from './value-objects/hotel-stars';
import { HotelAddress } from './value-objects/hotel-address';
import { HotelBookingRoom } from './value-objects/hotel-booking-room';
import { VehicleRentalBooked } from './events/vehicle-rental-booked.event';
import { VehicleRentalId } from './value-objects/vehicle-rental-id';
import { VehiclePlate } from './value-objects/vehicle-plate';
import { VehicleModel } from './value-objects/vehicle-model';
import { VehicleBrand } from './value-objects/vehicle-brand';
import { VehicleCapacity } from './value-objects/vehicle-capacity';
import { VehicleYear } from './value-objects/vehicle-year';
import { ActivityBooked } from './events/activity-booked.event';
import { ActivityBookingId } from './value-objects/activity-booking-id';
import { ActivityDescription } from './value-objects/activity-description';
import { ActivityBookingDate } from './value-objects/activity-booking-date';
import { ActivityDuration } from './value-objects/activity-duration';
import { ActivitiesBookingFailed } from './events/activities-booking-failed.event';
import { UserId } from 'libs/users/domain/value-objects/user-id';
import { VehicleRentalSkipped } from './events/vehicle-rental-skipped.event';
import { ActivitiesBookingSkipped } from './events/activities-booking-skipped.event';
import { ActivitiesBookingFinished } from './events/activities-booking-finished.event';

export class TripPlan extends AggregateRoot<TripPlanId> {
  private constructor(protected readonly _id: TripPlanId) {
    super(_id);
  }

  protected _requestedBy: UserId;
  protected _originCity: OriginCity;
  protected _destinationCity: DestinationCity;
  protected _budget: TripBudget;
  protected _status: TripPlanStatus;
  protected _date: TripDateRange;
  protected _travelers: Traveler[];
  protected _planeTickets: PlaneTicket[];
  protected _hotelBooking?: HotelBooking;
  protected _vehicleRental?: VehicleRental;
  protected _activities: ActivityBooking[];

  get id(): TripPlanId {
    return this._id;
  }

  get uid(): string {
    return this._id.value;
  }

  get requestedBy(): UserId {
    return this._requestedBy;
  }

  get originCity(): OriginCity {
    return this._originCity;
  }

  get destinationCity(): DestinationCity {
    return this._destinationCity;
  }

  get budget(): TripBudget {
    return this._budget;
  }

  get status(): TripPlanStatus {
    return this._status;
  }

  get date(): TripDateRange {
    return this._date;
  }

  get travelers(): Traveler[] {
    return this._travelers;
  }

  get planeTickets(): PlaneTicket[] {
    return this._planeTickets;
  }

  get activities(): ActivityBooking[] {
    return this._activities;
  }

  get hotelBooking(): HotelBooking | undefined {
    return this._hotelBooking;
  }

  get vehicleRental(): VehicleRental | undefined {
    return this._vehicleRental;
  }

  get totalCost(): number {
    return (
      this._planeTickets.reduce((acc, ticket) => acc + ticket.price.value, 0) +
      this._activities.reduce(
        (acc, activity) => acc + activity.price.value,
        0,
      ) +
      (this._hotelBooking ? this._hotelBooking.price.value : 0) +
      (this._vehicleRental ? this._vehicleRental.price.value : 0)
    );
  }

  get availableBudget(): number {
    return this._budget.limit - this.totalCost;
  }

  get durationDays(): number {
    const diffTime = Math.abs(
      this._date.end.getTime() - this._date.start.getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  protected validateState(): void {
    if (
      !this._id ||
      !this._originCity ||
      !this._destinationCity ||
      !this._budget ||
      !this._status ||
      !this._date ||
      !this._travelers ||
      this.travelers.length === 0
    ) {
      throw new InvalidTripPlanException();
    }
    if (this.availableBudget < 0) {
      throw new InvalidTripPlanException();
    }
    if (this.status.isPlanRequested) {
      if (
        this._planeTickets.length > 0 ||
        this._activities.length > 0 ||
        this._hotelBooking ||
        this._vehicleRental
      ) {
        throw new InvalidTripPlanException();
      }
    }
    if (this.status.isPlanning) {
      if (
        this._planeTickets.length === 0 ||
        this._planeTickets.length !== this._travelers.length
      ) {
        throw new InvalidTripPlanException();
      }
    }
    if (this.status.isPlanCompleted) {
      if (
        this._planeTickets.length === 0 ||
        !this._hotelBooking ||
        //!this._vehicleRental
        this._vehicleRental.vehicleCapacity.value < this._travelers.length
      ) {
        throw new InvalidTripPlanException();
      }
    }
    if (this.status.isPlanFailed) {
      if (
        this._planeTickets.length > 0 ||
        this._activities.length > 0 ||
        this._hotelBooking ||
        this._vehicleRental
      ) {
        throw new InvalidTripPlanException();
      }
    }
    this.activities.forEach((activity) => {
      if (!this.date.contains(activity.date.value)) {
        throw new InvalidTripPlanException();
      }
    });
  }

  bookFlights(tickets: PlaneTicket[]): void {
    this.apply(FlightsBooked.createEvent(this, tickets));
  }

  failBookingFlights(): void {
    this.apply(FlightsBookingFailed.createEvent(this));
  }

  bookHotel(booking: HotelBooking): void {
    this.apply(HotelBooked.createEvent(this, booking));
  }

  failBookingHotel(): void {
    this.apply(HotelBookingFailed.createEvent(this));
  }

  bookVehicleRental(rental: VehicleRental): void {
    this.apply(VehicleRentalBooked.createEvent(this, rental));
  }

  skipVehicleRental(): void {
    this.apply(VehicleRentalSkipped.createEvent(this));
  }

  failBookingVehicleRental(): void {
    this.apply(VehicleRentalFailed.createEvent(this));
  }

  bookActivity(activity: ActivityBooking): void {
    this.apply(ActivityBooked.createEvent(this, activity));
  }

  finishBookingActivities(): void {
    this.apply(ActivitiesBookingFinished.createEvent(this));
  }

  skipBookingActivities(): void {
    this.apply(ActivitiesBookingSkipped.createEvent(this));
  }

  failBookingActivities(): void {
    this.apply(ActivitiesBookingFailed.createEvent(this));
  }

  complete(): void {
    if (!this.status.isPlanning) throw new InvalidTripPlanException();
    this.apply(TripPlanCompleted.createEvent(this));
  }

  fail(): void {
    if (!this.status.isPlanning) throw new InvalidTripPlanException();
    this.apply(TripPlanFailed.createEvent(this));
  }

  static request(
    id: TripPlanId,
    data: {
      requestedBy: UserId;
      originCity: OriginCity;
      destinationCity: DestinationCity;
      tripBudget: TripBudget;
      date: TripDateRange;
      travelers: Traveler[];
    },
  ): TripPlan {
    const tripPlan = new TripPlan(id);
    tripPlan.apply(TripPlanRequested.createEvent(tripPlan, data));
    return tripPlan;
  }

  static loadFromHistory(id: TripPlanId, events: DomainEvent[]): TripPlan {
    const tripPlan = new TripPlan(id);
    tripPlan.hydrate(events);
    return tripPlan;
  }

  [`on${TripPlanRequested.name}`](context: TripPlanRequested): void {
    this._requestedBy = new UserId(context.requestedBy);
    this._originCity = new OriginCity(context.originCity);
    this._destinationCity = new DestinationCity(context.destinationCity);
    this._budget = new TripBudget(
      context.budget.limit,
      context.budget.currency,
    );
    this._status = TripPlanStatus.PlanRequested();
    this._date = new TripDateRange(context.date.start, context.date.end);
    this._travelers = context.travelers.map((traveler) =>
      Traveler.create(
        new TravelerId(traveler.id),
        new TravelerName(traveler.name),
      ),
    );
    this._planeTickets = [];
    this._activities = [];
  }

  [`on${FlightsBooked.name}`](context: FlightsBooked): void {
    this._planeTickets = context.tickets.map((ticket) => {
      const [row, seat] = ticket.seat.split('-');
      return PlaneTicket.create(
        new PlaneTicketId(ticket.id),
        new PlaneTicketSeat(Number(row), seat),
        new TravelerId(ticket.passengerId),
        new PriceDetail(ticket.price.amount, ticket.price.currency),
      );
    });
    this._status = TripPlanStatus.Planning();
  }

  [`on${FlightsBookingFailed.name}`](context: FlightsBookingFailed): void {
    this._planeTickets = [];
    this.apply(TripPlanFailed.createEvent(this));
  }

  [`on${HotelBooked.name}`](context: HotelBooked): void {
    const [floor, room] = context.bookedRoom.split('-');
    this._hotelBooking = HotelBooking.create(
      new HotelBookingId(context.id),
      new HotelName(context.hotelName),
      new HotelStars(context.hotelStars),
      new HotelAddress(context.hotelAddress),
      new HotelBookingRoom(Number(floor), Number(room)),
      new PriceDetail(context.price.amount, context.price.currency),
    );
  }

  [`on${HotelBookingFailed.name}`](context: FlightsBookingFailed): void {
    this._hotelBooking = null;
  }

  [`on${VehicleRentalBooked.name}`](context: VehicleRentalBooked): void {
    this._vehicleRental = VehicleRental.create(
      new VehicleRentalId(context.id),
      new VehiclePlate(context.vehiclePlate),
      new VehicleModel(context.vehicleModel),
      new VehicleBrand(context.vehicleBrand),
      new VehicleCapacity(context.vehicleCapacity),
      new VehicleYear(context.vehicleYear),
      new PriceDetail(context.price.amount, context.price.currency),
    );
  }

  [`on${VehicleRentalSkipped.name}`](context: VehicleRentalSkipped): void {
    this._vehicleRental = null;
  }

  [`on${VehicleRentalFailed.name}`](context: VehicleRentalFailed): void {
    this._vehicleRental = null;
  }

  [`on${ActivityBooked.name}`](context: ActivityBooked): void {
    this._activities.push(
      ActivityBooking.create(
        new ActivityBookingId(context.id),
        new ActivityDescription(context.description),
        new ActivityBookingDate(new Date(context.date)),
        new ActivityDuration(context.duration.hours, context.duration.minutes),
        new PriceDetail(context.price.amount, context.price.currency),
      ),
    );
  }

  [`on${ActivitiesBookingFinished.name}`](
    context: ActivitiesBookingSkipped,
  ): void {}

  [`on${ActivitiesBookingSkipped.name}`](
    context: ActivitiesBookingSkipped,
  ): void {
    this._activities = [];
  }

  [`on${ActivitiesBookingFailed.name}`](
    context: ActivitiesBookingFailed,
  ): void {
    this._activities = [];
  }

  [`on${TripPlanCompleted.name}`](context: TripPlanCompleted): void {
    this._status = TripPlanStatus.PlanCompleted();
  }

  [`on${TripPlanFailed.name}`](context: TripPlanFailed): void {
    this._planeTickets = [];
    this._activities = [];
    this._hotelBooking = null;
    this._vehicleRental = null;
    this._status = TripPlanStatus.PlanFailed();
  }
}
