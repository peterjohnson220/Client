import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of, Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { JobDescriptionFooterViewApiService } from 'libs/data/payfactors-api/jdm';

import * as fromFooterViewActions from '../actions';
import { PayfactorsApiModelMapper } from '../../shared/helpers';
import { FooterViewModel } from '../models';

@Injectable()
export class FooterViewEffects {

    @Effect()
    loadJdmFooterViewSetting$: Observable<Action> = this.actions$.
    pipe(
        ofType(fromFooterViewActions.LOAD_FOOTER_VIEW),
        switchMap(() =>
            this.jdmFooterViewSettingsApiService.getFooterView().pipe(
                map((footerViewResponse: FooterViewModel) => {
                    return new fromFooterViewActions.LoadFooterViewActionSuccess(footerViewResponse);
                }),
                catchError(() => of(new fromFooterViewActions.LoadFooterViewActionError()))
            )
    ));

    @Effect()
    saveJdmFooterViewSetting$: Observable<Action> = this.actions$.
    pipe(
        ofType(fromFooterViewActions.SAVE_FOOTER_VIEW),
        switchMap((action: fromFooterViewActions.SaveFooterViewAction) =>
        this.jdmFooterViewSettingsApiService.saveFooterView(
                PayfactorsApiModelMapper.mapFooterViewModelToRequest(action.payload)
            ).pipe(
            map(() => {
                return new fromFooterViewActions.SaveFooterViewActionSuccess(action.payload);
            }),
            catchError(() => of(new fromFooterViewActions.SaveFooterViewActionError()))
        )
    ));

    constructor(
        private actions$: Actions,
        private jdmFooterViewSettingsApiService: JobDescriptionFooterViewApiService
    ) {}
}
