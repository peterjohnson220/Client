import { Injectable, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';

import * as fromSharedMainReducer from '../../reducers';
import { Entity, BaseDataView } from '../../models';

@Injectable()
export abstract class AbstractBaseDataViewModal implements OnInit, OnChanges, OnDestroy {
  baseEntitiesAsync$: Observable<AsyncStateObj<Entity[]>>;
  saving$: Observable<boolean>;
  savingConflict$: Observable<boolean>;
  savingError$: Observable<boolean>;

  baseEntitiesSubscription: Subscription;
  savingSubscription: Subscription;

  baseEntities: Entity[];
  saving: boolean;
  baseDataViewForm: FormGroup;
  defaultEntity: Entity;
  showErrorMessages: boolean;
  reportName: string;
  summary: string;

  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected store: Store<fromSharedMainReducer.State>
  ) {
    this.baseEntitiesAsync$ = this.store.pipe(select(fromSharedMainReducer.getBaseEntitiesAsync));
  }

  ngOnInit() {
    this.baseEntitiesSubscription = this.baseEntitiesAsync$.subscribe(asyncStateObj => {
      if (!!asyncStateObj && !!asyncStateObj.obj) {
        this.baseEntities = asyncStateObj.obj;
        this.defaultEntity = this.baseEntities && this.baseEntities.length ? this.baseEntities[0] : null;
        this.createForm();
      }
    });
    this.savingSubscription = this.saving$.subscribe(value => this.saving = value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.userDataView && !!changes.userDataView.currentValue) {
      this.updateForm();
    }
  }

  ngOnDestroy(): void {
    this.baseEntitiesSubscription.unsubscribe();
    this.savingSubscription.unsubscribe();
  }

  close(): void {
    this.modalService.dismissAll();
    this.showErrorMessages = false;
  }

  get saveDisabled(): boolean {
    if (!this.baseDataViewForm) {
      return this.saving;
    }

    return this.saving || !this.baseDataViewForm.valid;
  }

  protected createForm(): void {
    this.reportName = '';
    this.summary = '';
    this.baseDataViewForm = this.formBuilder.group({
      entity: [this.defaultEntity],
      name: [this.reportName, [PfValidators.required, Validators.maxLength(255)]],
      summary: [this.summary, [Validators.maxLength(300)]]
    });
  }

  protected createBaseDataView(): BaseDataView {
    return {
      Entity: this.baseDataViewForm.value.entity,
      Name: this.baseDataViewForm.value.name,
      Summary: this.baseDataViewForm.value.summary
    };
  }

  open(): void {}
  protected save(): void {}
  protected updateForm() {}

}
