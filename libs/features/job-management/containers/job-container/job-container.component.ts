import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CompanyJobUdf } from 'libs/models';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';

import { StandardFieldsComponent } from '../standard-fields/standard-fields.component';
import { JobAttachmentsComponent } from '../job-attachments/job-attachments.component';
import { ofType } from '@ngrx/effects';

enum JobManagementTabs {
  StandardFields = 'StandardFields',
  UserDefinedFields = 'UserDefinedFields',
  Attachments = 'Attachments',
  Structures = 'Structures'
}

@Component({
  selector: 'pf-job-container',
  templateUrl: './job-container.component.html',
  styleUrls: ['./job-container.component.scss']
})
export class JobContainerComponent implements OnInit, OnDestroy {

  @ViewChild('standardFieldsComponent') standardFieldsComponent: StandardFieldsComponent;
  @ViewChild('attachmentsComponent') attachmentsComponent: JobAttachmentsComponent;
  @ViewChild('jobsTabs') jobsTabs: NgbTabset;

  loading$: Observable<boolean>;
  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;

  onShowFormSubscription: Subscription;
  resetStateSubscription: Subscription;

  jobManagementTabs = JobManagementTabs;


  constructor(private store: Store<fromJobManagementReducer.State>, private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.loading$ = this.store.select(fromJobManagementReducer.getLoading);
    this.jobUserDefinedFields$ = this.store.select(fromJobManagementReducer.getCompanyJobUdfs);

    this.resetStateSubscription = this.actionsSubject
    .pipe(ofType(fromJobManagementActions.RESET_STATE))
    .subscribe(data => {
      if (this.jobsTabs) {
        this.jobsTabs.select(JobManagementTabs.StandardFields);
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
    this.standardFieldsComponent.jobForm.markAllAsTouched();

    if (this.standardFieldsComponent.isValid()) {
      this.store.dispatch(new fromJobManagementActions.SaveCompanyJob());
    } else {
      this.jobsTabs.select(JobManagementTabs.StandardFields);
    }
  }

}
