import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api';

import * as fromUploadOrgDataActions from '../actions/upload-org-data.actions';

@Injectable()
export class UploadOrgDataEffects {

  @Effect()
  uploadFile$: Observable<Action> = this.actions$.pipe(
    ofType(fromUploadOrgDataActions.UPLOAD_FILE),
      switchMap((action: fromUploadOrgDataActions.UploadFile) =>
        this.userTicketApiService.createUserTicket(action.payload).pipe(
          map(() => {
            return new fromUploadOrgDataActions.UploadFileSuccess();
          }),
          catchError(() => of(new fromUploadOrgDataActions.UploadFileError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userTicketApiService: UserTicketApiService
  ) {}
}
