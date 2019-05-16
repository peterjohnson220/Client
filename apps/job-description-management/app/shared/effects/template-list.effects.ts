import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm/job-description-template-api.service';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response';

import * as fromTemplateListActions from '../actions/template-list.actions';
import * as fromTemplateListReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class TemplateListEffects {
  @Effect()
  loadTemplateList$: Observable<Action> = this.actions$
    .ofType(fromTemplateListActions.LOAD_TEMPLATE_LIST).pipe(
      switchMap((action: fromTemplateListActions.LoadTemplateList) => {
          let observable: Observable<TemplateListItemResponse[]>;

          if (action.payload.PublishedOnly) {
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

  constructor(
    private actions$: Actions,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private store: Store<fromTemplateListReducer.State>,
  ) {}
}
