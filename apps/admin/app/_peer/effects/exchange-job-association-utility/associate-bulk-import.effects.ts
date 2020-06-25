import { Injectable } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { ExchangeJobMappingService } from 'libs/features/peer/exchange-job-mapping/services';

import * as fromAssociateBulkImportActions from '../../actions/exchange-job-association-utility/associate-bulk-import.actions';

@Injectable()
export class AssociateBulkImportEffects {

  @Effect()
  importAssociations$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromAssociateBulkImportActions.IMPORT_BULK_ASSOCIATE_JOBS),
      map((action: fromAssociateBulkImportActions.ImportBulkAssociateJobs) => action.payload),
      switchMap(payload =>
        this.exchangeJobMappingService.validateAndLoadBulkAssociations(payload).pipe(
          map((response) => new fromAssociateBulkImportActions
            .ImportBulkAssociateJobsSuccess(response)),
          catchError(error => of(new fromAssociateBulkImportActions.ImportBulkAssociateJobsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeJobMappingService: ExchangeJobMappingService
  ) {}
}
