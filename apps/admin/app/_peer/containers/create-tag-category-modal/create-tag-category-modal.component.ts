/* tslint:disable:no-bitwise */
import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, timer as observableTimer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PfValidators } from 'libs/forms/validators';
import { TagApiService } from 'libs/data/payfactors-api/index';
import { EntityTypesFlag } from 'libs/models/peer';
import { UpsertTagCategoryRequest } from 'libs/models/peer/requests';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';

@Component({
  selector: 'pf-create-tag-category-modal',
  templateUrl: './create-tag-category-modal.component.html',
  styleUrls: ['./create-tag-category-modal.component.scss']
})

export class CreateTagCategoryModalComponent {
  createTagCategoryModalOpen$: Observable<boolean>;
  creatingTagCategory$: Observable<boolean>;
  createTagCategoryForm: FormGroup;
  entityTypeCompany: any;
  entityTypeJob: any;
  entityTypeEmployee: any;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private fb: FormBuilder,
    private tagApiService: TagApiService
  ) {
    this.createTagCategoryModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCreateTagCategoryModalOpen));
    this.creatingTagCategory$ = this.store.pipe(select(fromPeerAdminReducer.getCreatingTagCategory));

    this.createForm();
  }

  get descriptionPlaceholder(): string {
    return `Add a brief description about the Custom Filter you are creating.`;
  }

  get name() { return this.createTagCategoryForm.get('name'); }
  get entityTypeCompanyControl() { return this.createTagCategoryForm.get('entityTypeCompany'); }
  get entityTypeJobControl() { return this.createTagCategoryForm.get('entityTypeJob'); }
  get entityTypeEmployeeControl() { return this.createTagCategoryForm.get('entityTypeEmployee'); }
  get description() { return this.createTagCategoryForm.get('description'); }

  createForm(): void {
    this.createTagCategoryForm = this.fb.group({
      'name': ['', [PfValidators.required, PfValidators.minLengthTrimWhitespace(3)], [this.tagCategoryNameValidator()]],
      'entityTypeCompany': [''],
      'entityTypeJob': [''],
      'entityTypeEmployee': [''],
      'description': ['']
    });
  }

  // Events
  handleModalDismissed() {
    this.store.dispatch(new fromTagCategoriesActions.CloseCreateTagCategoryModal());
  }

  handleFormSubmit(): void {
    this.entityTypeCompany = this.entityTypeCompanyControl.value;
    this.entityTypeJob = this.entityTypeJobControl.value;
    this.entityTypeEmployee = this.entityTypeEmployeeControl.value;
    let entityTypes: any = EntityTypesFlag.None;

    if (this.entityTypeCompany) { entityTypes |= EntityTypesFlag.Company; }
    if (this.entityTypeJob) { entityTypes |= EntityTypesFlag.Job; }
    if (this.entityTypeEmployee) { entityTypes |= EntityTypesFlag.Employee; }

    if (this.description.value == null) { this.description.setValue(''); }
    const upsertRequest: UpsertTagCategoryRequest = {
      DisplayName: this.name.value,
      EntityTypesFlag: entityTypes,
      Description: this.description.value
    };

    this.store.dispatch(new fromTagCategoriesActions.CreateTagCategory(upsertRequest));
  }

  setPlaceholderOnBlur(event: any) {
    event.target.placeholder = this.descriptionPlaceholder;
  }

  tagCategoryNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const tagCategoryName = control.value;
      return observableTimer(500).pipe(
        switchMap(() => {
          return this.tagApiService
            .validateNewTagCategoryName(tagCategoryName).pipe(
              map(result => {
                return result ? { tagCategoryNameExists: result } : null;
              }));
        }));
    };
  }
}
