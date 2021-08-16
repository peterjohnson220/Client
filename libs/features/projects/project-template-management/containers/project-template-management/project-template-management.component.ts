import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { AsyncStateObj } from 'libs/models/state';
import { CompositeField, ProjectTemplateFields, ReferencePoints } from 'libs/models';
import { PfValidators } from 'libs/forms/validators';
import { SaveProjectTemplateRequest } from 'libs/models/payfactors-api/project/request';

import * as fromProjectTemplateManagementReducer from '../../reducers';
import * as fromProjectTemplateManagementActions from '../../actions/project-template-management.actions';
import { ProjectTemplateConfiguration } from '../../models';
import { ProjectFieldManagementFeatureImplementations } from '../../constants';


@Component({
  selector: 'pf-project-template-management',
  templateUrl: './project-template-management.component.html',
  styleUrls: ['./project-template-management.component.scss']
})
export class ProjectTemplateManagementComponent implements OnInit, OnDestroy {
  @Input() featureImplementation: string = ProjectFieldManagementFeatureImplementations.PROJECT_TEMPLATES;
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

  featureImplementations = ProjectFieldManagementFeatureImplementations;

  get f() { return this.projectTemplateForm.controls; }

  constructor(
    public store: Store<fromProjectTemplateManagementReducer.State>,
    public formBuilder: FormBuilder
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
        if (fields.obj?.Fields?.TemplateFields?.length) {
          this.configureTabs(fields.obj);
        }
        this.updateFormFields(fields.obj);
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
    this.activeTab = null;
    this.templateConfiguration = {};
  }

  onSubmit() {
    const request = this.getProjectTemplateFromForm();
    switch (this.featureImplementation) {
      case this.featureImplementations.PRICING_PROJECTS:
        this.store.dispatch(new fromProjectTemplateManagementActions.SaveBaseProjectFieldSelections(request));
        break;
      case this.featureImplementations.PROJECT_TEMPLATES:
      default:
        this.store.dispatch(new fromProjectTemplateManagementActions.SaveProjectTemplateFields(request));
        break;
    }
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
    this.projectTemplateForm.markAsTouched();
  }

  handleSelectAllClicked(event: any, category: string) {
    this.store.dispatch(new fromProjectTemplateManagementActions.ToggleSelectAll({
      Category: category,
      SelectAllValue: event.target.checked
    }));

    this.projectTemplateForm.markAsTouched();
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
      projectTemplate.LTIPRefPt,
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

  configureTabs(template: ProjectTemplateFields) {
    const allAccordionIds = [];
    this.templateConfiguration = this.templateConfiguration || {};
    template.Fields.TemplateFields.forEach(t => {
      this.templateConfiguration[t.ModalTab] = this.templateConfiguration[t.ModalTab] || {};
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

  private updateFormFields(template: ProjectTemplateFields) {
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
    if (!this.projectTemplateForm.controls.TemplateName.dirty &&
      this.featureImplementation === ProjectFieldManagementFeatureImplementations.PROJECT_TEMPLATES) {
      // don't overwrite template name if it's been updated
      this.projectTemplateForm.controls.TemplateName.setValue(template?.TemplateName);
    }
    const compositeIds = this.getCheckedCompositeFieldIds();
    this.projectTemplateForm.controls.CompositeFieldIds.setValue(compositeIds.join());
  }

  private getReferencePoint(template: ProjectTemplateFields, referencePointIndex: number) {
    if (template.Fields.ReferencePoints?.length > referencePointIndex) {
      return template.Fields.ReferencePoints[referencePointIndex];
    }
    return 50;
  }

  private createForm(): void {
    const templateNameValidator = this.featureImplementation === ProjectFieldManagementFeatureImplementations.PROJECT_TEMPLATES ?
      [PfValidators.required,
        PfValidators.maxLengthTrimWhitespace(50)] : [];

    this.projectTemplateForm = this.formBuilder.group({
      TemplateName: ['', templateNameValidator],
      CompositeFieldIds: ['', PfValidators.required],
      BaseRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      BonusRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCTargetRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      LTIPRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TDCRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      AllowRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      FixedRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      RemunRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TGPRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      BonusTargetRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      LTIPTargetRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TDCTargetRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      SalesIncentiveActualPctRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      SalesIncentiveTargetPctRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCPlusAllowRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCPlusAllowNoCarRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCTargetPlusAllowRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      TCCTargetPlusAllowNoCarRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      LTIPPctRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      BonusPctRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      BonusTargetPctRefPt: [50, [PfValidators.required, Validators.pattern('(\\d*\\.)?\\d+$')]],
      SalesIncentiveActualRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]],
      SalesIncentiveTargetRefPt: [50, [Validators.pattern('(\\d*\\.)?\\d+$')]]
    });
  }

  getProjectTemplateFromForm(): SaveProjectTemplateRequest {
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
