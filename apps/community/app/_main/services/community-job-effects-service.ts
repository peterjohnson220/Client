import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom, map, concatMap } from 'rxjs/operators';

import { CommunityJobApiService } from 'libs/data/payfactors-api/community/community-job-api.service';
import { CommunityJobSearchResponse } from 'libs/models/community/community-job-search-response.model';

import { PagingOptions } from '../models';

import * as fromCommunityJobReducer from '../reducers';
import * as fromCommunityJobActions from '../actions/community-job.actions';
import { mapResultsPagingOptionsToPagingOptions } from '../helpers/model-mapping.helper';
import { CommunityJobSearchRequest } from '../models/community-job-search-request.model';

@Injectable()
export class CommunityJobEffectsService {


  private static buildSearchRequestObject(filtersPagingAndJobContext: any): CommunityJobSearchRequest {
    const pagingOptionsRequestObj = mapResultsPagingOptionsToPagingOptions(filtersPagingAndJobContext.pagingOptions);
    const communityJobSearchRequest: CommunityJobSearchRequest = {
        PagingOptions: pagingOptionsRequestObj
    };
    return communityJobSearchRequest;
  }


  searchCompanyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(

      withLatestFrom(
        this.store.select(fromCommunityJobReducer.getPagingOptions),
        (action: fromCommunityJobActions.GettingCommunityJobs, pagingOptions) =>
          ({ action, pagingOptions })
      ),

      switchMap(search => {
        const searchRequest = CommunityJobEffectsService.buildSearchRequestObject(search);
        return this.communityJobService.getJobs(searchRequest)
          .pipe(
            mergeMap((searchResponse: CommunityJobSearchResponse) => {
              const actions = [];
                if (searchRequest.PagingOptions.StartIndex > 1) {
                  actions.push(new fromCommunityJobActions.GettingMoreCommunityJobsSuccess(searchResponse));
                } else {
                  actions.push(new fromCommunityJobActions.GettingCommunityJobsSuccess(searchResponse));
                }
              return actions;
            }),
            catchError(() => of(new fromCommunityJobActions.GettingCommunityJobsError()))
          );
      })
    );
  }


  constructor(
    private store: Store<fromCommunityJobReducer.State>,
    private communityJobService: CommunityJobApiService
  ) {
  }
}
