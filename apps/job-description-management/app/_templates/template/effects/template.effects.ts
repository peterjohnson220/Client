import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { NotificationLevel, NotificationSource } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import { MessageHelper } from 'libs/core';

import * as fromTemplateActions from '../actions';
import { ErrorGenerationService } from '../../../shared/services';


@Injectable()
export class TemplateEffects {

  @Effect()
  saveTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.SAVE_TEMPLATE),
      switchMap((action: fromTemplateActions.SaveTemplate) =>
        this.templateApiService.save(action.payload.template).pipe(
          map((response: any) => {
            return new fromTemplateActions.SaveTemplateSuccess({template: JSON.parse(response)});
          }),
          catchError(response => of(new fromTemplateActions.SaveTemplateError(
            {error: this.errorGenerationService.buildErrorModel(response, 'template', this.router.url)})))
        )
      ));

  @Effect({dispatch: false})
  saveTemplateSuccess$ = this.actions$
    .pipe(
      ofType(fromTemplateActions.SAVE_TEMPLATE_SUCCESS),
      map((action: fromTemplateActions.SaveTemplateSuccess) => {
        this.router.navigate([`/templates/${action.payload.template.TemplateId}`]);
      })
    );

  @Effect()
  saveTemplateName$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.SAVE_TEMPLATE_NAME),
      switchMap((action: fromTemplateActions.SaveTemplateName) =>
        this.templateApiService.saveTemplateName(action.payload.templateId, action.payload.templateName).pipe(
          map((response: any) => {
            return new fromTemplateActions.SaveTemplateNameSuccess();
          }),
          catchError(response => of(new fromTemplateActions.SaveTemplateNameError(
            {error: this.errorGenerationService.buildErrorModel(response, 'template', this.router.url)})))
        )
      ));

  @Effect()
  copyTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.COPY_TEMPLATE),
      switchMap((action: fromTemplateActions.CopyTemplate) =>
        this.templateApiService.copy(action.payload.templateId, action.payload.templateName).pipe(
          map((response: any) => {
            return new fromTemplateActions.CopyTemplateSuccess(JSON.parse(response));
          }),
          catchError(response => of(new fromTemplateActions.CopyTemplateError(
            {errorMessage: MessageHelper.buildErrorMessage('Error copying this template.')})))
        )
      ));

  @Effect({dispatch: false})
  copyTemplateSuccess$ = this.actions$
    .pipe(
      ofType(fromTemplateActions.COPY_TEMPLATE_SUCCESS),
      map((action: fromTemplateActions.CopyTemplateSuccess) => {
        this.router.navigate([`/templates/${action.payload.TemplateId}`]);
      })
    );

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

  @Effect()
  publishTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.PUBLISH_TEMPLATE),
      switchMap((action: fromTemplateActions.PublishTemplate) =>
        this.templateApiService.publishAsync(action.payload.template).pipe(
          map(() => {
            return new fromTemplateActions.PublishTemplateSuccess();
          })
        )
      ));

  @Effect()
  discardTemplate$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.DISCARD_TEMPLATE_DRAFT),
      switchMap((action: fromTemplateActions.DiscardTemplateDraft) =>
        this.templateApiService.discardDraft(action.payload.templateId).pipe(
          map((response: any) => {
            return new fromTemplateActions.DiscardTemplateDraftSuccess();
          }),
          catchError(response => of(new fromTemplateActions.DiscardTemplateDraftError(
            {errorMessage: MessageHelper.buildErrorMessage('Error discarding this draft.')})))
        )
      ));

  @Effect({dispatch: false})
  discardTemplateSuccess$ = this.actions$
    .pipe(
      ofType(fromTemplateActions.DISCARD_TEMPLATE_DRAFT_SUCCESS),
      map((action: fromTemplateActions.DiscardTemplateDraftSuccess) => {
        this.router.navigate([`/templates`]);
      })
    );

  @Effect({ dispatch: false })
  addNotification$ = this.actions$
    .pipe(
      ofType(fromAppNotificationsActions.ADD_NOTIFICATION),
      map((action: fromAppNotificationsActions.AddNotification) => {
        if (action.payload.Level === NotificationLevel.Success &&
            action.payload.From === NotificationSource.JobDescriptionTemplatePublisher) {
              this.router.navigate([`/templates`]);
        }
      })
    );

  private templateId: number;
  constructor(
    private actions$: Actions,
    private templateApiService: JobDescriptionTemplateApiService,
    private errorGenerationService: ErrorGenerationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
}
