import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobInformationFieldForBulkExportResponse } from 'libs/models/payfactors-api/job-description/response';

import * as fromJobInformationFieldsActions from '../actions/job-information-fields.actions';
import * as fromJobInformationFieldsReducer from '../reducers';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';

@Injectable()
export class JobInformationFieldsEffects {
  @Effect()
  loadJobInformationFieldsForBulkExport$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobInformationFieldsActions.LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT),
      switchMap((action: fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExport) =>
        this.jobDescriptionApiService.getJobInformationFieldsForBulkExport(action.payload).pipe(
          map((response: JobInformationFieldForBulkExportResponse[]) => {
            const availableJifList = PayfactorsApiModelMapper.mapJifForBulkExportResponseListToAvailableJifList(response);
            return new fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExportSuccess(availableJifList);
          }),
          catchError(response => of(new fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExportError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromJobInformationFieldsReducer.State>,
  ) {}
}
