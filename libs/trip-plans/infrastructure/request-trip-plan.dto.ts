import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class Budget {
  @IsIn(['$'])
  currency: string = '$';

  @IsNumber()
  @Min(1)
  amount: number;
}

class Traveler {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class TripDateRange {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  start: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  end: Date;
}

export class RequestTripPlanDto {
  @IsString()
  @IsNotEmpty()
  originCity: string;

  @IsString()
  @IsNotEmpty()
  destinationCity: string;

  @ValidateNested()
  @Type(() => Budget)
  budget: Budget;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => Traveler)
  travelers: Traveler[];

  @ValidateNested()
  @Type(() => TripDateRange)
  date: TripDateRange;
}
