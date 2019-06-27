import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { WindowCommunicationService } from 'libs/core/services';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

@Injectable()
export class SearchPageEffects {

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CLOSE_SEARCH_PAGE),
      tap((action: fromSearchPageActions.CloseSearchPage) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
