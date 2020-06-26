import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as cloneDeep from 'lodash.clonedeep';
import { difference, isEqual } from 'lodash';

import { OrgDataEntityType } from 'libs/constants';
import { AsyncStateObj } from 'libs/models/state';

import { ConnectionSummary, EntityChoice, EntityTypeModel, Provider } from '../../../../models';
import { TransferDataWorkflowStep } from '../../../../data';
import { PayfactorsApiModelMapper } from '../../../../helpers';
import * as fromDataManagementMainReducer from '../../../../reducers';
import * as fromTransferDataPageActions from '../../../../actions/transfer-data-page.actions';
import * as fromProviderListActions from '../../../../actions/provider-list.actions';
import * as fromEntitySelectionActions from '../../../../actions/entity-selection.actions';

@Component({
  selector: 'pf-inbound-entity-selection',
  templateUrl: './inbound-entity-selection.page.html',
  styleUrls: ['./inbound-entity-selection.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboundEntitySelectionPageComponent implements OnInit, OnDestroy {
  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  workflowStep = TransferDataWorkflowStep;
  editMode = false;
  isPageDirty = false;
  connectionSummary: ConnectionSummary;
  providerSupportedEntities: EntityChoice[] = [];
  previousProviderSupportedEntities: EntityChoice[] = [];
  workflowComplete: boolean;

  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;
  connectionSummary$: Observable<ConnectionSummary>;
  selectedProvider$: Observable<Provider>;
  pageSelections$: Observable<{ selections: EntityTypeModel[], providerSupportedEntities: EntityChoice[]}>;
  providerSupportedEntitiesObj$: Observable<AsyncStateObj<EntityChoice[]>>;
  updatedProviderSupportedEntitiesObj$: Observable<AsyncStateObj<OrgDataEntityType[]>>;
  connectionLoading$: Observable<boolean>;
  connectionLoadingError$: Observable<boolean>;
  shouldRedirect$: Observable<boolean>;
  showRemoveEntityModal$: Observable<boolean>;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
    this.connectionLoading$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoading);
    this.connectionLoadingError$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionLoadingError);
    this.shouldRedirect$ = this.store.select(fromDataManagementMainReducer.getEntitySelectionShouldRedirect);

    this.connectionSummary$ = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary);

    this.pageSelections$ = this.store.select(fromDataManagementMainReducer.getEntitySelectionPageSelections);
    this.providerSupportedEntitiesObj$ = this.store.select(fromDataManagementMainReducer.getProviderSupportedEntitiesObj);
    this.updatedProviderSupportedEntitiesObj$ = this.store.select(fromDataManagementMainReducer.getEntitySelectionSavingObj);
    this.currentWorkflowStep$ = this.store.select(fromDataManagementMainReducer.getWorkflowStep);
    this.selectedProvider$ = this.store.select(fromDataManagementMainReducer.getSelectedProvider);
    this.showRemoveEntityModal$ = this.store.select(fromDataManagementMainReducer.getShowRemoveEntityModal);
  }

  ngOnInit() {
    this.store.dispatch(new fromEntitySelectionActions.Init());

    this.connectionSummary$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(s => {
      this.connectionSummary = s;
      this.workflowComplete = s.hasConnection;
      if (s.connectionID) {
        this.editMode = true;
        this.store.dispatch(new fromProviderListActions.SetSelectedProvider(s.provider));
      }
    });
    this.selectedProvider$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(p => {
      this.store.dispatch(new fromEntitySelectionActions.LoadEntitySelection(p));
    });
    this.pageSelections$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(s => {
      if (this.editMode && this.connectionSummary) {
        this.providerSupportedEntities =
          PayfactorsApiModelMapper.mapEntityChoicesWithConnectionSummary(s.providerSupportedEntities, this.connectionSummary);
        this.previousProviderSupportedEntities =
          PayfactorsApiModelMapper.mapEntityChoicesWithConnectionSummary(s.providerSupportedEntities, this.connectionSummary);
      } else {
        this.providerSupportedEntities = cloneDeep(s.providerSupportedEntities).map(p => {
          p.isChecked = s.selections.filter(e => e.EntityType.toLowerCase() === p.dbName.toLowerCase()).length > 0;
          return p;
        });
      }
    });
    this.shouldRedirect$.pipe(filter(v => v === true), takeUntil(this.unsubscribe$)).subscribe(s => {
      this.router.navigate(['/']);
    });

    this.updatedProviderSupportedEntitiesObj$
      .pipe(
        filter(v => v.savingSuccess === true),
        takeUntil(this.unsubscribe$));
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  cancelTransferDataWorkflow() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
    this.router.navigate(['/']);
  }

  proceedToAuthentication() {
    if (this.connectionSummary && this.connectionSummary.connectionID && !isEqual(this.providerSupportedEntities, this.previousProviderSupportedEntities)) {
      const newSelectedEntities = PayfactorsApiModelMapper.mapSelectedEntityChoicesToOrgDataEntityTypes(this.providerSupportedEntities);
      const previousSelectedEntities = PayfactorsApiModelMapper.mapSelectedEntityChoicesToOrgDataEntityTypes(this.previousProviderSupportedEntities);

      const hasAddedEntities = difference(newSelectedEntities, previousSelectedEntities).length > 0;
      const hasRemovedEntities = difference(previousSelectedEntities, newSelectedEntities).length > 0;

      if (hasAddedEntities && hasRemovedEntities) {
        this.store.dispatch(new fromEntitySelectionActions.OpenRemoveEntityModal(true));
      } else if (hasAddedEntities) {
        this.store.dispatch(new fromEntitySelectionActions.UpdateEntitySelections(
          { connectionId: this.connectionSummary.connectionID, selectedEntities: newSelectedEntities, redirectRoute: '/transfer-data/inbound/authentication' })
        );
        this.goToAuthenticationPage();
      } else if (hasRemovedEntities) {
        this.store.dispatch(new fromEntitySelectionActions.OpenRemoveEntityModal(true));
      }
    } else {
      this.goToAuthenticationPage();
      this.router.navigate(['/transfer-data/inbound/authentication']);
    }
  }

  checkForSelectedEntity() {
    return this.providerSupportedEntities.filter(p => p.isChecked).length > 0;
  }

  proceedBackToProviderSelection() {
    this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.SelectTransferMethod));
    this.router.navigate(['/transfer-data/inbound/vendor']);
  }

  goToAuthenticationPage() {
    this.store.dispatch(new fromTransferDataPageActions.ProceedToAuthentication(this.providerSupportedEntities));
  }

  onRemoveEntityModalOk() {
    let deactivateRedirectRoute = '/';
    const payload = PayfactorsApiModelMapper.mapSelectedEntityChoicesToOrgDataEntityTypes(this.providerSupportedEntities);
    const previousPayload = PayfactorsApiModelMapper.mapSelectedEntityChoicesToOrgDataEntityTypes(this.previousProviderSupportedEntities);

    const entitiesToRemove = difference(previousPayload, payload);
    const needToAuthenticate = difference(payload, previousPayload).length >= 1;

    if (needToAuthenticate) {
      deactivateRedirectRoute = '/transfer-data/inbound/authentication';
    }

    this.store.dispatch(new fromEntitySelectionActions.DeactivateMappingForEntities({
      entityMappingsToRemove: entitiesToRemove,
      selectedEntities: payload,
      deactivateRedirectRoute: deactivateRedirectRoute
    }));
  }

  onRemoveEntityModalCancel() {
    this.store.dispatch(new fromEntitySelectionActions.OpenRemoveEntityModal(false));
  }

  handleRemoveEntityModalDismiss() {
    this.store.dispatch(new fromEntitySelectionActions.OpenRemoveEntityModal(false));
  }
}
