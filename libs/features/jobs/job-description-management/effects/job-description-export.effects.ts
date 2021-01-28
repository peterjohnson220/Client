import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, tap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobDescriptionsExportActions from '../actions/job-description-export.actions';


@Injectable()
export class JobDescriptionExportEffects {

@Effect()
InitiateJobDescriptionExport$: Observable<Action> = this.actions$
  .pipe(
    ofType<fromJobDescriptionsExportActions.InitiateJobDescriptionExport>(fromJobDescriptionsExportActions.INITIATE_JOB_DESCRIPTION_EXPORT),
    switchMap(() =>
      this.jobDescriptionApiService.exportJobDescriptions(true).pipe(
        map(() => new fromJobDescriptionsExportActions.InitiateJobDescriptionExportSuccess()),
        catchError(error => of(new fromJobDescriptionsExportActions.InitiateJobDescriptionExportError(error)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
  ) {}
}
