import { Args, Query, Resolver } from '@nestjs/graphql';
import Surreal from 'surrealdb';
import { InjectSurreal } from 'libs/core/infrastructure/surrealdb/inject-surreal.decorator';
import { TripPlan } from 'libs/trip-plans/infrastructure/trip-plan.gql';

@Resolver(() => TripPlan)
export class QueryApiResolver {
  constructor(
    @InjectSurreal()
    private readonly surreal: Surreal,
  ) {}

  @Query(() => [TripPlan], { name: 'tripPlans' })
  async tripPlans(@Args('userId') userId: string): Promise<TripPlan[]> {
    const tripPlans = await this.surreal.query<TripPlan[][]>(
      'SELECT * FROM trip WHERE requestedBy = $userId',
      { userId },
    );
    return tripPlans[0];
  }
}
