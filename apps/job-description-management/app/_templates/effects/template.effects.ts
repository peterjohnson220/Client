import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {switchMap, map, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromTemplateActions from '../actions';
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

  @Effect()
  loadTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_TEMPLATE),
      switchMap((action: fromTemplateActions.LoadTemplate) =>
        this.templateApiService.getDetail(action.payload.templateId).pipe(
          map((response: any) => {
            return new fromTemplateActions.LoadTemplateSuccess(response);
          }),
          catchError(response => of(new fromTemplateActions.LoadTemplateError({errorMessage: 'Error Loading Template'})))
        )
      ));

  @Effect({dispatch: false})
  loadTemplateSuccess$ = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_TEMPLATE_SUCCESS),
      map((action: fromTemplateActions.LoadTemplateSuccess) => {
        this.router.navigate([`/templates/${action.payload.TemplateId}`]);
      })
    );

  // In ARCH-121 I will change this and display an error message instead
  @Effect({dispatch: false})
  loadTemplateError$ = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_TEMPLATE_ERROR),
      map(() => {
        this.router.navigate(['/404']);
      })
    );


  @Effect()
  loadTemplateAssignmentSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_TEMPLATE_ASSIGNMENT_SUMMARY),
      switchMap((action: fromTemplateActions.LoadTemplateAssignmentSummary) =>
        this.templateApiService.getTemplateAssignmentSummary(action.payload.templateId).pipe(
          map((response: any) => {
            return new fromTemplateActions.LoadTemplateAssignmentSummarySuccess(response);
          }),
          catchError(response => of(new fromTemplateActions.LoadTemplateAssignmentSummaryError({errorMessage: 'Error Loading Template Assignment Summary'})))
        )
      ));

  constructor(
    private actions$: Actions,
    private templateApiService: JobDescriptionTemplateApiService,
    private errorGenerationService: ErrorGenerationService,
    private router: Router
  ) {}
}
