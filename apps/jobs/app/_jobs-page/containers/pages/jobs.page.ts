import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { PfGridApiService } from 'libs/data/payfactors-api/pf-grid/pf-grid-api.service';
import { PfGridColumnModel } from 'libs/models/common/pf-grid';
import { Company, CompanyJob } from 'libs/models/company';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromJobsPageActions from '../../actions/jobs-page.actions';
import * as fromJobsPageReducer from '../../reducers';




@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, OnDestroy, AfterViewInit {
  company$: Observable<Company>;
  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;
  companyId: number;
  testPayMarketData = ['Boston', 'Chicago', 'Los Angeles'];
  columnSubscription: Subscription;
  columns: PfGridColumnModel[];
  activeColumns: PfGridColumnModel[] = [];

  @ViewChild('complexColumn', {static: false}) complexColTemplate: ElementRef;
  @ViewChild('complexColumn2', {static: false}) complexColTemplate2: ElementRef;
  colTemplates = {};

  constructor(private store: Store<fromJobsPageReducer.State>,
              private route: ActivatedRoute,
              private gridApiService: PfGridApiService) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
  }

  // Lifecycle
  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      this.companyId = uc.CompanyId;
    });
    this.store.dispatch(new fromJobsPageActions.LoadCompany(this.companyId));
    this.columnSubscription = this.gridApiService.getDefaultColumns('Job').subscribe(c => {
      this.columns = c;
      this.setActiveColumns(c);
    });
  }

  ngAfterViewInit() {
      this.colTemplates = {
        'Complex_Col': this.complexColTemplate,
        'Complex_Col2': this.complexColTemplate2
      };
  }

  ngOnDestroy(): void {
    this.userContextSubscription.unsubscribe();
    this.columnSubscription.unsubscribe();
  }

  // Column Selection

  setActiveColumns(gridColumns: PfGridColumnModel[]) {
    this.activeColumns = gridColumns.filter(c => c.Visible);
  }
}
