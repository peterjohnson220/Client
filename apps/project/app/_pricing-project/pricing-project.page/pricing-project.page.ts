import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

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
  @ViewChild('jobCode') jobCode: ElementRef;
  @ViewChild('jobCurrency') jobCurrency: ElementRef;

  project$: Observable<any>;
  projectId: number;
  pageViewId = PageViewIds.ProjectJobs;
  filter = [];
  colTemplates = {};
  constructor(private route: ActivatedRoute,
              private store: Store<fromPricingProjectReducer.State>) { }

  ngOnInit(): void {
    this.initRouterParams();
    this.project$ = this.store.select(fromPricingProjectReducer.getPricingProject);
    this.filter = [{
      SourceName: 'UserSession_ID',
      Operator: '=',
      Value: this.projectId
    }];
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitle },
      'Job_Code': { Template: this.jobCode },
      'Currency': { Template: this.jobCurrency }
    };
  }

  private initRouterParams(): void {
    this.projectId = this.route.snapshot.params.projectId;
  }
}
