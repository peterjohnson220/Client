import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response';

import * as fromTemplateListActions from '../actions/template-list.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { LoadTemplateListByCompanyIdRequest } from '../models/requests';

@Injectable()
export class TemplateListEffects {
  @Effect()
  loadTemplateList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateListActions.LOAD_TEMPLATE_LIST),
      switchMap((action: fromTemplateListActions.LoadTemplateList) => {
          let observable: Observable<TemplateListItemResponse[]>;

          if (action.payload.publishedOnly) {
            observable = this.jobDescriptionTemplateApiService.getPublished();
          } else {
            observable = this.jobDescriptionTemplateApiService.get();
          }

          return observable.pipe(
            map((response: TemplateListItemResponse[]) => {
              const templateList = PayfactorsApiModelMapper.mapTemplateListItemResponseListToTemplateItemList(response);
              return new fromTemplateListActions.LoadTemplateListSuccess(templateList);
            }),
            catchError(response => of(new fromTemplateListActions.LoadTemplateListError()))
          );
        }
      ));


  @Effect()
  loadTemplateListByCompanyId$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateListActions.LOAD_TEMPLATE_LIST_BY_COMPANY_ID),
      map((action: fromTemplateListActions.LoadTemplateListByCompanyId) => {
        return action.payload;
      } ),
      switchMap((request: LoadTemplateListByCompanyIdRequest) => {
        return this.jobDescriptionTemplateApiService.getByCompanyId(request).pipe(
          tap((response: TemplateListItemResponse[]) => !!response),
          map((response: TemplateListItemResponse[]) => {
            const templateList = PayfactorsApiModelMapper.mapTemplateListItemResponseListToTemplateItemList(response);
            return new fromTemplateListActions.LoadTemplateListByCompanyIdSuccess(templateList);
          }),
          catchError(() => of(new fromTemplateListActions.LoadTemplateListError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService
  ) {}
}
