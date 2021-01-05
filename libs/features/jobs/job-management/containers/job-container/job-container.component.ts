import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { CompanyJobUdf } from 'libs/models';
import { NotesManagerComponent } from 'libs/features/notes/notes-manager/notes-manager/notes-manager.component';
import { ApiServiceType } from 'libs/features/notes/notes-manager/constants/api-service-type-constants';

import * as fromJobManagementActions from '../../actions';
import * as fromNotesManagerActions from '../../../../notes/notes-manager/actions';
import * as fromJobManagementReducer from '../../reducers';

import { StandardFieldsComponent } from '../standard-fields/standard-fields.component';
import { JobAttachmentsComponent } from '../job-attachments/job-attachments.component';


enum JobManagementTabs {
  StandardFields = 'StandardFields',
  UserDefinedFields = 'UserDefinedFields',
  Attachments = 'Attachments',
  Structures = 'Structures',
  Notes = 'Notes'
}

@Component({
  selector: 'pf-job-container',
  templateUrl: './job-container.component.html',
  styleUrls: ['./job-container.component.scss']
})
export class JobContainerComponent implements OnInit, OnChanges, OnDestroy {
  // TODO: NgbTabset is deprecated. We should use NgbNav instead.
  @Input() jobId: number;

  @ViewChild('standardFieldsComponent') standardFieldsComponent: StandardFieldsComponent;
  @ViewChild('attachmentsComponent') attachmentsComponent: JobAttachmentsComponent;
  @ViewChild('jobsTabs') jobsTabs: NgbTabset;
  @ViewChild(NotesManagerComponent) notesManager: NotesManagerComponent;

  notesApiServiceType: ApiServiceType;

  loading$: Observable<boolean>;
  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;

  resetStateSubscription: Subscription;
  saveNotesSuccessSubscription: Subscription;
  saveNotesErrorSubscription: Subscription;
  resetNotesSubscription: Subscription;

  jobManagementTabs = JobManagementTabs;

  constructor(private store: Store<fromJobManagementReducer.State>, private actionsSubject: ActionsSubject) {
    this.saveNotesSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.SAVE_NOTES_SUCCESS))
      .subscribe(data => {
        if (data['apiServiceType'] === ApiServiceType.CompanyJobs) {
          this.store.dispatch(new fromJobManagementActions.SaveCompanyJobSuccess());
        }
      });

    this.saveNotesErrorSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.SAVE_NOTES_ERROR))
      .subscribe(data => {
        if (data['payload'] === ApiServiceType.CompanyJobs) {
          this.store.dispatch(new fromJobManagementActions.HandleApiError('There was an error saving your job notes.'));
        }
      });

    this.resetNotesSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.RESET_STATE))
      .subscribe(data => {
        this.notesApiServiceType = null;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.jobId?.currentValue) {
      this.notesApiServiceType = ApiServiceType.CompanyJobs;
    }
  }

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
    this.resetStateSubscription?.unsubscribe();
    this.saveNotesSuccessSubscription?.unsubscribe();
    this.saveNotesErrorSubscription?.unsubscribe();
    this.resetNotesSubscription?.unsubscribe();
  }

  tabChange() {
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
