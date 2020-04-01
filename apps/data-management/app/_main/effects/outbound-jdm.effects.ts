import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { isEmpty, isObject } from 'lodash';

import { OrgDataEntityType } from 'libs/constants';

import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import * as fromOutboundJdmActions from '../actions/outbound-jdm.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import { TransferDataWorkflowStep } from '../data/transfer-data-workflow-step.data';
import { ConnectionSummary, getMockOutboundJdmDestinationFields, getMockOutboundJdmSourceFields } from '../models';
import * as fromDataManagementMainReducer from '../reducers';

@Injectable()
export class OutboundJdmEffects {

  @Effect()
  loadConnectionSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromOutboundJdmActions.LoadConnectionSummary>(fromOutboundJdmActions.LOAD_CONNECTION_SUMMARY),
      delay(0),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => of(
        isObject(existingSummary.obj) ?
          new fromOutboundJdmActions.LoadConnectionSummarySuccess(existingSummary.obj) :
          new fromOutboundJdmActions.ResetConnectionSummary()
      )),
    );

  @Effect()
  resetConnectionSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromOutboundJdmActions.ResetConnectionSummary>(fromOutboundJdmActions.RESET_CONNECTION_SUMMARY),
      switchMap(() => {
        const summary: ConnectionSummary = {
          connectionID: null,
          statuses: [],
          provider: {
            Active: true,
            AuthenticationTypeId: 2,
            ImageUrl: 'assets/images/workday-logo.png',
            ProviderCode: 'WDMOCK',
            ProviderId: 54321,
            ProviderName: 'Workday Mock',
          },
          hasConnection: false,
          canEditConnection: false,
          canEditMappings: false,
          selectedEntities: [],
          loaderConfigurationGroupId: null,
        };

        return [
          new fromOutboundJdmActions.ResetFieldMappings(),
          new fromOutboundJdmActions.LoadConnectionSummarySuccess(summary),
        ];
      })
    );

  @Effect()
  saveCredentials$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromOutboundJdmActions.SaveCredentials>(fromOutboundJdmActions.SAVE_CREDENTIALS),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => {
        const summary = {
          ...existingSummary.obj,
          connectionID: 12345,
          canEditMappings: true,
          statuses: ['Authenticated']
        };

        return of(new fromOutboundJdmActions.SaveConnectionSummarySuccess(summary));
      }),
    );

  @Effect()
  validateCredentials$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromHrisConnectionActions.OutboundJdmValidate>(fromHrisConnectionActions.OUTBOUND_JDM_VALIDATE),
      delay(5000),
      switchMap(() => [
          new fromHrisConnectionActions.ValidateSuccess(),
          new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.Validated)
      ]),
    );

  @Effect()
  initFieldMapping$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromOutboundJdmActions.InitFieldMappings>(fromOutboundJdmActions.INIT_FIELD_MAPPINGS),
      delay(0),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getPayfactorsFields),
        this.store.select(fromDataManagementMainReducer.getProviderFields),
        (action, payfactorsFields, providerFields) => ({
          payfactorsFields,
          providerFields,
        }),
      ),
      switchMap(({ payfactorsFields, providerFields }) => {
        const hasMappings = isObject(payfactorsFields) &&
          !isEmpty(payfactorsFields.JobDescriptions) &&
          isObject(providerFields) &&
          !isEmpty(providerFields.JobDescriptions) ;

        const actions = hasMappings ? [] : [
          // for outbound jdm, the payfactors and provider fields switch sides
          // TODO: make the terms used in the components agnostic so we don't have to play mind games
          // may also want to refactor api/db layer to use alternate terms
          // perhaps source/destination instead of provider/payfactors?
          new fromFieldMappingActions.LoadProviderFieldsByEntitySuccess({
            entity: OrgDataEntityType.JobDescriptions,
            providerEntityFields: getMockOutboundJdmSourceFields(),
          }),
          new fromFieldMappingActions.LoadPayfactorsFieldsByEntitySuccess({
            entity: OrgDataEntityType.JobDescriptions,
            payfactorsEntityFields: getMockOutboundJdmDestinationFields(),
          }),
        ];

        return [
          ...actions,
          new fromFieldMappingActions.InitFieldMappingCardSuccess(),
        ];
      }),
    );

  @Effect()
  resetFieldMapping$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromOutboundJdmActions.ResetFieldMappings>(fromOutboundJdmActions.RESET_FIELD_MAPPINGS),
      delay(0),
      switchMap((existingMappings) => {
        return [
          new fromFieldMappingActions.LoadProviderFieldsByEntitySuccess({
            entity: OrgDataEntityType.JobDescriptions,
            providerEntityFields: [],
          }),
          new fromFieldMappingActions.LoadPayfactorsFieldsByEntitySuccess({
            entity: OrgDataEntityType.JobDescriptions,
            payfactorsEntityFields: [],
          }),
        ];
      }),
    );

  @Effect()
  completeConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOutboundJdmActions.COMPLETE_CONNECTION),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => {
        const summary = {
          ...existingSummary.obj,
          hasConnection: true
        };
        return of(new fromOutboundJdmActions.SaveConnectionSummarySuccess(summary));
      }),
    );

  @Effect()
  saveMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromFieldMappingActions.SaveOutboundJdmFieldMappings>(fromFieldMappingActions.SAVE_OUTBOUND_MAPPINGS),
      delay(500),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap((existingSummary) => of(new fromFieldMappingActions.SaveOutboundJdmFieldMappingsSuccess(existingSummary.obj.hasConnection))),
      tap((action: fromFieldMappingActions.SaveOutboundJdmFieldMappingsSuccess) => {
        if (action.payload) {
          return this.router.navigate(['']);
        }
        return this.router.navigate(['/transfer-data/outbound/transfer-schedule']);
      }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private router: Router,
  ) {}
}
