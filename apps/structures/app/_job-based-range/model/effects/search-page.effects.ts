import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import { UrlService } from '../../shared/services';

@Injectable()
export class SearchPageEffects {

  @Effect({ dispatch: false})
  cancel$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CANCEL),
      tap(() => this.urlService.removeNewStructureWorkflow())
    );

  constructor(
    private actions$: Actions,
    private urlService: UrlService
  ) {}
}
