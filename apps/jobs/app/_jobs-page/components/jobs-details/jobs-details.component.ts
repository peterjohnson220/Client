import {Component, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy, OnInit} from '@angular/core';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent implements OnDestroy, OnInit {

  @Input() jobDetailsFilters: PfDataGridFilter[];

  @Output() onClose = new EventEmitter();
  @Output() tabChanged = new EventEmitter();
  selectedRecordSubscription: Subscription;
  viewLoadedPricingDetailsSubscription: Subscription;
  viewLoadedEmployeesSubscription: Subscription;
  viewLoadedStructuresSubscription: Subscription;
  viewLoadedProjectsSubscription: Subscription;
  viewLoadedHistorySubscription: Subscription;
  tabStatusLoaded = {};
  tabStatusOpened = {};
  activeTab: string;
  tabPageViewIds = {
    PricingDetails: '86870F9F-C148-4626-92DE-C2B73B6E0D35',
    Employees: '12147D19-592A-44AF-9696-7F5347873D5E',
    Structures: '36FE36BF-A348-49DE-8511-B0DE46F52BDB',
    Projects: 'C029F3C2-0FBC-4E1F-96A1-611879E2B2A2',
    History: 'c4c03aff-4164-4a47-800f-97f0fee46623',
    Jobs: '705B7FE1-42AB-4B57-A414-764E52981160',
  };

  constructor(private store: Store<fromPfGridReducer.State>) {
    this.selectedRecordSubscription = this.store.select(fromPfGridReducer.getSelectedRecordId, this.tabPageViewIds.Jobs).subscribe(() => {
        this.tabStatusLoaded = {};
        this.tabStatusOpened = {};
        if (this.activeTab) {
          this.tabStatusOpened[this.activeTab] = true;
        }
      }
    );
    this.viewLoadedPricingDetailsSubscription = this.store.select(fromPfGridReducer.getLoading, this.tabPageViewIds['PricingDetails']).subscribe((o) => {
      this.tabStatusLoaded['PricingDetails'] = !o ;
  });
    this.viewLoadedEmployeesSubscription = this.store.select(fromPfGridReducer.getLoading, this.tabPageViewIds['Employees']).subscribe((o) => {
      this.tabStatusLoaded['Employees'] = !o ;
    });
    this.viewLoadedStructuresSubscription = this.store.select(fromPfGridReducer.getLoading, this.tabPageViewIds['Structures']).subscribe((o) => {
      this.tabStatusLoaded['Structures'] = !o ;
    });
    this.viewLoadedProjectsSubscription = this.store.select(fromPfGridReducer.getLoading, this.tabPageViewIds['Projects']).subscribe((o) => {
      this.tabStatusLoaded['Projects'] = !o ;
    });
    this.viewLoadedHistorySubscription = this.store.select(fromPfGridReducer.getLoading, this.tabPageViewIds['History']).subscribe((o) => {
      this.tabStatusLoaded['History'] = !o ;
    });
  }

  close() {
    this.onClose.emit(null);
  }

  tabChange(event: any) {
    if (this.tabPageViewIds[event.nextId]) {
      this.tabChanged.emit(this.tabPageViewIds[event.nextId]);
    }
    this.activeTab = event.nextId;
    if (!this.tabStatusOpened[this.activeTab]) {
      this.tabStatusOpened[this.activeTab] = true;
    } else if (!this.tabStatusLoaded[this.activeTab]) {
      this.tabStatusOpened[this.activeTab] = false;
      // Need to have timeout before putting it back to true so UI can react on change and reload the component
      setTimeout(() => this.tabStatusOpened[this.activeTab] = true, 0);
    }
  }
  ngOnInit() {
    this.activeTab = 'PricingDetails';
    this.tabStatusOpened[this.activeTab] = true;
  }
  ngOnDestroy() {
    this.selectedRecordSubscription.unsubscribe();
    this.viewLoadedEmployeesSubscription.unsubscribe();
    this.viewLoadedStructuresSubscription.unsubscribe();
    this.viewLoadedProjectsSubscription.unsubscribe();
    this.viewLoadedHistorySubscription.unsubscribe();
    this.viewLoadedPricingDetailsSubscription.unsubscribe();
  }
}
