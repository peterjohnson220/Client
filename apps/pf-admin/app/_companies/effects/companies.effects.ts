import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyListResponseModel } from 'libs/models/payfactors-api/company/response';

import * as fromCompaniesActions from '../actions/companies.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';


@Injectable()
export class CompaniesEffects {
    @Effect()
    loadCompaniesList$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromCompaniesActions.LOAD_COMPANIES),
            switchMap((action: fromCompaniesActions.LoadCompanies) =>
                this.companyApiService.getListOfCompanies().pipe(
                    map((response: CompanyListResponseModel[]) => {
                        const companies = PayfactorsApiModelMapper.mapCompanyListResponseToCompanyGridItem(response);
                        return new fromCompaniesActions.LoadCompaniesSuccess(companies);
                }),
                catchError(error => of(new fromCompaniesActions.LoadCompaniesError())
            )
        )
    ));

    constructor(
        private actions$: Actions,
        private companyApiService: CompanyApiService
    ) {}
}
