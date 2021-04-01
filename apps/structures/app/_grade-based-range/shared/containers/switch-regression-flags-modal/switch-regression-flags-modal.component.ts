import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models';
import { SwitchRegressionFlagsRequest } from 'libs/models/payfactors-api';
import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromSwitchRegressionFlagsReducer from '../../reducers';
import * as fromSwitchRegressionFlagsActions from '../../actions/switch-regression-flags-modal.actions';
import { GradePoint } from '../../models';


@Component({
  selector: 'pf-switch-regression-flags-modal',
  templateUrl: './switch-regression-flags-modal.component.html',
  styleUrls: ['./switch-regression-flags-modal.component.scss']
})
export class SwitchRegressionFlagsModalComponent implements OnInit, OnDestroy {

  @Input() rangeGroupId: number;
  modalOpen$: Observable<boolean>;
  switchingRegressionFlagsAsyncObj$: Observable<AsyncStateObj<null>>;
  gradePoints$: Observable<GradePoint[]>;
  gradePointSubscription: Subscription;
  gradePoints: GradePoint[];
  selectedGradePoint: GradePoint;
  showAll: boolean;
  selectAllFlag: boolean;

  constructor(public store: Store<fromSwitchRegressionFlagsReducer.State>) {
    this.modalOpen$ = this.store.pipe(select(fromSwitchRegressionFlagsReducer.getSwitchRegressionFlagsModalOpen));
    this.switchingRegressionFlagsAsyncObj$ = this.store.pipe(select(fromSwitchRegressionFlagsReducer.getSwitchRegressionFlagsAsyncObj));
    this.gradePoints$ = this.store.pipe(select(fromSwitchRegressionFlagsReducer.getGradePoints));
  }

  // Events
  handleSwitch() {
    const request: SwitchRegressionFlagsRequest = { CompanyStructuresRangeGroupId: this.rangeGroupId,
      CompanyJobStructuresIds: this.gradePoints.filter(gp => gp.Selected).map(gp => gp.CompanyJobsStructuresId) };
    this.store.dispatch(new fromSwitchRegressionFlagsActions.SwitchRegressionFlags(request));
  }

  ngOnInit(): void {
    this.gradePointSubscription = this.gradePoints$.subscribe(gps => {
      if (gps) {
        this.gradePoints = cloneDeep(gps).sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
        this.selectedGradePoint = gps[0];
      }
    });
    this.showAll = false;
    this.selectAllFlag = false;
  }

  handleDismiss() {
    this.store.dispatch(new fromSwitchRegressionFlagsActions.CloseModal());
    this.showAll = false;
    this.selectAllFlag = false;
  }

  selectAll() {
    this.selectAllFlag = !this.selectAllFlag;
    const gradePointsCopy = cloneDeep(this.gradePoints);
    gradePointsCopy.forEach(gp => gp.Selected = this.selectAllFlag);
    this.gradePoints = gradePointsCopy;
  }

  selectGradePoint(companyJobsStructuresId: number) {
    const currentGp = this.gradePoints.find(gp => gp.CompanyJobsStructuresId === companyJobsStructuresId);
    currentGp.Selected = !currentGp.Selected;
  }

  ngOnDestroy(): void {
    this.gradePointSubscription?.unsubscribe();
  }



}
