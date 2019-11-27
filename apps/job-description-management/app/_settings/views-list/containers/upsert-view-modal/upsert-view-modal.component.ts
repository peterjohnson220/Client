import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';
import { AsyncStateObj } from 'libs/models/state';
import { TemplateListItem } from 'libs/models/jdm';

import * as fromViewsListReducer from '../../reducers';
import * as fromUpsertViewModalActions from '../../actions/upsert-view-modal.actions';
import { JdmSettingsHelper } from '../../../shared/helpers';

@Component({
  selector: 'pf-upsert-view-modal',
  templateUrl: './upsert-view-modal.component.html',
  styleUrls: ['./upsert-view-modal.component.scss']
})

export class UpsertViewModalComponent implements OnInit, OnDestroy {
  @Input() addView = true;

  // Observables
  upsertViewModalOpen$: Observable<boolean>;
  upsertingView$: Observable<boolean>;
  upsertingViewError$: Observable<boolean>;
  upsertingViewErrorMessage$: Observable<string>;
  assignedTemplateIds$: Observable<number[]>;
  availableTemplatesAsyncObj$: Observable<AsyncStateObj<TemplateListItem[]>>;
  editingViewName$: Observable<string>;

  // Subscriptions
  availableTemplatesSubscription: Subscription;
  errorSubscription: Subscription;
  errorMessageSubscription: Subscription;
  assignedTemplateIdsSubscription: Subscription;
  editingViewNameSubscription: Subscription;

  availableTemplates: TemplateListItem[];
  errorValidationMessage: string;
  upsertViewForm: FormGroup;
  attemptedSubmit = false;

  isSystemView = JdmSettingsHelper.isSystemView;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromViewsListReducer.State>
  ) {
    this.upsertViewModalOpen$ = this.store.pipe(select(fromViewsListReducer.getUpsertViewModalOpen));
    this.upsertingView$ = this.store.pipe(select(fromViewsListReducer.getUpsertingView));
    this.upsertingViewError$ = this.store.pipe(select(fromViewsListReducer.getUpsertingViewError));
    this.upsertingViewErrorMessage$ = this.store.pipe(select(fromViewsListReducer.getUpsertingViewErrorMessage));
    this.availableTemplatesAsyncObj$ = this.store.pipe(select(fromViewsListReducer.getAvailableTemplatesAsyncObj));
    this.assignedTemplateIds$ = this.store.pipe(select(fromViewsListReducer.getAssignedTemplateIds));
    this.editingViewName$ = this.store.pipe(select(fromViewsListReducer.getEditingViewName));
    this.createForm();
  }

  get modalTitle(): string {
    return this.addView ? 'Create View' : 'Edit View';
  }

  get modalPrimaryButtonText(): string {
    return this.addView ? 'Create' : 'Update';
  }

  get modalPrimaryButtonTextSubmitting(): string {
    return this.addView ? 'Creating...' : 'Updating...';
  }

  get name() { return this.upsertViewForm.get('name'); }

  get assignedTemplates() { return this.upsertViewForm.get('assignedTemplates'); }

  createForm(): void {
    this.upsertViewForm = this.fb.group({
      'name': ['', [PfValidators.required, PfValidators.minLengthTrimWhitespace(1), Validators.maxLength(255)]],
      'assignedTemplates': [null, Validators.required]
    });
  }

  handleFormSubmit() {
    this.attemptedSubmit = true;
    if (this.addView) {
      this.store.dispatch(new fromUpsertViewModalActions.AddView({
        viewName: this.name.value,
        templateIds: this.assignedTemplates.value
      }));
    } else {
      this.store.dispatch(new fromUpsertViewModalActions.UpdateView({
        viewName: this.name.value,
        templateIds: this.assignedTemplates.value
      }));
    }
  }

  handleModalDismissed() {
    this.attemptedSubmit = false;
    this.store.dispatch(new fromUpsertViewModalActions.CloseUpsertViewModal());
    this.store.dispatch(new fromUpsertViewModalActions.SetEditingViewName({editingViewName: ''}));
    this.store.dispatch(new fromUpsertViewModalActions.ClearAssignedTemplates());
  }

  ngOnInit(): void {
    this.availableTemplatesSubscription = this.availableTemplatesAsyncObj$.subscribe(availableTemplatesAsyncObj => {
      this.availableTemplates = availableTemplatesAsyncObj.obj;
    });
    this.assignedTemplateIdsSubscription = this.assignedTemplateIds$.subscribe(assignedIds => {
      this.assignedTemplates.setValue(assignedIds);
    });
    this.editingViewNameSubscription = this.editingViewName$.subscribe(editingViewName => {
      this.name.setValue(editingViewName);
    });
    this.errorMessageSubscription = this.upsertingViewErrorMessage$.subscribe(errorMessage => {
      this.errorValidationMessage = errorMessage;
    });
    this.errorSubscription = this.upsertingViewError$.subscribe(error => {
      if (error) {
        this.name.setErrors({'error': this.errorValidationMessage});
      }
    });
  }

  ngOnDestroy(): void {
    this.availableTemplatesSubscription.unsubscribe();
    this.assignedTemplateIdsSubscription.unsubscribe();
    this.editingViewNameSubscription.unsubscribe();
    this.errorMessageSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
