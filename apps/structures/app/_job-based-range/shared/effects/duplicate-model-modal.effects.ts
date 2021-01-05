import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { DuplicateModelRequest } from 'libs/models/payfactors-api/structures/request/duplicate-model-request.model';

import * as fromDuplicateModelModalActions from '../actions/duplicate-model-modal.actions';
import * as fromSharedReducer from '../reducers';
import * as fromSharedActions from '../actions/shared.actions';
import { PagesHelper } from '../../../shared/helpers/pages.helper';


@Injectable()
export class DuplicateModelModalEffects {

  @Effect()
  duplicateModel$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromDuplicateModelModalActions.DuplicateModel>(fromDuplicateModelModalActions.DUPLICATE_MODEL),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getMetadata)),
        (action, metadata: RangeGroupMetadata) => {
          return { action, metadata };
        }
      ),
      switchMap((data) => {
        const request: DuplicateModelRequest = {
          ModelName: data.action.payload.modelName,
          RangeGroupId: data.action.payload.rangeGroupId
        };
        return this.structureModelingApiService.duplicateModel(request).pipe(
          mergeMap((response) => {
              const actions = [];

              if (!response.ValidationResult.Pass && response.ValidationResult.FailureReason === 'Model Name Exists') {
                actions.push(new fromDuplicateModelModalActions.ModelNameExistsFailure());
              } else {
                actions.push(new fromDuplicateModelModalActions.ClearModelNameExistsFailure());

                this.router.navigate(['job/' + response.RangeGroup.CompanyStructuresRangeGroupId]);
                actions.push(new fromDuplicateModelModalActions.CloseModal());
                actions.push(new fromNotificationActions.AddNotification({
                  EnableHtml: true,
                  From: NotificationSource.GenericNotificationMessage,
                  Level: NotificationLevel.Success,
                  NotificationId: '',
                  Payload: { Title: 'Model Created', Message: `New model has been created: ${response.RangeGroup.RangeGroupName}` },
                  Type: NotificationType.Event
                }));

                actions.push(new fromDuplicateModelModalActions.DuplicateModelSuccess());

                // Get all overridden ranges
                const modelPageViewId =
                  PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
                actions.push(new fromSharedActions.GetOverriddenRanges({
                  pageViewId: modelPageViewId,
                  rangeGroupId: response.RangeGroup.CompanyStructuresRangeGroupId
                }));
              }

              return actions;
            }
          ),
          catchError(() => of(new fromDuplicateModelModalActions.DuplicateModelError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private structureModelingApiService: StructureModelingApiService,
    private store: Store<fromSharedReducer.State>,
    private router: Router,
  ) {}
}
