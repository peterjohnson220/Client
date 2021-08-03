import { Injectable, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { PfValidators } from 'libs/forms/validators';
import { Entity, BaseDataView } from 'libs/ui/formula-editor';
import { UserContext } from 'libs/models/security';
import { Permissions } from 'libs/constants';
import * as fromRootReducer from 'libs/state/state';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';
import { DataViewScope } from 'libs/models/payfactors-api';

import * as fromSharedMainReducer from '../../reducers';

@Injectable()
export abstract class AbstractBaseDataViewModal implements OnInit, OnChanges, OnDestroy {
  baseEntitiesAsync$: Observable<AsyncStateObj<Entity[]>>;
  saving$: Observable<boolean>;
  savingConflict$: Observable<boolean>;
  savingError$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  userContextSubscription: Subscription;
  baseEntitiesSubscription: Subscription;
  savingSubscription: Subscription;

  baseEntities: Entity[];
  scopes: string[] = [];
  saving: boolean;
  baseDataViewForm: FormGroup;
  defaultEntity: Entity;
  showErrorMessages: boolean;
  reportName: string;
  summary: string;
  scope: string;
  reportingScopesEnabled: RealTimeFlag = { key: FeatureFlags.TabularReportingScopes, value: false };
  unsubscribe$ = new Subject<void>();
  constructor(
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected store: Store<fromSharedMainReducer.State>,
    protected featureFlagService: AbstractFeatureFlagService
  ) {
    this.featureFlagService.bindEnabled(this.reportingScopesEnabled, this.unsubscribe$);
    this.baseEntitiesAsync$ = this.store.pipe(select(fromSharedMainReducer.getBaseEntitiesAsync));
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit() {
    this.baseEntitiesSubscription = this.baseEntitiesAsync$.subscribe(asyncStateObj => {
      if (!!asyncStateObj && !!asyncStateObj.obj) {
        this.baseEntities = asyncStateObj.obj;
        this.defaultEntity = this.baseEntities && this.baseEntities.length ? this.baseEntities[0] : null;
        this.createForm();
      }
    });
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      if (!userContext) {
        return;
      }
      this.scopes = this.getAvailableScopes(userContext);
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
    this.userContextSubscription?.unsubscribe();
    this.unsubscribe$?.next();
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
      summary: [this.summary, [Validators.maxLength(300)]],
      scope: [this.scope],
    });
  }

  protected createBaseDataView(): BaseDataView {
    return {
      Entity: this.baseDataViewForm.value.entity,
      Name: this.baseDataViewForm.value.name,
      Summary: this.baseDataViewForm.value.summary,
      Scope: this.baseDataViewForm.value.scope
    };
  }

  private getAvailableScopes(userContext: UserContext): string[] {
    const scopesList: string[] = [DataViewScope.Personal];
    if (userContext.Permissions?.some(s => s === Permissions.MANAGE_SITE_REPORTS)) {
      scopesList.push(DataViewScope.Company);
    }
    if (userContext.AccessLevel === 'Admin') {
      scopesList.push(DataViewScope.Standard);
    }
    return scopesList;
  }

  open(): void {}
  protected save(): void {}
  protected updateForm() {}

}
