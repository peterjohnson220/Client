import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj } from 'libs/models/state';
import { SelectedJobFamily } from 'libs/models/jobs-hierarchy';
import { HierarchyGroupingTypes } from 'libs/constants/structures/hierarchy-grouping-type';

import * as fromJobsHierarchyReducer from '../../reducers';
import * as fromJobsHierarchyActions from '../../actions/jobs-hierarchy.actions';


@Component({
  selector: 'pf-jobs-hierarchy-form',
  templateUrl: './jobs-hierarchy-form.component.html',
  styleUrls: ['./jobs-hierarchy-form.component.scss']
})
export class JobsHierarchyFormComponent implements OnInit, OnDestroy {
  readonly MAX_NAME_LENGTH = 50;

  groupingTypes = [HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL, HierarchyGroupingTypes.JOB_FAMILY, HierarchyGroupingTypes.JOB_LEVEL];
  defaultGroupingType: HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL;
  createJobsHierarchyForm: FormGroup;
  selectableJobFamiliesList: SelectedJobFamily[];
  selectedJobLevel: string;
  selectedJobLevelInHierarchy: string;
  jobLevelsInHierarchy: string[];
  jobLevelsMasterList: string[];
  jobLevels: string[];

  jobFamilies$: Observable<AsyncStateObj<string[]>>;
  jobLevels$: Observable<AsyncStateObj<string[]>>;
  selectableJobFamiliesList$: Observable<SelectedJobFamily[]>;

  selectableJobFamiliesListSub: Subscription;
  jobLevelsSub: Subscription;

  get f() { return this.createJobsHierarchyForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromJobsHierarchyReducer.State>
  ) {

    this.jobFamilies$ = this.store.select(fromJobsHierarchyReducer.getJobFamilyDetails);
    this.jobLevels$ = this.store.select(fromJobsHierarchyReducer.getJobLevelsForJobFamiliesDetails);
    this.selectableJobFamiliesList$ = this.store.select(fromJobsHierarchyReducer.getSelectedJobFamiliesList);

    this.createJobsHierarchyForm = this.formBuilder.group({
      hierarchyName: ['', PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.MAX_NAME_LENGTH)],
      groupingOrder: ['', PfValidators.required],
      jobFamilies: [''],
      jobLevels: [''],
      jobLevelsInHierarchy: ['']
  });

  }

  ngOnInit() {
    this.jobLevelsInHierarchy = [];
    this.jobLevels = [];
    this.selectableJobFamiliesListSub = this.selectableJobFamiliesList$.subscribe(families => {
      this.selectableJobFamiliesList = families;
    });

    this.jobLevelsSub = this.jobLevels$.subscribe(levels => {
      this.jobLevelsMasterList = levels.obj;
      if (this.jobLevelsInHierarchy.length > 0) {
        this.jobLevelsInHierarchy.forEach(x => {
          if (this.jobLevelsMasterList.indexOf(x) === -1) {
            this.jobLevelsInHierarchy = this.jobLevelsInHierarchy.filter(y => y !== x);
          }
        });
      }
      this.jobLevels = this.jobLevelsMasterList.filter(item => this.jobLevelsInHierarchy.indexOf(item) < 0);
    });

    this.createJobsHierarchyForm.patchValue({groupingOrder: HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL});
  }

  ngOnDestroy() {
    this.selectableJobFamiliesListSub.unsubscribe();
    this.jobLevelsSub.unsubscribe();
  }

  updateJobFamiliesSelected(jobFamily: string, selected: boolean) {
    const updateSelectableJobFamilyList = [];
    this.selectableJobFamiliesList.forEach(f => {
      if ( f.JobFamily === jobFamily) {
        updateSelectableJobFamilyList.push({JobFamily: f.JobFamily, Selected: selected});
      } else {
        updateSelectableJobFamilyList.push(f);
      }
    });

    const selectedFamiliesCount = updateSelectableJobFamilyList.filter(x => x.Selected === true).length;
    if (selectedFamiliesCount === 0) {
      this.jobLevelsInHierarchy = [];
    }

    this.store.dispatch(new fromJobsHierarchyActions.SetJobFamilySelection(updateSelectableJobFamilyList));
  }

  applyToHierarchy() {
    this.jobLevelsInHierarchy.push(this.selectedJobLevel);
    this.jobLevels = this.jobLevels.filter(x => x !== this.selectedJobLevel);
    this.selectedJobLevel = '';
  }

  onJobLevelSelectionChange(selection) {
    this.selectedJobLevel = selection;
  }

  onJobLevelsInHierarchySelectionChange(selection) {
    this.selectedJobLevelInHierarchy = selection;
  }

  removeFromHierarchy() {
    this.jobLevels.push(this.selectedJobLevelInHierarchy);
    this.jobLevelsInHierarchy = this.jobLevelsInHierarchy.filter(x => x !== this.selectedJobLevelInHierarchy);
    this.selectedJobLevelInHierarchy = '';
  }

}
