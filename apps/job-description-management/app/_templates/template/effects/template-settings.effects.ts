import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';
import { TemplateSettings } from 'libs/models/jdm/template';

import * as fromTemplateActions from '../actions';
import { ErrorGenerationService } from '../../../shared';

@Injectable()
export class TemplateSettingEffects {

    @Effect()
    loadTemplateSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTemplateActions.LOAD_SETTINGS),
      switchMap((action: fromTemplateActions.LoadSettings) => {
        return this.jobDescriptionTemplateApiService.getSettings(action.payload.templateId).pipe(
          concatMap((response: string) => {
            if (response === '') {
              return [
                new fromTemplateActions.CreateSettings({templateId: action.payload.templateId})
              ];
            } else {
              return [
                new fromTemplateActions.LoadSettingsSuccess(JSON.parse(response))
              ];
            }
          }),
          catchError((error) => of(new fromTemplateActions.LoadSettingsError({errorMessage: 'Error Loading Template Settings.'})))
        );
      })
    );

    @Effect()
    saveTemplateSettings$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromTemplateActions.SAVE_SETTINGS),
        switchMap((action: fromTemplateActions.SaveSettings) =>
          this.jobDescriptionTemplateApiService.saveSettings(action.payload).pipe(
            map((response: TemplateSettings) => {
              return new fromTemplateActions.SaveSettingsSuccess(response);
            }),
            catchError(response => of(new fromTemplateActions.SaveSettingsError(
              {error: this.errorGenerationService.buildErrorModel(response, 'template settings', this.router.url)})))
          )
        ));

  constructor(
    private actions$: Actions,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private errorGenerationService: ErrorGenerationService,
    private router: Router
  ) {}
}
