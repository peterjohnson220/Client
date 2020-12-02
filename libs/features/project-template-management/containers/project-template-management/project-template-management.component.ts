import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { AsyncStateObj } from 'libs/models/state';
import { CompositeField, ProjectTemplateFields, ReferencePoints } from 'libs/models';
import { PfValidators } from 'libs/forms/validators';
import { SaveProjectTemplateRequest } from 'libs/models/payfactors-api/project/request';

import * as fromProjectTemplateManagementReducer from '../../reducers';
import * as fromProjectTemplateManagementActions from '../../actions/project-template-management.actions';
import { ProjectTemplateConfiguration } from '../../models';


@Component({
  selector: 'pf-project-template-management',
  templateUrl: './project-template-management.component.html',
  styleUrls: ['./project-template-management.component.scss']
})
export class ProjectTemplateManagementComponent implements OnInit, OnDestroy {
  @Output() saveSuccess = new EventEmitter();
  @ViewChild('accordion') accordion: NgbAccordion;

  showTemplateForm$: Observable<boolean>;
  saving$: Observable<boolean>;
  errorMessage$: Observable<string>;
  templateFieldsAsync$: Observable<AsyncStateObj<ProjectTemplateFields>>;

  // subscriptions
  templateFieldsSubscription: Subscription;
  errorMessageSubscription: Subscription;

  templateConfiguration: ProjectTemplateConfiguration = {};
  projectTemplateForm: FormGroup;
  activeTab: string;
  modalTabs: string[] = [];
  activeAccordionIds: string[] = [];
  errorMessage: string;

  get f() { return this.projectTemplateForm.controls; }

  constructor(
    private rootStore: Store<fromRootState.State>,
    private store: Store<fromProjectTemplateManagementReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.showTemplateForm$ = this.store.select(fromProjectTemplateManagementReducer.getShowProjectTemplateForm);
    this.saving$ = this.store.select(fromProjectTemplateManagementReducer.getSaving);
    this.errorMessage$ = this.store.select(fromProjectTemplateManagementReducer.getErrorMessage);
    this.templateFieldsAsync$ = this.store.select(fromProjectTemplateManagementReducer.getTemplateFieldsAsync);
  }

  ngOnInit() {
    this.createForm();
    this.templateFieldsSubscription = this.templateFieldsAsync$.subscribe(fields => {
      if (!!fields && fields.obj) {
        if (fields.obj.TemplateFields?.length) {
          this.configureTabs(fields.obj);
        }
        this.configureReferencePoints(fields.obj);
        this.setHiddenComposites();
      }
    });
    this.errorMessageSubscription = this.errorMessage$.subscribe(message => {
      this.errorMessage = message;
    });
  }

  ngOnDestroy() {
    this.templateFieldsSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
  }

  onCancelChanges() {
    this.resetForm();
    this.store.dispatch(new fromProjectTemplateManagementActions.ShowProjectTemplateForm(false));
    this.activeAccordionIds = [];
  }

  onSubmit() {
    const template = this.getProjectTemplateFromForm();
    this.store.dispatch(new fromProjectTemplateManagementActions.SaveProjectTemplateFields(template));
  }

  getKeys(object: any): string[] {
    return Object.keys(object);
  }

  trackByCategory(index: any, item: string) {
    return item;
  }

  trackByField(index: any, item: CompositeField) {
    return item.ListCompositeFieldId;
  }

  handleSelectionChanged(field: CompositeField): void {
    this.store.dispatch(new fromProjectTemplateManagementActions.ToggleFieldSelected(field));
  }

  clearErrorMessage(): void {
    this.errorMessage = null;
  }

  getMrpControl(field: CompositeField): string {
    switch (field.FieldName) {
      case 'TargetLTIPMRP':
        return 'LTIPTargetRefPt';
      case 'TargetTDCMRP':
        return 'TDCTargetRefPt';
      default:
        return field.FieldName.replace('MRP', 'RefPt');
    }
  }

  updateMrpValues() {
    const projectTemplate: SaveProjectTemplateRequest = this.projectTemplateForm.getRawValue();
    const referencePoints = [
      projectTemplate.BaseRefPt,
      projectTemplate.TCCRefPt,
      projectTemplate.BonusRefPt,
      projectTemplate.TCCTargetRefPt,
      projectTemplate.LTIPRefPt  ,
      projectTemplate.TDCRefPt,
      projectTemplate.AllowRefPt,
      projectTemplate.FixedRefPt,
      projectTemplate.RemunRefPt,
      projectTemplate.TGPRefPt,
      projectTemplate.BonusTargetRefPt,
      projectTemplate.LTIPTargetRefPt,
      projectTemplate.TDCTargetRefPt,
      projectTemplate.SalesIncentiveActualPctRefPt,
      projectTemplate.SalesIncentiveTargetPctRefPt,
      projectTemplate.TCCPlusAllowRefPt,
      projectTemplate.TCCPlusAllowNoCarRefPt,
      projectTemplate.TCCTargetPlusAllowRefPt,
      projectTemplate.TCCTargetPlusAllowNoCarRefPt,
      projectTemplate.LTIPPctRefPt,
      projectTemplate.BonusPctRefPt,
      projectTemplate.BonusTargetPctRefPt,
      projectTemplate.SalesIncentiveActualRefPt,
      projectTemplate.SalesIncentiveTargetRefPt
    ];
    this.store.dispatch(new fromProjectTemplateManagementActions.UpdateReferencePoints(referencePoints));
  }

  private configureTabs(template: ProjectTemplateFields) {
    const allAccordionIds = [];
    this.templateConfiguration = this.templateConfiguration || {};
    template.TemplateFields.forEach(t => {
      if (!this.templateConfiguration[t.ModalTab]) {
        this.templateConfiguration[t.ModalTab] = {};
      }
      this.templateConfiguration[t.ModalTab][t.Category] = t;
      allAccordionIds.push(`${t.ModalTab}_${t.Category}`);
    });
    if (!this.activeAccordionIds.length) {
      this.activeAccordionIds = allAccordionIds;
    }
    this.modalTabs = this.getKeys(this.templateConfiguration);
    this.activeTab = this.modalTabs[0];
  }

  private getCheckedCompositeFieldIds(): number[] {
    let selectedCompositeFieldIds = [];
    const tabs = this.getKeys(this.templateConfiguration);
    tabs.forEach(t => {
      const categories = this.getKeys(this.templateConfiguration[t]);
      categories.forEach(c => {
        const selectedFields = this.templateConfiguration[t][c]
          .Fields.filter(x => x.Checked)
          .map(f => f.ListCompositeFieldId);
        selectedCompositeFieldIds = selectedCompositeFieldIds.concat(selectedFields);
      });
    });
    return selectedCompositeFieldIds;
  }

  private setHiddenComposites() {
    const compositeIds = this.getCheckedCompositeFieldIds();
    this.projectTemplateForm.controls.CompositeFieldIds.setValue(compositeIds.join());
  }

  private configureReferencePoints(template: ProjectTemplateFields) {
    this.projectTemplateForm.patchValue({
      BaseRefPt: this.getReferencePoint(template, ReferencePoints.BaseReferencePoint),
      TCCRefPt: this.getReferencePoint(template, ReferencePoints.TCCReferencePoint),
      BonusRefPt: this.getReferencePoint(template, ReferencePoints.BonusReferencePoint),
      TCCTargetRefPt: this.getReferencePoint(template, ReferencePoints.TCCTargetReferencePoint),
      LTIPRefPt: this.getReferencePoint(template, ReferencePoints.LTIPReferencePoint),
      TDCRefPt: this.getReferencePoint(template, ReferencePoints.TDCReferencePoint),
      AllowRefPt: this.getReferencePoint(template, ReferencePoints.AllowReferencePoint),
      FixedRefPt: this.getReferencePoint(template, ReferencePoints.FixedReferencePoint),
      RemunRefPt: this.getReferencePoint(template, ReferencePoints.RemunReferencePoint),
      TGPRefPt: this.getReferencePoint(template, ReferencePoints.TGPReferencePoint),
      BonusTargetRefPt: this.getReferencePoint(template, ReferencePoints.BonusTargetReferencePoint),
      LTIPTargetRefPt: this.getReferencePoint(template, ReferencePoints.TargetLTIPReferencePoint),
      TDCTargetRefPt: this.getReferencePoint(template, ReferencePoints.TargetTDCReferencePoint),
      SalesIncentiveActualPctRefPt: this.getReferencePoint(template, ReferencePoints.SalesIncentiveActualPctReferencePoint),
      SalesIncentiveTargetPctRefPt: this.getReferencePoint(template, ReferencePoints.SalesIncentiveTargetPctReferencePoint),
      TCCPlusAllowRefPt: this.getReferencePoint(template, ReferencePoints.TCCPlusAllowReferencePoint),
      TCCPlusAllowNoCarRefPt: this.getReferencePoint(template, ReferencePoints.TCCPlusAllowNoCarReferencePoint),
      TCCTargetPlusAllowRefPt: this.getReferencePoint(template, ReferencePoints.TCCTargetPlusAllowReferencePoint),
      TCCTargetPlusAllowNoCarRefPt: this.getReferencePoint(template, ReferencePoints.TCCTargetPlusAllowNoCarReferencePoint),
      LTIPPctRefPt: this.getReferencePoint(template, ReferencePoints.LTIPPctReferencePoint),
      BonusPctRefPt: this.getReferencePoint(template, ReferencePoints.BonusPctReferencePoint),
      BonusTargetPctRefPt: this.getReferencePoint(template, ReferencePoints.BonusTargetPctReferencePoint),
      SalesIncentiveActualRefPt: this.getReferencePoint(template, ReferencePoints.SalesIncentiveActualReferencePoint),
      SalesIncentiveTargetRefPt: this.getReferencePoint(template, ReferencePoints.SalesIncentiveTargetReferencePoint)
    });
  }

  private getReferencePoint(template: ProjectTemplateFields, referencePointIndex: number) {
    if (template.ReferencePoints?.length > referencePointIndex) {
      return template.ReferencePoints[referencePointIndex];
    }
    return 50;
  }

  private createForm(): void {
    this.projectTemplateForm = this.formBuilder.group({
      TemplateName: ['', [
        PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(50)]],
      CompositeFieldIds: ['', PfValidators.required],
      BaseRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TCCRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      BonusRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TCCTargetRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      LTIPRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TDCRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      AllowRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      FixedRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      RemunRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TGPRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      BonusTargetRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      LTIPTargetRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TDCTargetRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      SalesIncentiveActualPctRefPt: [50, [Validators.pattern('[0-9]*')]],
      SalesIncentiveTargetPctRefPt: [50, [Validators.pattern('[0-9]*')]],
      TCCPlusAllowRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      TCCPlusAllowNoCarRefPt: [50, [Validators.pattern('[0-9]*')]],
      TCCTargetPlusAllowRefPt: [50, [Validators.pattern('[0-9]*')]],
      TCCTargetPlusAllowNoCarRefPt: [50, [Validators.pattern('[0-9]*')]],
      LTIPPctRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      BonusPctRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      BonusTargetPctRefPt: [50, [PfValidators.required, Validators.pattern('[0-9]*')]],
      SalesIncentiveActualRefPt: [50, [Validators.pattern('[0-9]*')]],
      SalesIncentiveTargetRefPt: [50, [Validators.pattern('[0-9]*')]]
    });
  }

  private getProjectTemplateFromForm(): SaveProjectTemplateRequest {
    const projectTemplate: SaveProjectTemplateRequest = this.projectTemplateForm.getRawValue();
    projectTemplate.CompositeFieldIds = this.getCheckedCompositeFieldIds();
    return projectTemplate;
  }

  private resetForm() {
    this.projectTemplateForm.reset({
      TemplateName: null,
      CompositeFieldIds: null,
      BaseRefPt: 50,
      TCCRefPt: 50,
      BonusRefPt: 50,
      TCCTargetRefPt: 50,
      LTIPRefPt: 50,
      TDCRefPt: 50,
      AllowRefPt: 50,
      FixedRefPt: 50,
      RemunRefPt: 50,
      TGPRefPt: 50,
      BonusTargetRefPt: 50,
      LTIPTargetRefPt: 50,
      TDCTargetRefPt: 50,
      SalesIncentiveActualPctRefPt: 50,
      SalesIncentiveTargetPctRefPt: 50,
      TCCPlusAllowRefPt: 50,
      TCCPlusAllowNoCarRefPt: 50,
      TCCTargetPlusAllowRefPt: 50,
      TCCTargetPlusAllowNoCarRefPt: 50,
      LTIPPctRefPt: 50,
      BonusPctRefPt: 50,
      BonusTargetPctRefPt: 50,
      SalesIncentiveActualRefPt: 50,
      SalesIncentiveTargetRefPt: 50,
    });
  }

}
