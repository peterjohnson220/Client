import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as fromSharedGroupAction from 'libs/features/jobs/job-description-management/actions';
import * as fromSharedGroupReducer from 'libs/features/jobs/job-description-management/reducers';
import { WorkflowTemplate } from 'libs/features/jobs/job-description-management/models';
import * as fromGroupReducer from '../../reducers';

@Component({
  selector: 'pf-collaboration-workflows-upsert-modal',
  templateUrl: './collaboration-workflows-upsert-modal.component.html',
  styleUrls: ['./collaboration-workflows-upsert-modal.component.scss']
})
export class CollaborationWorkflowsUpsertModalComponent implements OnInit, OnDestroy {
  @ViewChild('saveGroupTemplateModal', {static: true}) public saveGroupTemplateModal: any;
  @Input() groupTemplateNames: string[];

  private modalRef: NgbModalRef;
  private editing = false;
  private stepsDirty = false;
  private existingName = '';
  private groupSaveObj: WorkflowTemplate = null;
  private groupTemplateForm: FormGroup;
  private errorMessage: string;

  // Observables
  groupSaveObj$: Observable<WorkflowTemplate>;
  saving$: Observable<boolean>;
  savingSuccess$: Observable<boolean>;
  savingError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;

  get groupName() { return (this.groupTemplateForm.get('groupName')); }

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private store: Store<fromGroupReducer.State>,
              private sharedStore: Store<fromSharedGroupReducer.State>) {

    this.groupSaveObj$ = this.store.pipe(select(fromGroupReducer.getTemplateSaveObj));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  handlePickerSelection(selectedUser: any): void {
     this.store.dispatch(new fromSharedGroupAction.SelectCollaborationWorkflowUserOrEmail(selectedUser));
  }

  open(groupTemplate: WorkflowTemplate = null) {
    this.editing = groupTemplate !== null;
    this.existingName = this.editing ? groupTemplate.Name : '';
    this.buildForm();

    this.modalRef = this.modalService.open(this.saveGroupTemplateModal, { backdrop: 'static', windowClass: 'collaboration-workflows-upsert-modal' });
  }

  close() {
    this.store.dispatch(new fromSharedGroupAction.ResetCollaborationWorkflow());
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  buildForm(): void {
    this.groupTemplateForm = this.formBuilder.group({
      'groupName': ['', [Validators.required, this.notBlackListed().bind(this)]]}
    );
    if (this.editing) {
      this.groupTemplateForm.setValue({groupName: this.existingName});
    }
  }

  saveGroupTemplate() {
    const groupName = this.groupTemplateForm.value.groupName;

    const modalDirty = this.existingName !== groupName || this.stepsDirty;
    if (!this.groupTemplateForm.valid || !modalDirty) {
      return;
    }
  }

  notBlackListed() {
    return function(c: FormControl) {
      const blackList = this.groupTemplateNames ? this.groupTemplateNames.filter(n => n !== this.existingName).map(n => n.toLowerCase()) : [];
      const blackListed = blackList && c.value ? !!blackList.find(bl => bl === c.value.toLowerCase()) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }
}
