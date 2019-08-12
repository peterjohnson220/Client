import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as fromCommunityCompanySizeActions from '../actions/community-company-size.actions';

import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';
import { CommunityFilterApiService } from 'libs/data/payfactors-api/community/community-filter-api.service';

@Injectable()
export class CommunityCompanySizeEffects {

  @Effect()
  gettingCommunityCompanySizes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityCompanySizeActions.LOADING_COMMUNITY_COMPANY_SIZES),
      switchMap((action: fromCommunityCompanySizeActions.LoadingCommunityCompanySizes) =>
        this.communityFilterService.getCompanySizes().pipe(
          map((response: CommunityCompanySize[]) => {
            return new fromCommunityCompanySizeActions.LoadingCommunityCompanySizesSuccess(response);
          }),
          catchError(error => of(new fromCommunityCompanySizeActions.LoadingCommunityCompanySizesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityFilterService: CommunityFilterApiService,
  ) {}
}
