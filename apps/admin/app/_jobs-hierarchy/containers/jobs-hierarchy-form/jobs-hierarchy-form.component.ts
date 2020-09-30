import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj } from 'libs/models/state';
import { JobLevelOrder, JobLevelHierarchyDetail } from 'libs/models';
import { HierarchyGroupingTypes } from 'libs/constants/structures/hierarchy-grouping-type';

import * as fromJobsHierarchyReducer from '../../reducers';
import { minSelectedCheckboxes, minControls } from '../../helpers';
import * as fromJobsHierarchyActions from '../../actions/jobs-hierarchy.actions';
import { JobLevelHierarchyDndService } from '../../services';


@Component({
  selector: 'pf-jobs-hierarchy-form',
  templateUrl: './jobs-hierarchy-form.component.html',
  styleUrls: ['./jobs-hierarchy-form.component.scss']
})
export class JobsHierarchyFormComponent implements OnInit, OnDestroy {
  readonly MAX_NAME_LENGTH = 50;

  groupingTypes = [HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL, HierarchyGroupingTypes.JOB_FAMILY, HierarchyGroupingTypes.JOB_LEVEL];
  defaultGroupingType: HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL;
  jobLevelHierarchyForm: FormGroup;
  selectedJobLevel: string;
  selectedJobLevelInHierarchy: string;
  jobLevelsInHierarchy: string[] = [];
  jobLevelsMasterList: string[] = [];
  jobLevels: string[] = [];
  jobFamilies: string[] = [];
  selectedHierarchy: JobLevelHierarchyDetail = {} as JobLevelHierarchyDetail;
  attemptedSubmit = false;

  jobFamilies$: Observable<AsyncStateObj<string[]>>;
  jobLevels$: Observable<AsyncStateObj<string[]>>;
  selectedHierarchy$: Observable<JobLevelHierarchyDetail>;
  shouldResetHierarchyForm$: Observable<boolean>;

  jobFamiliesSub: Subscription;
  selectableJobFamiliesListSub: Subscription;
  jobLevelsSub: Subscription;
  selectedHierarchySub: Subscription;
  shouldResetHierarchyFormSub: Subscription;

  get f() { return this.jobLevelHierarchyForm.controls; }

  get jobFamiliesFormArray() {
    return this.jobLevelHierarchyForm.controls.jobFamilies as FormArray;
  }

  get jobLevelsFormArray() {
    return this.jobLevelHierarchyForm.controls.jobLevels as FormArray;
  }

  get jobLevelsInHierarchyFormArray() {
    return this.jobLevelHierarchyForm.controls.jobLevelsInHierarchy as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromJobsHierarchyReducer.State>,
    private jobLevelHierarchyDndService: JobLevelHierarchyDndService,
  ) {

    this.jobFamilies$ = this.store.select(fromJobsHierarchyReducer.getJobFamilies);
    this.jobLevels$ = this.store.select(fromJobsHierarchyReducer.getJobLevels);
    this.selectedHierarchy$ = this.store.select(fromJobsHierarchyReducer.getSelectedHierarchy);
    this.shouldResetHierarchyForm$ = this.store.select(fromJobsHierarchyReducer.getResetHierarchyForm);
    this.buildForm();
  }

  buildForm() {
    this.jobLevelHierarchyForm = this.formBuilder.group({
      hierarchyName: [this.selectedHierarchy.HierarchyName, [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.MAX_NAME_LENGTH)]],
      groupingOrder: [HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL, PfValidators.required],
      jobFamilies: this.formBuilder.array([], minSelectedCheckboxes(1)),
      jobLevels: this.formBuilder.array([]),
      jobLevelsInHierarchy: this.formBuilder.array([], minControls(2))
    });
  }

  ngOnInit() {
    this.jobLevelHierarchyDndService.initDnD(() => {
      this.jobLevelsInHierarchyFormArray.clear();
      this.jobLevelsInHierarchy.forEach(() => this.jobLevelsInHierarchyFormArray.push(new FormControl(false)));
    });

    this.shouldResetHierarchyFormSub = this.shouldResetHierarchyForm$.subscribe(c => {
      if (c === true) {
        this.attemptedSubmit = false;
        this.jobFamiliesFormArray.clear();
        this.jobLevelsFormArray.clear();
        this.jobLevelsInHierarchyFormArray.clear();

        this.jobFamilies = [];
        this.jobLevels = [];
        this.jobLevelsInHierarchy = [];
        this.selectedHierarchy = {} as JobLevelHierarchyDetail;

        this.f['hierarchyName'].setValue('');
        this.f['groupingOrder'].setValue(HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL);

        this.store.dispatch(new fromJobsHierarchyActions.ResetJobLevelHierarchyFormSuccess());
      }
    });

    this.jobFamiliesSub = this.jobFamilies$.subscribe(f => {
      if (!!f && !!f.obj) {
        this.jobFamiliesFormArray.clear();
        this.jobFamilies = f.obj;
        this.jobFamilies.forEach(() => this.jobFamiliesFormArray.push(new FormControl(false)));
      }
    });

    this.jobLevelsSub = this.jobLevels$.subscribe(l => {
      if (!!l && !!l.obj) {
        this.jobLevelsFormArray.clear();
        this.jobLevels = l.obj;
        this.jobLevels = this.jobLevels.filter(item => !this.jobLevelsInHierarchy.includes(item));
        this.jobLevels.forEach(() => this.jobLevelsFormArray.push(new FormControl(false)));
      }
    });

    this.selectedHierarchySub = this.selectedHierarchy$.subscribe(h => {
      if (!!h && h.HierarchyId > 0) {
        this.selectedHierarchy = h;

        this.jobFamilies.forEach((f, index) => {
          if (this.selectedHierarchy.JobFamilies.includes(f)) {
            this.jobFamiliesFormArray.controls[index].setValue(true);
          } else {
            this.jobFamiliesFormArray.controls[index].setValue(false);
          }
        });

        if (this.selectedHierarchy.JobLevel.length > 0) {
          this.jobLevelsFormArray.clear();
          this.jobLevelsInHierarchyFormArray.clear();

          this.jobLevelsInHierarchy = this.selectedHierarchy.JobLevel.map(c => c.JobLevel);
          this.jobLevels = this.jobLevels.filter(item => !this.jobLevelsInHierarchy.includes(item));

          this.jobLevels.forEach(() => {
            this.jobLevelsFormArray.push(new FormControl(false));
          });

          this.jobLevelsInHierarchy.forEach(() => {
            this.jobLevelsInHierarchyFormArray.push(new FormControl(false));
          });
        }

        this.f['hierarchyName'].setValue(this.selectedHierarchy.HierarchyName);
        this.f['groupingOrder'].setValue(this.selectedHierarchy.GroupingOrder);
      }
    });

    this.buildForm();
  }

  ngOnDestroy() {
    this.selectableJobFamiliesListSub.unsubscribe();
    this.jobLevelsSub.unsubscribe();
    this.jobFamiliesSub.unsubscribe();
    this.selectedHierarchySub.unsubscribe();
    this.shouldResetHierarchyFormSub.unsubscribe();
    this.jobLevelHierarchyDndService.destroyDnD();
  }

  submit() {
    this.attemptedSubmit = true;

    if (this.jobLevelHierarchyForm.valid) {
      this.attemptedSubmit = false;
      this.store.dispatch(new fromJobsHierarchyActions.SaveJobLevelHierarchy({jobLevelHierarchy: this.mapJobLevelHierarchy()}));
    }
  }

  applyToHierarchy() {
    const selectedJobLevels = this.jobLevelHierarchyForm.value.jobLevels
      .map((checked, i) => checked ? this.jobLevels[i] : null)
      .filter(v => v !== null);

    selectedJobLevels.map(c => this.jobLevelsInHierarchy.push(c));
    this.jobLevelsInHierarchyFormArray.clear();
    this.jobLevelsInHierarchy.forEach(() => this.jobLevelsInHierarchyFormArray.push(new FormControl(false)));

    this.jobLevels = this.jobLevels.filter(item => this.jobLevelsInHierarchy.indexOf(item) < 0);
    this.jobLevelsFormArray.clear();
    this.jobLevels.forEach(() => this.jobLevelsFormArray.push(new FormControl(false)));
  }

  removeFromHierarchy() {
    const selectedJobLevelsInHierarchy = this.jobLevelHierarchyForm.value.jobLevelsInHierarchy
      .map((checked, i) => checked ? this.jobLevelsInHierarchy[i] : null)
      .filter(v => v !== null);

      selectedJobLevelsInHierarchy.map(c => this.jobLevels.push(c));

      this.jobLevelsFormArray.clear();

      this.jobLevels.forEach(() => this.jobLevelsFormArray.push(new FormControl(false)));
      this.jobLevelsInHierarchy = this.jobLevelsInHierarchy.filter(item => selectedJobLevelsInHierarchy.indexOf(item) < 0);
      this.jobLevelsInHierarchyFormArray.clear();
      this.jobLevelsInHierarchy.forEach(() => this.jobLevelsInHierarchyFormArray.push(new FormControl(false)));
  }

  onJobFamilySelectionChange(target) {
    const selectedJobFamilies = this.jobLevelHierarchyForm.value.jobFamilies
      .map((checked, i) => checked ? this.jobFamilies[i] : null)
      .filter(v => v !== null);
    this.store.dispatch(new fromJobsHierarchyActions.GetAvailableJobLevels({
      selectedJobFamilies: selectedJobFamilies,
      hierarchyId: this.selectedHierarchy.HierarchyId ?? 0
    }));
  }

  onJobLevelSelectionChange(selection: HTMLOptionsCollection) {
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].selected === true) {
        this.jobLevelsFormArray.controls[i].setValue(true);
      } else {
        this.jobLevelsFormArray.controls[i].setValue(false);
      }
   }
  }

  onJobLevelsInHierarchySelectionChange(selection: HTMLOptionsCollection) {
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].selected === true) {
        this.jobLevelsInHierarchyFormArray.controls[i].setValue(true);
      } else {
        this.jobLevelsInHierarchyFormArray.controls[i].setValue(false);
      }
    }
  }

  mapJobLevelHierarchy(): JobLevelHierarchyDetail {
    const selectedJobFamilies = this.jobLevelHierarchyForm.value.jobFamilies
    .map((checked, i) => checked ? this.jobFamilies[i] : null)
    .filter(v => v !== null);

    const jobLevelsWithOrder: JobLevelOrder[] = [];
    this.jobLevelsInHierarchy.forEach((value, index) => {
      const level = {} as JobLevelOrder;
      level.JobLevel = value;
      level.Order = index;
      jobLevelsWithOrder.push(level);
    });

    const form = this.jobLevelHierarchyForm.value;
    const jobLevelHierarchy: JobLevelHierarchyDetail = {} as JobLevelHierarchyDetail;
    jobLevelHierarchy.HierarchyName = form.hierarchyName;
    jobLevelHierarchy.GroupingOrder = form.groupingOrder;
    jobLevelHierarchy.JobFamilies = selectedJobFamilies;
    jobLevelHierarchy.JobLevel = jobLevelsWithOrder;

    if (!!this.selectedHierarchy) {
      jobLevelHierarchy.HierarchyId = this.selectedHierarchy.HierarchyId;
    }

    return jobLevelHierarchy;
  }

}
