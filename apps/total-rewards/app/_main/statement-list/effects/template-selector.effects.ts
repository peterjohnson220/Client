import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as fromTemplateSelectorActions from '../actions/template-selector.actions';
import * as fromTotalRewardsReducer from '../reducers';
import {TotalRewardsApiService} from '../../../../../../libs/data/payfactors-api/total-rewards';
import {Template} from '../../../shared/models';


@Injectable()
export class TemplateSelectorEffects {

  @Effect()
  loadTemplates$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromTemplateSelectorActions.LOAD_TEMPLATES),
      switchMap(() =>
        this.totalRewardsApiService.getTemplates().pipe(
          map( (response: any[]) => new fromTemplateSelectorActions.LoadTemplatesSuccess(this.mapToTemplate(response))),
          catchError( () => of(new fromTemplateSelectorActions.LoadTemplatesError()))
        ))
  );

  constructor(
    private store: Store<fromTotalRewardsReducer.State>,
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService) {}

  mapToTemplate(apiModels: any[]): Template[] {
    const templates = [];
    apiModels.forEach(model => {
      templates.push({
        id: model.Id,
        name: model.Name,
        description: model.Description,
        thumbnailUrl: this.getThumbnailUrl(model.Name)
      });
    });
    return templates;
  }

  getThumbnailUrl(templateName: string): string {
    if (templateName === 'Template A') {
      return 'assets/images/template-a-cropped.png';
    }
  }

}
