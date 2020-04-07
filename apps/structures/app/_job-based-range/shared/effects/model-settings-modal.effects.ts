import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { catchError, debounce, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { CompositeFieldApiService } from 'libs/data/payfactors-api/composite-field';
import { StructureModelingApiService, StructuresApiService } from 'libs/data/payfactors-api/structures';
import { AsyncStateObj } from 'libs/models/state';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';
import * as fromDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromNotificationActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import * as fromModelSettingsModalActions from '../actions/model-settings-modal.actions';
import * as fromSharedActions from '../actions/shared.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { PageViewIds } from '../constants/page-view-ids';
import * as fromSharedReducer from '../reducers';
import { Pages } from '../constants/pages';
import { RangeGroupMetadata } from '../models';

@Injectable()
export class ModelSettingsModalEffects {

  @Effect()
  closeModal$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.CLOSE_MODAL),
      map(() => new fromSharedActions.SetIsNewModelModelSettings(false))
    );

  @Effect()
  getCurrencies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_CURRENCIES),
      switchMap(() =>
        this.currencyApiService.getCurrencies()
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetCurrenciesSuccess(PayfactorsApiModelMapper.mapCurrencyDtosToCurrency(response));
            }),
            catchError(error => of(new fromModelSettingsModalActions.GetCurrenciesError()))
          )
      )
    );

  @Effect()
  getStandardPayElements$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromModelSettingsModalActions.GET_CONTROL_POINTS),
      switchMap(() =>
        this.compositeFieldsApiService.GetCompositeFieldsForStructuresModel()
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetControlPointsSuccess(PayfactorsApiModelMapper.mapCompositeFieldsToControlPoints(response));
            }),
            catchError(error => of(new fromModelSettingsModalActions.GetControlPointsError()))
          )
      )
    );

  @Effect()
  getStructureNameSuggestions: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.GetStructureNameSuggestions>(fromModelSettingsModalActions.GET_STRUCTURE_NAME_SUGGESTIONS),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getStructureNameSuggestionsAsyncObj)),
        (action, structureNames: AsyncStateObj<string[]>) => {
          return { action, names: structureNames.obj };
        }
      ),
      debounce((e) => e.names.length ? timer(300) : timer(100)),
      switchMap((e) =>
        this.structureModelingApiService.getStructureNameAutocompleteSuggestions(e.action.payload.filter)
          .pipe(
            map((response) => {
              return new fromModelSettingsModalActions.GetStructureNameSuggestionsSuccess(response);
            }),
            catchError(() => of(new fromModelSettingsModalActions.GetStructureNameSuggestionsError()))
          )
      )
    );

  @Effect()
  saveModelSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.SaveModelSettings>(fromModelSettingsModalActions.SAVE_MODEL_SETTINGS),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getMetadata)),
        (action, metadata: RangeGroupMetadata) => {
          return { action, metadata };
        }
      ),
      switchMap((data) => {
        return this.structureModelingApiService.saveModelSettings(
          PayfactorsApiModelMapper.mapModelSettingsModalFormToSaveSettingsRequest(data.action.payload.rangeGroupId, data.action.payload.formValue)
        ).pipe(
          mergeMap((r) => {
              const actions = [];

              // TODO: Move this out into a helper class, too much complexity for here [BC]
              if (!r.ValidationResult.Pass && r.ValidationResult.FailureReason === 'Model Name Exists') {
                actions.push(new fromModelSettingsModalActions.ModelNameExistsFailure());
              } else {
                actions.push(new fromModelSettingsModalActions.ClearModelNameExistsFailure());

                if (data.metadata.IsCurrent) {
                  this.router.navigate([r.RangeGroup.CompanyStructuresRangeGroupId]);
                  actions.push(new fromModelSettingsModalActions.CloseModal());
                  actions.push(new fromNotificationActions.AddNotification({
                    EnableHtml: true,
                    From: NotificationSource.GenericNotificationMessage,
                    Level: NotificationLevel.Success,
                    NotificationId: '',
                    Payload: { Title: 'Model Created', Message: `Created, ${r.RangeGroup.RangeGroupName}`},
                    Type: NotificationType.Event
                  }));
                } else {
                  actions.push(new fromSharedActions.SetMetadata(
                    PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(r.RangeGroup)
                  ));
                  actions.push(new fromModelSettingsModalActions.CloseModal());
                  actions.push(new fromDataGridActions.LoadData(PageViewIds.Model));

                  switch (data.action.payload.fromPage) {
                    case Pages.Employees: {
                      actions.push(new fromDataGridActions.LoadData(PageViewIds.Employees));
                      break;
                    }
                    case Pages.Pricings: {
                      actions.push(new fromDataGridActions.LoadData(PageViewIds.Pricings));
                      break;
                    }
                  }
                }

                actions.push(new fromModelSettingsModalActions.SaveModelSettingsSuccess());
              }

              return actions;
            }
          ),
          catchError(() => of(new fromModelSettingsModalActions.SaveModelSettingsError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private currencyApiService: CurrencyApiService,
    private structuresApiService: StructuresApiService,
    private compositeFieldsApiService: CompositeFieldApiService,
    private structureModelingApiService: StructureModelingApiService,
    private router: Router,
    private store: Store<fromSharedReducer.State>
  ) {
  }
}
