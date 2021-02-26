import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {SortDescriptor} from '@progress/kendo-data-query';

import {GridConfig} from 'libs/features/grids/pf-data-grid/models';

import {PageViewIds} from '../../shared/constants';
import * as fromPricingProjectActions from '../actions';
import * as fromPricingProjectReducer from '../reducers';




@Component({
  selector: 'pf-pricing-project',
  templateUrl: './pricing-project.page.html',
  styleUrls: ['./pricing-project.page.scss']
})
export class PricingProjectPageComponent implements OnInit, AfterViewInit {

  @ViewChild('jobTitle') jobTitle: ElementRef;

  project$: Observable<any>;
  projectId: number;
  pageViewId = PageViewIds.ProjectJobs;
  filter = [];
  colTemplates = {};
  gridConfig: GridConfig;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Job_Title'
  }, {
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_PayMarket'
  }];  constructor(private route: ActivatedRoute,
              private store: Store<fromPricingProjectReducer.State>) {
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
  }

  ngOnInit(): void {
    this.initRouterParams();
    this.project$ = this.store.select(fromPricingProjectReducer.getPricingProject);
    this.filter = [{
      SourceName: 'UserSession_ID',
      Operator: '=',
      Values: [this.projectId]
    }];
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitle }
    };
  }

  private initRouterParams(): void {
    this.projectId = this.route.snapshot.params.projectId;
  }
}
