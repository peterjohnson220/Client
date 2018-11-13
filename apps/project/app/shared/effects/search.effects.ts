import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { WindowCommunicationService } from 'libs/core/services';

import * as fromSearchActions from '../actions/search.actions';

@Injectable()
export class SearchEffectsEffects {

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .ofType(fromSearchActions.CLOSE_SEARCH_PAGE)
    .pipe(
      tap((action: fromSearchActions.CloseSearchPage) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
