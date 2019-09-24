import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response/';

import * as fromTemplateListActions from '../actions/template-list.actions';
import { PayfactorsApiModelMapper } from '../../shared/helpers';
import * as fromTemplateActions from '../actions/template.actions';

@Injectable()
export class TemplateListEffects {
@Effect()
  loadTemplateList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateListActions.LOAD_TEMPLATE_LIST),
      switchMap((action: fromTemplateListActions.LoadTemplateList) =>
        this.templateApiService.get().pipe(
          map((response: TemplateListItemResponse[]) => {
              return new fromTemplateListActions.LoadTemplateListSuccess(PayfactorsApiModelMapper.mapTemplateListItemResponseListToTemplateItemList(response));
            })
        )
      ));

  @Effect()
  deleteTemplateSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.DELETE_TEMPLATE_SUCCESS),
      switchMap(() =>
        of(new fromTemplateListActions.LoadTemplateList())
      ));

  constructor(
    private actions$: Actions,
    private templateApiService: JobDescriptionTemplateApiService
  ) {}
}
