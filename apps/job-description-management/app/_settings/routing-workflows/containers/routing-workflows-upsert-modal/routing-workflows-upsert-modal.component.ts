import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as fromSharedWorkflowAction from '../../../../shared/actions';
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
  @ViewChild('saveWorkflowTemplateModal', {static: true}) public saveWorkflowTemplateModal: any;
  @Input() workflowTemplateNames: string[];

  private modalRef: NgbModalRef;
  private editing = false;
  private stepsDirty = false;
  private existingName = '';
  private workflowSaveObj: WorkflowTemplate = null;
  private workflowTemplateForm: FormGroup;
  private errorMessage: string;
  private steps: WorkflowStep[];

  // Observables
  workflowSaveObj$: Observable<WorkflowTemplate>;
  saving$: Observable<boolean>;
  savingSuccess$: Observable<boolean>;
  savingError$: Observable<boolean>;
  savingErrorMessage$: Observable<string>;
  private stepsDirty$: Observable<boolean>;
  private steps$: Observable<WorkflowStep[]>;

  // Subscription
  private templateSaveObjSubscription: Subscription;
  private stepsSubscription: Subscription;
  private stepsDirtySubscription: Subscription;
  private savingSuccessSubscription: Subscription;
  private savingErrorSubscription: Subscription;
  private savingErrorMessageSubscription: Subscription;

  get workflowName() { return (this.workflowTemplateForm.get('workflowName')); }

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<fromWorkflowReducer.State>,
    private sharedStore: Store<fromSharedWorkflowReducer.State>) {

    this.workflowSaveObj$ = this.store.pipe(select(fromWorkflowReducer.getTemplateSaveObj));
    this.saving$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSaving));
    this.savingSuccess$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSavingSuccess));
    this.savingError$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSavingError));
    this.savingErrorMessage$ = this.store.pipe(select(fromWorkflowReducer.getWorkflowTemplateSavingErrorMessage));
    this.steps$ = this.sharedStore.pipe(select(fromSharedWorkflowReducer.getWorkflowStepsFromWorkflowConfig));
    this.stepsDirty$ = this.sharedStore.pipe(select(fromSharedWorkflowReducer.getWorkflowConfigDirty));

  }

  ngOnInit() {
    this.templateSaveObjSubscription = this.workflowSaveObj$.subscribe((template) => this.workflowSaveObj = template);
    this.stepsDirtySubscription = this.stepsDirty$.subscribe(d => this.stepsDirty = d);
    this.savingErrorMessageSubscription = this.savingErrorMessage$.subscribe((em) => this.errorMessage = em);

    this.savingSuccessSubscription = this.savingSuccess$.subscribe((s) => {
      this.close();
    });
    this.stepsSubscription = this.steps$.subscribe((steps) => {
      this.steps = steps;
    });
    this.savingErrorSubscription = this.savingError$.subscribe((e) => {
      if (e) {
        this.workflowTemplateForm.setErrors({'error': this.errorMessage});
      }
    });
  }

  ngOnDestroy() {
    this.templateSaveObjSubscription.unsubscribe();
    this.stepsDirtySubscription.unsubscribe();
    this.stepsSubscription.unsubscribe();
    this.savingSuccessSubscription.unsubscribe();
    this.savingErrorSubscription.unsubscribe();
    this.savingErrorMessageSubscription.unsubscribe();
  }

  open(workflowTemplate: WorkflowTemplate = null) {
    this.editing = workflowTemplate !== null;
    this.existingName = this.editing ? workflowTemplate.Name : '';
    this.buildForm();
    if (!this.editing) {
        this.store.dispatch(new fromSharedWorkflowAction.ResetWorkflow());
    } else {
        this.store.dispatch(new fromWorkflowAction.PopulateWorkflowTemplate(workflowTemplate));
        this.store.dispatch(new fromSharedWorkflowAction.PopulateWorkflow({workflowSteps: workflowTemplate.Steps, prepopulating: true}));
    }
    this.modalRef = this.modalService.open(this.saveWorkflowTemplateModal, { backdrop: 'static', windowClass: 'route-for-approval-modal' });
  }

  close() {
    this.store.dispatch(new fromWorkflowAction.CloseUpsertWorkflowTemplateModal());
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  buildForm(): void {
    this.workflowTemplateForm = this.formBuilder.group({
      'workflowName': ['', [Validators.required, this.notBlackListed().bind(this)]]}
    );
    if (this.editing) {
        this.workflowTemplateForm.setValue({workflowName: this.existingName});
    }
  }

  saveWorkflowTemplate() {
    const workflowName = this.workflowTemplateForm.value.workflowName;

    const modalDirty = this.existingName !== workflowName || this.stepsDirty;
    if (!this.workflowTemplateForm.valid || !modalDirty) {
        return;
    }

    this.store.dispatch(new fromWorkflowAction.UpdateWorkflowTemplate({name: this.workflowName.value, steps: this.steps}));
    this.store.dispatch(new fromWorkflowAction.BuildWorkflowTemplateSaveObj());
    this.store.dispatch(new fromWorkflowAction.SaveWorkflowTemplate({template: this.workflowSaveObj}));
  }

  notBlackListed() {
    return function(c: FormControl) {
      const blackList = this.workflowTemplateNames ? this.workflowTemplateNames.filter(n => n !== this.existingName).map(n => n.toLowerCase()) : [];
      const blackListed = blackList && c.value ? !!blackList.find(bl => bl === c.value.toLowerCase()) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }
}
