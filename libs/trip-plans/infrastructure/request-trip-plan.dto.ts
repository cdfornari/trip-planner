import {
  IsDateString,
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
  @IsDateString()
  start: Date;

  @IsDateString()
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
  budget: Budget;

  @ValidateNested({ each: true })
  travelers: Traveler[];

  @ValidateNested()
  date: TripDateRange;
}
