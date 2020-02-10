import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';

import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';

import {AsyncStateObj} from 'libs/models/state';
import {OrgDataEntityType} from 'libs/constants/hris-api';

import {ConnectionSummary, EntityChoice, EntityTypeModel, Provider} from '../../../models';
import {TransferDataWorkflowStep} from '../../../data';
import {PayfactorsApiModelMapper} from '../../../helpers';
import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromEntitySelectionActions from '../../../actions/entity-selection.actions';

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
  connectionSummary: ConnectionSummary;
  providerSupportedEntities: EntityChoice[] = [];

  currentWorkflowStep$: Observable<TransferDataWorkflowStep>;
  connectionSummary$: Observable<ConnectionSummary>;
  selectedProvider$: Observable<Provider>;
  pageSelections$: Observable<{ selections: EntityTypeModel[], providerSupportedEntities: EntityChoice[]}>;
  providerSupportedEntitiesObj$: Observable<AsyncStateObj<EntityChoice[]>>;
  updatedProviderSupportedEntitiesObj$: Observable<AsyncStateObj<OrgDataEntityType[]>>;
  connectionLoading$: Observable<boolean>;
  connectionLoadingError$: Observable<boolean>;
  shouldRedirect$: Observable<boolean>;

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
  }

  ngOnInit() {
    this.store.dispatch(new fromEntitySelectionActions.Init());

    this.connectionSummary$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(s => {
      this.connectionSummary = s;
      if (s.connectionID) {
        this.editMode = true;
        this.store.dispatch(new fromTransferDataPageActions.SetSelectedProvider(s.provider));
      }
    });
    this.selectedProvider$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(p => {
      this.store.dispatch(new fromEntitySelectionActions.LoadEntitySelection(p));
    });
    this.pageSelections$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(s => {
      if (this.editMode && this.connectionSummary) {
        this.providerSupportedEntities = PayfactorsApiModelMapper.mapEntityChoicesWithConnectionSummary(s.providerSupportedEntities, this.connectionSummary);
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
        takeUntil(this.unsubscribe$))
      .subscribe(s => {
        this.goToAuthenticationPage();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  cancelTransferDataWorkflow() {
    this.store.dispatch(new fromTransferDataPageActions.ResetTransferDataPageWorkflow());
  }

  proceedToAuthentication() {
    if (this.connectionSummary && this.connectionSummary.connectionID) {
      const payload = PayfactorsApiModelMapper.mapSelectedEntityChoicesToOrgDataEntityTypes(this.providerSupportedEntities);
      this.store.dispatch(new fromEntitySelectionActions.UpdateEntitySelections(
        { connectionId: this.connectionSummary.connectionID, selectedEntities: payload })
      );
    } else {
      this.goToAuthenticationPage();
    }
  }

  checkForSelectedEntity() {
    return this.providerSupportedEntities.filter(p => p.isChecked).length > 0;
  }

  proceedBackToProviderSelection() {
    this.store.dispatch(new fromTransferDataPageActions.UpdateWorkflowstep(TransferDataWorkflowStep.SelectTransferMethod));
    this.router.navigate(['/transfer-data']);
  }

  goToAuthenticationPage() {
    this.store.dispatch(new fromTransferDataPageActions.ProceedToAuthentication(this.providerSupportedEntities));
    this.router.navigate(['/transfer-data/inbound/authentication']);
  }
}
