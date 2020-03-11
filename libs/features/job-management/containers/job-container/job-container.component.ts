import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobFormComponent } from '../job-form/job-form.component';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { JobAttachmentsComponent } from '../job-attachments/job-attachments.component';

enum JobManagementTabs {
  JobFields = 'JobFields',
  Attachments = 'Attachments',
}

@Component({
  selector: 'pf-job-container',
  templateUrl: './job-container.component.html',
  styleUrls: ['./job-container.component.scss']
})
export class JobContainerComponent implements OnInit, OnDestroy {

  @ViewChild('jobFormComponent', { static: false }) jobFormComponent: JobFormComponent;
  @ViewChild('attachmentsComponent', { static: false }) attachmentsComponent: JobAttachmentsComponent;
  @ViewChild('jobsTabs', { static: false }) jobsTabs: NgbTabset;

  loading$: Observable<boolean>;
  showJobModal$: Observable<boolean>;

  onShowFormSubscription: Subscription;

  jobManagementTabs = JobManagementTabs;

  constructor(private store: Store<fromJobManagementReducer.State>) {
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.showJobModal$ = this.store.select(fromJobManagementReducer.getShowJobModal);
  }

  ngOnInit() {
    this.onShowFormSubscription = this.showJobModal$.subscribe(value => {
      if (this.jobsTabs) {
        this.jobsTabs.select(JobManagementTabs.JobFields);
      }
    });
  }

  ngOnDestroy() {
    this.onShowFormSubscription.unsubscribe();
  }

  tabChange(event: any) {
    this.attachmentsComponent.errorMessage = '';
  }

  submit(): void {
    this.jobFormComponent.jobForm.markAllAsTouched();

    if (!this.jobFormComponent.jobForm.valid) {
      this.jobsTabs.select(JobManagementTabs.JobFields);
    } else {
      this.store.dispatch(new fromJobManagementActions.SaveCompanyJob());
    }
  }

}
