import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSharedWorkflowReducer from '../../../../shared/reducers';
import { WorkflowTemplate, WorkflowStep } from '../../../../shared';

import * as fromWorkflowReducer from '../../reducers';
import * as fromWorkflowAction from '../../actions';

@Component({
  selector: 'pf-routing-workflows-upsert-modal',
  templateUrl: './routing-workflows-upsert-modal.component.html',
  styleUrls: ['./routing-workflows-upsert-modal.component.scss']
})
export class RoutingWorkflowsUpsertModalComponent implements OnInit, OnDestroy {

  upsertModalForm: FormGroup;
  templateBeingEdited: WorkflowTemplate = null;
  templateSaveObj: WorkflowTemplate = null;
  errorMessage: string;
  errorOccurred = false;
  private stepsDirty = false;
  private steps: WorkflowStep[];
  private workflowTemplateNames: string[];

  // Observables
  upsertModalOpen$: Observable<boolean>;
  templateBeingEdited$: Observable<WorkflowTemplate>;
  templateSaveObj$: Observable<WorkflowTemplate>;
  saving$: Observable<boolean>;
  savingError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;
  private workflowTemplateNames$: Observable<string[]>;
  private stepsDirty$: Observable<boolean>;
  private steps$: Observable<WorkflowStep[]>;

  // Subscription
  private templateSaveObjSubscription: Subscription;
  private templateToBeEditedSubscription: Subscription;
  private stepsSubscription: Subscription;
  private stepsDirtySubscription: Subscription;
  private savingErrorSubscription: Subscription;
  private savingErrorMessageSubscription: Subscription;

  get modalTitle(): string {
    return this.templateBeingEdited.Id !== null ? 'Edit Workflow' : 'Create Workflow';
  }

  get modalPrimaryButtonText(): string {
    return this.templateBeingEdited.Id !== null ? 'Update' : 'Create';
  }

  get modalPrimaryButtonTextSubmitting(): string {
    return this.templateBeingEdited.Id !== null ? 'Updating...' : 'Create...';
  }

  get workflowName() { return (this.upsertModalForm.get('workflowName')); }

  constructor(private formBuilder: FormBuilder,
    private store: Store<fromWorkflowReducer.State>,
    private sharedStore: Store<fromSharedWorkflowReducer.State>) {

    this.upsertModalOpen$ = this.store.pipe(select(fromWorkflowReducer.getUpsertModalOpen));
    this.templateSaveObj$ = this.store.pipe(select(fromWorkflowReducer.getTemplateSaveObj));
    this.templateBeingEdited$ = this.store.pipe(select(fromWorkflowReducer.getTemplateBeingEdited));
    this.workflowTemplateNames$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateNames));
    this.saving$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSaving));
    this.savingError$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSavingError));
    this.savingErrorMessage$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSavingErrorMessage));

    this.steps$ = this.sharedStore.pipe(select(fromSharedWorkflowReducer.getWorkflowStepsFromWorkflowConfig));
    this.stepsDirty$ = this.sharedStore.pipe(select(fromSharedWorkflowReducer.getWorkflowConfigDirty));

    this.buildForm();
  }

  ngOnInit() {
    this.templateSaveObjSubscription = this.templateSaveObj$.subscribe((template) => this.templateSaveObj = template);
    this.workflowTemplateNames$.subscribe((t) => this.workflowTemplateNames = t);
    this.stepsDirtySubscription = this.stepsDirty$.subscribe(d => this.stepsDirty = d);
    this.savingErrorMessageSubscription = this.savingErrorMessage$.subscribe((em) => this.errorMessage = em);

    this.templateToBeEditedSubscription = this.templateBeingEdited$.subscribe((template) => {
      this.templateBeingEdited = template;
      this.workflowName.setValue(template.Name);
    });
    this.stepsSubscription = this.steps$.subscribe((steps) => {
      this.steps = steps;
      if (this.templateBeingEdited.Id !== null &&
         (this.templateBeingEdited.Name !== this.workflowName.value || this.stepsDirty)) {
        // Enable Update button if the name or steps changed
        this.markFormGroupAsValid(this.upsertModalForm);
      }
      if (this.templateBeingEdited.Id === null) {
        this.validateWorkflowConfig();
      }
    });
    this.savingErrorSubscription = this.savingError$.subscribe((e) => {
      if (e) {
        this.workflowName.setErrors({'error': this.errorMessage});
      }
    });
  }

  ngOnDestroy() {
    this.templateSaveObjSubscription.unsubscribe();
    this.templateToBeEditedSubscription.unsubscribe();
    this.stepsDirtySubscription.unsubscribe();
    this.stepsSubscription.unsubscribe();
    this.savingErrorSubscription.unsubscribe();
    this.savingErrorMessageSubscription.unsubscribe();
  }

  buildForm(): void {
    this.upsertModalForm = this.formBuilder.group({
      'workflowName': ['', [Validators.required, this.notBlackListed().bind(this)]]}
    );

    this.upsertModalForm.valueChanges.subscribe((c) => {
      if (this.templateBeingEdited.Id === null) {
        this.validateWorkflowConfig();
      }
    });
  }

  private validateWorkflowConfig() {
    if ((this.steps === undefined || this.steps.length === 0)) {
      this.upsertModalForm.setErrors({ 'error': 'Name or Email Required' });
    } else {
      this.upsertModalForm.setErrors(null);
    }
  }

  handleFormSubmit() {
    if (this.upsertModalForm.valid) {
      this.store.dispatch(new fromWorkflowAction.UpdateWorkflowTemplate({name: this.workflowName.value, steps: this.steps}));
      this.store.dispatch(new fromWorkflowAction.BuildWorkflowTemplateSaveObj());
      this.store.dispatch(new fromWorkflowAction.SaveWorkflowTemplate({template: this.templateSaveObj}));
    }
  }

  handleModalDismissed() {
    this.store.dispatch(new fromWorkflowAction.CloseUpsertWorkflowTemplateModal());
  }

  notBlackListed() {
    return function(c: FormControl) {
      const blackList = this.workflowTemplateNames ? this.workflowTemplateNames.filter(n => n !== this.templateBeingEdited.Name).map(n => n.toLowerCase()) : [];
      const blackListed = blackList && c.value ? !!blackList.find(bl => bl === c.value.toLowerCase()) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }

  markFormGroupAsValid(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
    formGroup.markAsDirty();
  }
}
