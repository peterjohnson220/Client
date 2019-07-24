import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as fromCommunityIndustryActions from '../actions/community-industry.actions';

import { CommunityFilterApiService } from 'libs/data/payfactors-api/community/community-filter-api.service';

@Injectable()
export class CommunityIndustryEffects {

  @Effect()
  gettingCommunityIndustries$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityIndustryActions.LOADING_COMMUNITY_INDUSTRIES),
      switchMap((action: fromCommunityIndustryActions.LoadingCommunityIndustries) =>
        this.communityFilterService.getIndustries().pipe(
          map((response: string[]) => {
            return new fromCommunityIndustryActions.LoadingCommunityIndustriesSuccess(response);
          }),
          catchError(error => of(new fromCommunityIndustryActions.LoadingCommunityIndustriesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityFilterService: CommunityFilterApiService,
  ) {}
}
