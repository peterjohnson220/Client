// angular core
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

// 3rd party
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

// Payfactors
import { GridTypeEnum } from '../../../../../models/common';
import { InputDebounceComponent } from '../../../../../forms/components/input-debounce';
import * as fromCompanyJobsReducer from '../../reducers';
import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';

@Component({
  selector: 'pf-peer-job-association-company-jobs',
  templateUrl: './company-jobs.component.html',
  styleUrls: ['./company-jobs.component.scss']
})
export class CompanyJobsComponent implements OnInit, OnDestroy {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(InputDebounceComponent) public companyJobSearchComponent: InputDebounceComponent;
  @ViewChild(GridComponent) public grid: GridComponent;

  companyJobsGridItemsData$: Observable<GridDataResult>;
  totalCompanyJobsGridItems$: Observable<number>;
  gridState$: Observable<State>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  searchTerm;
  searchTermSubscription: Subscription;

  constructor(private store: Store<fromCompanyJobsReducer.State>) {}

  ngOnInit() {
    this.companyJobsGridItemsData$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsData);
    this.totalCompanyJobsGridItems$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsTotal);
    this.gridState$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsGridState);
    this.loading$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsLoading);
    this.loadingError$ = this.store.select(fromCompanyJobsReducer.getCompanyJobsLoadingError);
    this.searchTermSubscription = this.store.select(fromCompanyJobsReducer.getCompanyJobsSearchTerm).subscribe(
      (searchTerm) => this.searchTerm = searchTerm
    );
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  reload(resetSearchTerm = false): void {
    // if this is invoked from an empty search results grid reset the term, otherwise keep the term as is and reload
    if (resetSearchTerm) {
      this.companyJobSearchComponent.clearValue();
    } else {
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  public showTooltip(e: any): void {
    if (e.target.offsetWidth < e.target.scrollWidth) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  handleDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.JobAssociationModalCompanyJobs, state));
    this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
  }

  handleSearchChanged(searchTerm: string) {
    this.store.dispatch(new companyJobsActions.SearchTermUpdated(searchTerm));
    if (!searchTerm  || searchTerm.length > 1) {
      this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }
  }

  handleDetailExpand(event: any): void {
    // determine how many results we have in the grid
    const gridData = this.grid.data as any;
    const totalRows = gridData.data.length;

    // collapse all rows that are not the newly expanded row so we only have one detail open at a time
    for (let i = 0; i < totalRows; i++) {
      if (i !== event.index) {
        this.grid.collapseRow(i);
      }
    }
  }

  ngOnDestroy() {
    this.searchTermSubscription.unsubscribe();
  }
}

