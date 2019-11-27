import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AsyncStateObj } from 'libs/models/state';

import * as fromJobInfoViewEditorActions from '../../actions/job-info-view-editor.actions';
import * as fromViewEditReducer from '../../reducers';
import { JobInfoViewField } from '../../models';

@Component({
  selector: 'pf-job-info-view-editor',
  templateUrl: './job-info-view-editor.component.html',
  styleUrls: ['./job-info-view-editor.component.scss']
})
export class JobInfoViewEditorComponent implements OnInit, OnDestroy {
  jobInfoFieldsAsyncObj$: Observable<AsyncStateObj<JobInfoViewField[]>>;

  showFields = false;
  selectAll = false;
  jobInfoFieldsAsyncObj: AsyncStateObj<JobInfoViewField[]>;
  jobInfoFieldsAsyncObjSub: Subscription;

  constructor(
    private store: Store<fromViewEditReducer.State>
  ) {
    this.jobInfoFieldsAsyncObj$ = this.store.pipe(select(fromViewEditReducer.getJobInfoFieldsAsyncObj));
  }

  handleSelectAllClicked(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new fromJobInfoViewEditorActions.SetAllJobInfoViewFields({ checked: !this.selectAll }));
  }

  handleJobInfoViewFieldClicked(jobInfoViewField: JobInfoViewField) {
    if (jobInfoViewField.Locked) {
      return;
    }

    this.store.dispatch(new fromJobInfoViewEditorActions.ToggleJobInfoViewField(jobInfoViewField));
  }

  ngOnInit() {
    this.jobInfoFieldsAsyncObjSub = this.jobInfoFieldsAsyncObj$
      .pipe(
        filter(jif => jif.obj.length > 0)
      ).subscribe(ji => {
        this.jobInfoFieldsAsyncObj = ji;
        this.selectAll = ji.obj.every(j => j.Checked);
      });
  }

  ngOnDestroy(): void {
    this.jobInfoFieldsAsyncObjSub.unsubscribe();
    this.store.dispatch(new fromJobInfoViewEditorActions.Reset());
  }
}
