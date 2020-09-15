import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BasicDataViewField } from 'libs/models/payfactors-api/reports/request';
import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { BasicGridSettings } from 'libs/features/basic-data-grid/models';
import * as fromBasicDataGridReducer from 'libs/features/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/basic-data-grid/actions/basic-data-grid.actions';

import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../reducers';
import { QuickPriceHistoryContext } from '../../models';

@Component({
  selector: 'pf-quick-price-history',
  templateUrl: './quick-price-history.component.html',
  styleUrls: ['./quick-price-history.component.scss']
})
export class QuickPriceHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  data$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;
  hasMoreDataOnServer$: Observable<boolean>;
  isQuickPriceHistoryOpen$: Observable<boolean>;
  isQuickPriceHistoryNoteDismissed$: Observable<boolean>;

  hasMoreDataOnServerSubscription: Subscription;
  isQuickPriceHistoryOpenSubscription: Subscription;

  @ViewChild('base50Column') base50Column: ElementRef;
  hasMoreDataOnServer: boolean;
  gridId = QuickPriceHistoryContext.gridId;
  gridSettings: BasicGridSettings = {
    Sortable: true
  };

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private settingsService: SettingsService
  ) {
    this.data$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, QuickPriceHistoryContext.gridId);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, QuickPriceHistoryContext.gridId);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, QuickPriceHistoryContext.gridId);
    this.hasMoreDataOnServer$ = this.basicGridStore.select(fromBasicDataGridReducer.getHasMoreDataOnServer, QuickPriceHistoryContext.gridId);
    this.isQuickPriceHistoryOpen$ = this.store.select(fromComphubMainReducer.getIsQuickPriceHistoryOpen);
    this.isQuickPriceHistoryNoteDismissed$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.CompHub, UiPersistenceSettingConstants.QuickPriceHistoryNoteDismissed
    );
  }

  ngOnInit(): void {
    this.hasMoreDataOnServerSubscription = this.hasMoreDataOnServer$.subscribe(value => this.hasMoreDataOnServer = value);
    this.isQuickPriceHistoryOpenSubscription = this.isQuickPriceHistoryOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(QuickPriceHistoryContext.gridId));
      }
    });
  }

  ngAfterViewInit(): void {
    const fieldTemplates = {
      'QuickPrice_CompletedPricingHistory_Base50': { Template: this.base50Column }
    };
    this.gridSettings = {
      ...this.gridSettings,
      FieldTemplates: fieldTemplates
    };
  }

  ngOnDestroy(): void {
    this.hasMoreDataOnServerSubscription.unsubscribe();
    this.isQuickPriceHistoryOpenSubscription.unsubscribe();
  }

  handleScrollBottom(): void {
    if (this.hasMoreDataOnServer) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(QuickPriceHistoryContext.gridId));
    }
  }

  close(): void {
    this.store.dispatch(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(false));
  }

  closeNote(): void {
    this.settingsService.updateUiPersistenceSettingValue<boolean>(
      FeatureAreaConstants.CompHub,
      UiPersistenceSettingConstants.QuickPriceHistoryNoteDismissed,
      'true');
  }

}
