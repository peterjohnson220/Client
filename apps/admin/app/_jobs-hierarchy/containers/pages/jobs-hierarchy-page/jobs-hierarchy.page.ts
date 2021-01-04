import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobLevelHierarchy, JobLevelHierarchyDetail } from 'libs/models';

import { environment } from 'environments/environment';
import * as fromJobsHierarchyActions from '../../../actions/jobs-hierarchy.actions';
import * as fromJobsHierarchyReducer from '../../../reducers';

@Component({
  selector: 'pf-jobs-hierarchy.page',
  templateUrl: './jobs-hierarchy.page.html',
  styleUrls: ['./jobs-hierarchy.page.scss']
})
export class JobsHierarchyPageComponent implements OnInit, OnDestroy {
  env = environment;
  defaultItem: {Id: number, Name: string} = {Id: 0, Name: 'Create New Hierarchy'};
  selectedItem: {Id: number, Name: string};

  hierarchies$: Observable<JobLevelHierarchy[]>;
  selectedHierarchy$: Observable<JobLevelHierarchyDetail>;
  selectedHierarchySubscription: Subscription;

  constructor(private store: Store<fromJobsHierarchyReducer.State>) {
    this.hierarchies$ = this.store.select(fromJobsHierarchyReducer.getJobLevelHierachies);
    this.selectedHierarchy$ = this.store.select(fromJobsHierarchyReducer.getSelectedHierarchy);
  }

  ngOnInit() {
    this.selectedHierarchySubscription = this.selectedHierarchy$.subscribe(h => {
      if (!!h && h.HierarchyId > 0) {
        this.selectedItem = {Id: h.HierarchyId, Name: h.HierarchyName};
      } else {
        this.selectedItem = this.defaultItem;
      }
    });
    this.store.dispatch(new fromJobsHierarchyActions.GetJobFamilies());
    this.store.dispatch(new fromJobsHierarchyActions.GetAvailableJobLevels({selectedJobFamilies: [], hierarchyId: 0}));
    this.store.dispatch(new fromJobsHierarchyActions.GetJobLevelHierarchies());
  }

  ngOnDestroy() {
    this.selectedHierarchySubscription.unsubscribe();
  }

  public selectionChange(item: JobLevelHierarchy): void {
    if (item === this.defaultItem) {
      this.store.dispatch(new fromJobsHierarchyActions.ResetJobLevelHierarchyForm());
      this.store.dispatch(new fromJobsHierarchyActions.GetJobFamilies());
    } else {
      this.store.dispatch(new fromJobsHierarchyActions.GetJobFamiliesForHierarchy({hierarchyId: item.Id}));
    }
    this.store.dispatch(new fromJobsHierarchyActions.GetAvailableJobLevels({selectedJobFamilies: [], hierarchyId: item.Id}));
  }

}
