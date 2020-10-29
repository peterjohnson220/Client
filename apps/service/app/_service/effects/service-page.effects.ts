import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import cloneDeep from 'lodash/cloneDeep';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { UserTicketApiService } from 'libs/data/payfactors-api/index';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { UserTicketUpdatePublicOrPrivateTicketRequest } from 'libs/models/payfactors-api/service/request';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromServicePageActions from '../actions/service-page.actions';
import * as fromServicePageReducer from '../reducers';
import { PayfactorsApiModelMapper, TicketStateHelper } from '../helpers';
import { ServicePageConfig, TicketListMode } from '../models';

@Injectable()
export class ServicePageEffects {

  @Effect()
  loadTicketTypes$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.LOAD_TICKET_TYPES),
      switchMap((action: fromServicePageActions.LoadTicketTypes) => {
        return this.userTicketApiService.getUserTicketTypes()
          .pipe(
            map((response) => new fromServicePageActions.LoadTicketTypesSuccess(PayfactorsApiModelMapper.mapTicketTypeResponseToTicketTypes(response))),
            catchError((error) => of(new fromServicePageActions.LoadTicketTypesError(error)))
          );
      })
    );

  @Effect()
  createUserTicket$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.CREATE_USER_TICKET),
      switchMap((action: fromServicePageActions.CreateUserTicket) => {
        return this.userTicketApiService.createUserTicket({
          UserTicket: action.payload.ticket,
          FileData: action.payload.fileData
        }).pipe(
            map((response) => new fromServicePageActions.CreateUserTicketSuccess()),
            catchError((error) => of(new fromServicePageActions.CreateUserTicketError('Error creating ticket. Please try again later')))
          );
      })
    );

  @Effect()
  createUserTicketSuccess$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.CREATE_USER_TICKET_SUCCESS),
      mergeMap(() => [
        new fromPfDataGridActions.LoadData(ServicePageConfig.ServicePageViewId),
        new fromServicePageActions.ShowNewTicketModal(false)
        ])
    );

  @Effect()
  getTicketStates$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.GET_TICKET_STATES),
      switchMap((action: fromServicePageActions.GetTicketStates) => {
        return this.userTicketApiService.getUserTicketStates()
          .pipe(
            map((response) => {
              const ticketStates = PayfactorsApiModelMapper.mapTicketStatesToGroupedListItems(response);
              return new fromServicePageActions.GetTicketStatesSuccess(ticketStates);
            }),
            catchError(() => of(new fromServicePageActions.GetTicketStatesError()))
          );
      })
    );

  @Effect()
  updateSelectedTicketStates$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.UPDATE_SELECTED_TICKET_STATES),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromServicePageReducer.getSelectedTicketStates)),
        (action, fields, selectedTicketStates) => ({ action, fields, selectedTicketStates })
      ),
      map(data => {
        const ticketStateField = TicketStateHelper.applySelectedTicketStatesToField(data.fields, data.selectedTicketStates);
        if (data?.selectedTicketStates.length) {
          return new fromPfDataGridActions.UpdateFilter(ServicePageConfig.ServicePageViewId, ticketStateField);
        } else {
          return new fromPfDataGridActions.ClearFilter(ServicePageConfig.ServicePageViewId, ticketStateField, true);
        }
      })
    );

  @Effect()
  loadSupportTeam$ = this.actions$
  .pipe(
    ofType(fromServicePageActions.LOAD_SUPPORT_TEAM),
    switchMap((action: fromServicePageActions.LoadSupportTeam) => {
      return this.userTicketApiService.getSupportTeam()
        .pipe(
          map((response) => {
            const supportTeam = PayfactorsApiModelMapper.mapSupportTeamResponseToSupportTeamUser(response);
            return new fromServicePageActions.LoadSupportTeamSuccess(supportTeam);
          }),
          catchError((error) => of(new fromServicePageActions.LoadSupportTeamError(error)))
        );
    })
  );

  @Effect()
  setTicketListMode$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.SET_TICKET_LIST_MODE),
      withLatestFrom(
        this.store.pipe(select(fromPfDataGridReducer.getFields)),
        this.store.pipe(select(fromServicePageReducer.getSelectedTicketStates)),
        (action: fromServicePageActions.SetTicketListMode, fields, selectedTicketStates) =>
          ({ action, fields, selectedTicketStates })
      ),
      mergeMap(data => {
        const inboundFilters = PayfactorsApiModelMapper.buildInboundFiltersByTicketListMode(
          data.action.payload.listType, data.action.payload.userId);
        if (data.selectedTicketStates && data.selectedTicketStates.length) {
          inboundFilters.push(TicketStateHelper.buildTicketStateInboundFilter(data.selectedTicketStates));
        }
        const createdByField: ViewField = cloneDeep(data.fields.find((f: ViewField) => f.SourceName === 'FullName'));
        createdByField.IsFilterable = data.action.payload.listType === TicketListMode.AllCompanyTickets;
        return [
          new fromPfDataGridActions.UpdateFilter(ServicePageConfig.ServicePageViewId, createdByField),
          new fromPfDataGridActions.UpdateInboundFilters(ServicePageConfig.ServicePageViewId, inboundFilters, data.action.payload.resetFilter)
        ];
      })
    );

  @Effect()
    getUserTicket$ = this.actions$
      .pipe(
        ofType(fromServicePageActions.GET_USER_TICKET),
        switchMap((action: fromServicePageActions.GetUserTicket) => {
          return this.userTicketApiService.getUserTicketUserView(action.payload.ticketId)
            .pipe(
              map((response) => {
                const userTicket = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicket(action.payload.userId, response);
                return new fromServicePageActions.GetUserTicketSuccess(userTicket);
              }),
              catchError((error) => of(new fromServicePageActions.LoadSupportTeamError(error)))
            );
        })
      );

  @Effect()
  saveSupportTeamDashboardOpenSetting$ = this.actions$
  .pipe(
    ofType(fromServicePageActions.SAVE_SUPPORT_TEAM_DASHBOARD_OPEN),
    map((action: fromServicePageActions.SaveSupportTeamDashboardOpenSetting) => {
      return new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
        FeatureArea: FeatureAreaConstants.Service,
        SettingName: UiPersistenceSettingConstants.ServiceSupportTeamDashboardOpen,
        SettingValue: action.payload.settingValue.toString()
      });
    })
  );

  @Effect()
  togglePublicOrPrivateUserTicket = this.actions$
    .pipe(
      ofType(fromServicePageActions.TOGGLE_PUBLIC_OR_PRIVATE_USER_TICKET),
      switchMap((action: fromServicePageActions.TogglePublicOrPrivateUserTicket) => {
        const request: UserTicketUpdatePublicOrPrivateTicketRequest = {
          Value: action.payload.value,
          TicketId: action.payload.ticketId
        };
        return this.userTicketApiService.togglePublicOrPrivateUserTicket(request)
          .pipe(
            map((response) => {
              return new fromServicePageActions.TogglePublicOrPrivateUserTicketSuccess();
            }),
            catchError((error) => of(new fromServicePageActions.TogglePublicOrPrivateUserTicketError()))
          );
      })
    );

  @Effect()
  togglePublicOrPrivateUserTicketSuccess$ = this.actions$
    .pipe(
      ofType(fromServicePageActions.TOGGLE_PUBLIC_OR_PRIVATE_USER_TICKET_SUCCESS),
      map(() =>
        new fromPfDataGridActions.LoadData(ServicePageConfig.ServicePageViewId)
      )
    );

  constructor(
    private actions$: Actions,
    private userTicketApiService: UserTicketApiService,
    private store: Store<fromServicePageReducer.State>
  ) {}
}
