import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, concatMap, tap } from 'rxjs/operators';

import { TotalRewardsApiService } from 'libs/data/payfactors-api/total-rewards';

import * as fromTemplateSelectorActions from '../actions/template-selector.actions';
import { Template } from '../../../shared/models';

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

  @Effect()
  createStatement$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateSelectorActions.CREATE_STATEMENT),
      concatMap((action: fromTemplateSelectorActions.CreateStatement) =>
        this.totalRewardsApiService.createStatementFromTemplateId(action.payload.templateId).pipe(
          map((statementId: string) => new fromTemplateSelectorActions.CreateStatementSuccess({ statementId })),
          catchError(() => of(new fromTemplateSelectorActions.CreateStatementError()))
        ))
    );

  @Effect({ dispatch: false })
  navigateToCreatedStatement: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateSelectorActions.CREATE_STATEMENT_SUCCESS),
      tap((action: fromTemplateSelectorActions.CreateStatementSuccess) => {
        this.router.navigate(['statement/edit', action.payload.statementId]);
      })
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsApiService,
    private router: Router) {}

  mapToTemplate(apiModels: any[]): Template[] {
    const templates = [];
    apiModels.forEach(model => {
      templates.push({
        id: model.Id,
        name: model.Name,
        description: model.Description,
        thumbnailUrl: model.ThumbnailUrl
      });
    });
    return templates;
  }

}
