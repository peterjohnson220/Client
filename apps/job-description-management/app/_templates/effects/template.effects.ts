import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {switchMap, map, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromTemplateActions from '../actions/template.actions';
import {ErrorGenerationService} from '../../shared/services';


@Injectable()
export class TemplateEffects {
  @Effect()
  deleteTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.DELETE_TEMPLATE),
      switchMap((action: fromTemplateActions.DeleteTemplate) =>
        this.templateApiService.delete(action.payload.id).pipe(
          map(() => {
            return new fromTemplateActions.DeleteTemplateSuccess();
          }),
          catchError(response => of(new fromTemplateActions.DeleteTemplateError()))
        )
      ));

  @Effect()
  saveTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.SAVE_TEMPLATE),
      switchMap((action: fromTemplateActions.SaveTemplate) =>
        this.templateApiService.save(action.payload.template).pipe(
          map((response: any) => {
            return new fromTemplateActions.SaveTemplateSuccess({DraftNumber: response.DraftNumber,
              TemplateStatus: response.TemplateStatus, TemplateRevision: response.TemplateRevision});
          }),
          catchError(response => of(new fromTemplateActions.SaveTemplateError(
            {error: this.errorGenerationService.buildErrorModel(response, 'template', this.router.url)})))
        )
      ));

  @Effect()
  copyTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.COPY_TEMPLATE),
      switchMap((action: fromTemplateActions.CopyTemplate) =>
        this.templateApiService.copy(action.payload.templateId, action.payload.templateName).pipe(
          map((response: string) => {
            return new fromTemplateActions.CopyTemplateSuccess({template: response});
          })
        )
      ));

  constructor(
    private actions$: Actions,
    private templateApiService: JobDescriptionTemplateApiService,
    private errorGenerationService: ErrorGenerationService,
    private router: Router
  ) {}
}
