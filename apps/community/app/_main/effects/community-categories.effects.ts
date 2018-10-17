import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityCategoriesApiService } from 'libs/data/payfactors-api/community/community-categories-api.service';
import { CommunityCategory } from 'libs/models/community/community-categories.model';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';

@Injectable()
export class CommunityCategoriesEffects {

  @Effect()
  loadingCommunityCategories: Observable<Action> = this.actions$
    .ofType(fromCommunityCategoriesActions.GETTING_COMMUNITY_CATEGORIES).pipe(
      switchMap((action: fromCommunityCategoriesActions.GettingCommunityCategories) =>
          this.communityCategoriesApiService.get().pipe(
            map((communityCategories: CommunityCategory[]) => {
              return new fromCommunityCategoriesActions.GettingCommunityCategoriesSuccess(communityCategories);
            }),
            catchError(error => of(new fromCommunityCategoriesActions.GettingCommunityCategoriesError()))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private communityCategoriesApiService: CommunityCategoriesApiService,
  ) {}
}
