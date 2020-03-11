import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyNote } from 'libs/models/payfactors-api';
import { MessageHelper } from 'libs/core/helpers';

import * as fromCompanyNotesActions from '../actions/company-notes.actions';


@Injectable()
export class CompanyNotesEffects {
    @Effect()
    loadCompanyNotes$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromCompanyNotesActions.LOAD_COMPANY_NOTES),
            switchMap((action: fromCompanyNotesActions.LoadCompanyNotes) =>
                this.companyApiService.getCompanyNotes(action.payload.companyId).pipe(
                    map((response: any) => {
                        return new fromCompanyNotesActions.LoadCompanyNotesSuccess(response);
                }),
                catchError(error => of(new fromCompanyNotesActions.LoadCompanyNotesError(
                    {errorMessage: MessageHelper.buildErrorMessage('Error loading notes.')}
                ))
            )
        )
    ));

    @Effect()
    saveCompanyNote$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromCompanyNotesActions.SAVE_COMPANY_NOTE),
            switchMap((action: fromCompanyNotesActions.SaveCompanyNote) =>
                this.companyApiService.saveCompanyNote(action.payload.note, action.payload.actionType).pipe(
                    map((response: CompanyNote[]) => {
                        return new fromCompanyNotesActions.SaveCompanyNoteSuccess();
                }),
                catchError(error => of(new fromCompanyNotesActions.SaveCompanyNoteError(
                    {errorMessage: MessageHelper.buildErrorMessage(error + 'Error saving note.')}
                ))
            )
        )
    ));

    constructor(
        private actions$: Actions,
        private companyApiService: CompanyApiService
    ) {}
}
