import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { WorkflowTemplate } from 'libs/features/jobs/job-description-management/models';

import * as fromWorkflowReducer from '../../reducers';
import * as fromWorkflowAction from '../../actions';

@Component({
  selector: 'pf-routing-workflows-delete-modal',
  templateUrl: './routing-workflows-delete-modal.component.html',
  styleUrls: ['./routing-workflows-delete-modal.component.scss']
})
export class RoutingWorkflowsDeleteModalComponent implements OnInit, OnDestroy {

  workflowId: string;
  public deleteTemplateForm: FormGroup;
  public errorValidationMessage: string;

  // Observables
  templateToBeDeleted$: Observable<WorkflowTemplate>;
  deleteModalOpen$: Observable<boolean>;
  deleting$: Observable<boolean>;
  deletingError$: Observable<boolean>;
  deletingErrorMessage$: Observable<string>;

  // Subscriptions
  deleteModalOpenSubscription: Subscription;
  templateToBeDeletedSubscription: Subscription;
  errorSubscription: Subscription;
  errorMessageSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private store: Store<fromWorkflowReducer.State>) {
    this.deleteModalOpen$ = this.store.pipe(select(fromWorkflowReducer.getDeleteModalOpen));
    this.templateToBeDeleted$ = this.store.pipe(select(fromWorkflowReducer.getTemplateToBeDeleted));
    this.deleting$ = this.store.pipe(select(fromWorkflowReducer.getDeleting));
    this.deletingError$ = this.store.pipe(select(fromWorkflowReducer.getDeletingError));
    this.deletingErrorMessage$ = this.store.pipe(select(fromWorkflowReducer.getDeletingErrorMsg));
    this.buildForm();
  }

  ngOnInit() {
    this.templateToBeDeletedSubscription = this.templateToBeDeleted$.subscribe((template) => {
      if (template) {
      this.workflowId = template.Id;
      }
    });

    this.deleteModalOpenSubscription = this.deleteModalOpen$.subscribe((isOpen) => {
      if (isOpen) {
        this.markFormGroupAsValid(this.deleteTemplateForm);
      }
    });

    this.errorMessageSubscription = this.deletingErrorMessage$.subscribe(em => this.errorValidationMessage = em);

    this.errorSubscription = this.deletingError$.subscribe(error => {
      if (error) {
        this.deleteTemplateForm.setErrors({'error': this.errorValidationMessage});
      }
    });
  }

  ngOnDestroy() {
    this.templateToBeDeletedSubscription.unsubscribe();
    this.deleteModalOpenSubscription.unsubscribe();
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  handleFormSubmit() {
    this.store.dispatch(new fromWorkflowAction.DeleteWorkflowTemplate({templateId: this.workflowId}));
  }

  handleModalDismissed() {
    this.store.dispatch(new fromWorkflowAction.CloseDeleteWorkflowTemplateModal());
  }

  buildForm() {
    this.deleteTemplateForm = this.formBuilder.group({});
    // PfModalFormComponent requires that form to be touched and valid to enabled the primary button
    this.markFormGroupAsValid(this.deleteTemplateForm);
  }

  markFormGroupAsValid(formGroup: FormGroup) {
    formGroup.reset();
    formGroup.markAllAsTouched();
    formGroup.markAsDirty();
  }

}
