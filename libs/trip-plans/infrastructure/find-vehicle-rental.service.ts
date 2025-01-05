import { IdGenerator } from 'libs/core/application/id-generator';
import { TripPlan } from '../domain/trip-plan';
import { PriceDetail } from '../domain/value-objects/price-detail';
import { probability, selectRandom } from 'libs/core/utils/random';
import { VehicleRental } from '../domain/entities/vehicle-rental';
import { FindVehicleRentalService } from '../domain/services/find-vehicle-rental.service';
import { VehicleRentalId } from '../domain/value-objects/vehicle-rental-id';
import { VehicleModel } from '../domain/value-objects/vehicle-model';
import { VehicleBrand } from '../domain/value-objects/vehicle-brand';
import { VehiclePlate } from '../domain/value-objects/vehicle-plate';
import { VehicleCapacity } from '../domain/value-objects/vehicle-capacity';
import { VehicleYear } from '../domain/value-objects/vehicle-year';

type Vehicle = {
  model: string;
  brand: string;
  plate: string;
  capacity: number;
  year: number;
  pricePerDay: number;
};

const vehicles: Vehicle[] = [
  {
    model: 'Civic',
    brand: 'Honda',
    plate: '1234ABC',
    capacity: 5,
    year: 2020,
    pricePerDay: 20,
  },
  {
    model: 'Accord',
    brand: 'Honda',
    plate: '5678DEF',
    capacity: 5,
    year: 2021,
    pricePerDay: 18,
  },
  {
    model: 'Corolla',
    brand: 'Toyota',
    plate: '9012GHI',
    capacity: 5,
    year: 2020,
    pricePerDay: 23,
  },
  {
    model: 'Camaro',
    brand: 'Chevrolet',
    plate: '3456JKL',
    capacity: 4,
    year: 2021,
    pricePerDay: 37,
  },
  {
    model: 'Impreza',
    brand: 'Subaru',
    plate: '7890MNO',
    capacity: 5,
    year: 2021,
    pricePerDay: 35,
  },
  {
    brand: 'Tesla',
    model: 'Model S',
    plate: '1234PQR',
    capacity: 5,
    year: 2020,
    pricePerDay: 40,
  },
  {
    brand: 'Suzuki',
    model: 'Motorcycle',
    plate: '5678STU',
    capacity: 2,
    year: 2021,
    pricePerDay: 10,
  },
  {
    brand: 'Harley Davidson',
    model: 'Motorcycle',
    plate: '9012VWX',
    capacity: 2,
    year: 2021,
    pricePerDay: 18,
  },
  {
    brand: 'Ford',
    model: 'Van',
    plate: '3456YZA',
    capacity: 8,
    year: 2020,
    pricePerDay: 50,
  },
];

export const FindVehicleRentalServiceSimulation =
  (idGenerator: IdGenerator<string>): FindVehicleRentalService =>
  async (tripPlan: TripPlan) => {
    if (probability(10)) throw new Error('VEHICLE_NOT_FOUND');
    if (tripPlan.availableBudget < 10) throw new Error('INSUFFICIENT_BUDGET');
    const affordableVehicles: Vehicle[] = vehicles.filter(
      (vehicle) =>
        vehicle.pricePerDay * tripPlan.durationDays <=
          tripPlan.availableBudget &&
        vehicle.capacity >= tripPlan.travelers.length,
    );
    if (affordableVehicles.length === 0) throw new Error('VEHICLE_NOT_FOUND');
    const vehicle = selectRandom(affordableVehicles);
    return VehicleRental.create(
      new VehicleRentalId(idGenerator.generateId()),
      new VehiclePlate(vehicle.plate),
      new VehicleModel(vehicle.model),
      new VehicleBrand(vehicle.brand),
      new VehicleCapacity(vehicle.capacity),
      new VehicleYear(vehicle.year),
      new PriceDetail(vehicle.pricePerDay * tripPlan.durationDays, 'USD'),
    );
  };
