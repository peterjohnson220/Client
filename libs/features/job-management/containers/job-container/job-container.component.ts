import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { CompanyJobUdf, NoteRequest } from 'libs/models';

import { NotesManagerConfiguration } from '../../../../models/notes';
import * as fromJobManagementActions from '../../actions';
import * as fromNotesManagerActions from '../../../notes-manager/actions';
import * as fromJobManagementReducer from '../../reducers';
import { StandardFieldsComponent } from '../standard-fields/standard-fields.component';
import { JobAttachmentsComponent } from '../job-attachments/job-attachments.component';
import { ApiServiceType } from '../../../notes-manager/constants/api-service-type-constants';
import { NotesManagerComponent } from '../../../notes-manager/notes-manager/notes-manager.component';

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
export class JobContainerComponent implements OnInit, OnDestroy, OnChanges {
  // TODO: NgbTabset is deprecated. We should use NgbNav instead.
  @Input() jobId: number;

  @ViewChild('standardFieldsComponent') standardFieldsComponent: StandardFieldsComponent;
  @ViewChild('attachmentsComponent') attachmentsComponent: JobAttachmentsComponent;
  @ViewChild('jobsTabs') jobsTabs: NgbTabset;
  @ViewChild(NotesManagerComponent) notesManager: NotesManagerComponent;

  loading$: Observable<boolean>;
  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;

  onShowFormSubscription: Subscription;
  resetStateSubscription: Subscription;
  saveNotesSuccessSubscription: Subscription;

  jobManagementTabs = JobManagementTabs;

  notesManagerConfiguration: NotesManagerConfiguration;

  noteRequestList: NoteRequest[] = [];

  constructor(private store: Store<fromJobManagementReducer.State>,
              private actionsSubject: ActionsSubject) {

    this.saveNotesSuccessSubscription = actionsSubject
      .pipe(ofType(fromNotesManagerActions.SAVE_NOTES_SUCCESS))
      .subscribe(data => {
        switch (data['payload']) {
          case ApiServiceType.CompanyJobs:
            this.store.dispatch(new fromJobManagementActions.SaveCompanyJobSuccess());
            this.store.dispatch(new fromNotesManagerActions.ClearNotes());
            break;
        }
      });

    this.notesManagerConfiguration = {
      ModalTitle: 'Company Job Notes',
      ShowModal$: null,
      IsEditable: true,
      NotesHeader: undefined,
      EntityId: undefined,
      PlaceholderText: 'To add notes to this job, fill out the area below, click Add and then Save.',
      ApiServiceIndicator: ApiServiceType.CompanyJobs
    };

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobId.currentValue !== undefined) {
      this.notesManagerConfiguration = {
        ModalTitle: 'Company Job Notes',
        ShowModal$: null,
        IsEditable: true,
        NotesHeader: undefined,
        EntityId: this.jobId,
        PlaceholderText: 'To add notes to this job, fill out the area below, click Add and then Save.',
        ApiServiceIndicator: ApiServiceType.CompanyJobs
      };
    }
  }

  ngOnDestroy() {
    this.onShowFormSubscription.unsubscribe();
    this.resetStateSubscription.unsubscribe();
    this.saveNotesSuccessSubscription.unsubscribe();
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
