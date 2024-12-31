import { Entity } from 'libs/core/domain/entity';
import { VehicleRentalId } from '../value-objects/vehicle-rental-id';
import { VehicleModel } from '../value-objects/vehicle-model';
import { VehicleBrand } from '../value-objects/vehicle-brand';
import { VehicleCapacity } from '../value-objects/vehicle-capacity';
import { VehicleYear } from '../value-objects/vehicle-year';
import { VehiclePlate } from '../value-objects/vehicle-plate';
import { PriceDetail } from '../value-objects/price-detail';

export class VehicleRental extends Entity<VehicleRentalId> {
  private constructor(
    protected readonly _id: VehicleRentalId,
    protected _vehiclePlate: VehiclePlate,
    protected _vehicleModel: VehicleModel,
    protected _vehicleBrand: VehicleBrand,
    protected _vehicleCapacity: VehicleCapacity,
    protected _vehicleYear: VehicleYear,
    protected _price: PriceDetail,
  ) {
    super(_id);
  }

  get id(): VehicleRentalId {
    return this._id;
  }

  get vehiclePlate(): VehiclePlate {
    return this._vehiclePlate;
  }

  get vehicleModel(): VehicleModel {
    return this._vehicleModel;
  }

  get vehicleBrand(): VehicleBrand {
    return this._vehicleBrand;
  }

  get vehicleCapacity(): VehicleCapacity {
    return this._vehicleCapacity;
  }

  get vehicleYear(): VehicleYear {
    return this._vehicleYear;
  }

  get price(): PriceDetail {
    return this._price;
  }

  static create(
    id: VehicleRentalId,
    vehiclePlate: VehiclePlate,
    vehicleModel: VehicleModel,
    vehicleBrand: VehicleBrand,
    vehicleCapacity: VehicleCapacity,
    vehicleYear: VehicleYear,
    price: PriceDetail,
  ): VehicleRental {
    return new VehicleRental(
      id,
      vehiclePlate,
      vehicleModel,
      vehicleBrand,
      vehicleCapacity,
      vehicleYear,
      price,
    );
  }
}
