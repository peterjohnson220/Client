import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from 'environments/environment';

import * as fromJobsHierarchyActions from '../../../actions/jobs-hierarchy.actions';
import * as fromJobsHierarchyReducer from '../../../reducers';

@Component({
  selector: 'pf-jobs-hierarchy.page',
  templateUrl: './jobs-hierarchy.page.html',
  styleUrls: ['./jobs-hierarchy.page.scss']
})
export class JobsHierarchyPageComponent implements OnInit {
  env = environment;
  hierarchyList = [];

  constructor(private store: Store<fromJobsHierarchyReducer.State>) { }

  ngOnInit() {
    this.store.dispatch(new fromJobsHierarchyActions.GetJobFamilies());

  }

}
