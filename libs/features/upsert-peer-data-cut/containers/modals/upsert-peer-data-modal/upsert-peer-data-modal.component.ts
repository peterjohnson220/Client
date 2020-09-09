import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {UpsertPeerDataCutModalConfiguration} from '../../../models';

import * as fromUpsertPeerDataReducer from '../../../reducers';
import * as fromUpsertPeerDataActions from '../../../actions';
import * as fromPeerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import {ActionsSubject, Store} from '@ngrx/store';
import {ofType} from '@ngrx/effects';
import {UpsertPeerDataCutComponent} from '../../../upsert-peer-data-cut/upsert-peer-data-cut.component';

import * as fromSingledActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromChildFilterActions from 'libs/features/search/actions/child-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import {UpsertPeerDataCutEntityConfigurationModel} from '../../../models/upsert-peer-data-cut-entity-configuration.model';


@Component({
  selector: 'pf-upsert-peer-data-modal',
  templateUrl: './upsert-peer-data-modal.component.html',
  styleUrls: ['./upsert-peer-data-modal.component.scss']
})

export class UpsertPeerDataModalComponent implements OnDestroy, OnChanges {
  @Input() companyJobId: number;
  @Input() companyPayMarketId: number;
  @Input() isPayMarketOverride: boolean;
  @Input() cutGuid: string;
  @Input() entityConfiguration: UpsertPeerDataCutEntityConfigurationModel;
  @Output() cancelChanges = new EventEmitter();
  @ViewChild(UpsertPeerDataCutComponent, {static: true}) upsertPeerDataCutComponent: UpsertPeerDataCutComponent;

  showUpsertPeerModal = new BehaviorSubject<boolean>(false);
  showUpsertPeerModal$ = this.showUpsertPeerModal.asObservable();
  upsertPeerDataContextSubscription: Subscription;
  upsertPeerDataCutSaveSubscription: Subscription;
  mapVisible = false;
  dataLoading = false;

  constructor(private store: Store<fromUpsertPeerDataReducer.State>, private actionsSubject: ActionsSubject) {
    this.upsertPeerDataContextSubscription = this.actionsSubject
      .pipe(ofType(fromPeerMapActions.LOAD_PEER_MAP_DATA_SUCCESS))
      .subscribe(data => {
        this.dataLoading = false;
        this.mapVisible = true;
      });

    this.upsertPeerDataCutSaveSubscription = this.actionsSubject
      .pipe(ofType(fromUpsertPeerDataActions.UPSERT_DATA_CUT_SUCCESS))
      .subscribe(data => {
        if (this.entityConfiguration.BaseEntityId) {
          this.resetModal();
        }
      });
  }

  ngOnDestroy() {
    this.upsertPeerDataContextSubscription.unsubscribe();
    this.upsertPeerDataCutSaveSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    const entityConfigChanges = changes['entityConfiguration'];
    if (entityConfigChanges && entityConfigChanges.currentValue['BaseEntityId']) {
      this.showUpsertPeerModal.next(true);
      this.dataLoading = true;
    }
  }

  resetModal() {
    this.showUpsertPeerModal.next(false);
    this.dataLoading = false;

    this.store.dispatch(new fromSingledActions.Reset());
    this.store.dispatch(new fromChildFilterActions.Reset());
    this.store.dispatch(new fromSearchResultsActions.Reset());
    this.store.dispatch(new fromSearchPageActions.Reset());
    this.store.dispatch(new fromSearchFiltersActions.Reset());

    this.cancelChanges.emit();
  }
}
