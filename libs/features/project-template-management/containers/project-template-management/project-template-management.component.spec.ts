import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import {
  generateMockCompositeField,
  generateMockCompositeFieldHierarchy,
  generateMockProjectTemplateFields,
  ProjectTemplateFields, ReferencePoints
} from 'libs/models/projects/project-templates';
import * as fromProjectTemplateManagementActions from 'libs/features/project-template-management/actions/project-template-management.actions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ProjectTemplateManagementComponent } from './project-template-management.component';
import * as fromProjectTemplateManagementReducer from '../../reducers';

describe('ProjectTemplateManagementComponent', () => {
  let instance: ProjectTemplateManagementComponent;
  let fixture: ComponentFixture<ProjectTemplateManagementComponent>;
  let store: Store<fromProjectTemplateManagementReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromProjectTemplateManagementReducer.reducers,
          feature_project_template_management: combineReducers(fromProjectTemplateManagementReducer.reducers),
        }),
        FormsModule,
        NgbModule,
        PfFormsModule,
        NgbModule,
        FontAwesomeModule,
        NumericTextBoxModule,
        PfCommonUIModule,
        ReactiveFormsModule
      ],
      declarations: [ ProjectTemplateManagementComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTemplateManagementComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    fixture.detectChanges();
    instance.ngOnInit();
  });

  it('should close template form when canceling changes', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromProjectTemplateManagementActions.ShowProjectTemplateForm(false);

    instance.onCancelChanges();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should toggle the field selection when checkbox value changed', () => {
    spyOn(instance.store, 'dispatch');
    const field = generateMockCompositeField();
    const expectedAction = new fromProjectTemplateManagementActions.ToggleFieldSelected(field);

    instance.handleSelectionChanged(field);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should mark the form as touched when checkbox value changed', () => {
    spyOn(instance.store, 'dispatch');
    const field = generateMockCompositeField();

    instance.handleSelectionChanged(field);

    expect(instance.projectTemplateForm.touched).toBeTruthy();
  });

  it('should configure the modal tabs', () => {
    spyOn(instance.store, 'dispatch');
    const templateFields: ProjectTemplateFields = {
      ...generateMockProjectTemplateFields(),
      TemplateFields: [
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Basic Data'
        },
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Company Target Pay'
        }
      ]
    };

    instance.configureTabs(templateFields);

    expect(instance.modalTabs).toEqual(['Basic Data', 'Company Target Pay']);
  });

  it('should set the active tab to the 1st modal tab', () => {
    spyOn(instance.store, 'dispatch');
    const templateFields: ProjectTemplateFields = {
      ...generateMockProjectTemplateFields(),
      TemplateFields: [
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Basic Data'
        },
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Company Target Pay'
        }
      ]
    };

    instance.configureTabs(templateFields);

    expect(instance.activeTab).toEqual('Basic Data');
  });

  it('should expand all accordions when configuring tabs', () => {
    spyOn(instance.store, 'dispatch');
    const templateFields: ProjectTemplateFields = {
      ...generateMockProjectTemplateFields(),
      TemplateFields: [
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Basic Data'
        },
        {
          ...generateMockCompositeFieldHierarchy(),
          ModalTab: 'Company Target Pay'
        }
      ]
    };

    instance.configureTabs(templateFields);

    expect(instance.activeAccordionIds).toEqual(['Basic Data_Test', 'Company Target Pay_Test']);
  });

  it.each([
    ['TargetLTIPMRP', 'LTIPTargetRefPt'],
    ['TargetTDCMRP', 'TDCTargetRefPt'],
    ['BaseMRP', 'BaseRefPt'],
    ['TGPMRP', 'TGPRefPt'],
    ['BonusPctMRP', 'BonusPctRefPt'],
    ['TargetLTIPMRP', 'LTIPTargetRefPt']])
    ('get MrpControl name for %s is equal to %s', (fieldName, expectedMrpControlName) => {
      const field = {...generateMockCompositeField(), FieldName: fieldName};

      const actual = instance.getMrpControl(field);
      expect(actual).toBe(expectedMrpControlName);
  });

  it('should update the correct indexes when updating MRP reference points', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromProjectTemplateManagementActions.UpdateReferencePoints([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
    ]);

    instance.projectTemplateForm.patchValue({
      BaseRefPt: ReferencePoints.BaseReferencePoint,
      TCCRefPt: ReferencePoints.TCCReferencePoint,
      BonusRefPt: ReferencePoints.BonusReferencePoint,
      TCCTargetRefPt: ReferencePoints.TCCTargetReferencePoint,
      LTIPRefPt: ReferencePoints.LTIPReferencePoint,
      TDCRefPt: ReferencePoints.TDCReferencePoint,
      AllowRefPt: ReferencePoints.AllowReferencePoint,
      FixedRefPt: ReferencePoints.FixedReferencePoint,
      RemunRefPt: ReferencePoints.RemunReferencePoint,
      TGPRefPt: ReferencePoints.TGPReferencePoint,
      BonusTargetRefPt: ReferencePoints.BonusTargetReferencePoint,
      LTIPTargetRefPt: ReferencePoints.TargetLTIPReferencePoint,
      TDCTargetRefPt: ReferencePoints.TargetTDCReferencePoint,
      SalesIncentiveActualPctRefPt: ReferencePoints.SalesIncentiveActualPctReferencePoint,
      SalesIncentiveTargetPctRefPt: ReferencePoints.SalesIncentiveTargetPctReferencePoint,
      TCCPlusAllowRefPt: ReferencePoints.TCCPlusAllowReferencePoint,
      TCCPlusAllowNoCarRefPt: ReferencePoints.TCCPlusAllowNoCarReferencePoint,
      TCCTargetPlusAllowRefPt: ReferencePoints.TCCTargetPlusAllowReferencePoint,
      TCCTargetPlusAllowNoCarRefPt: ReferencePoints.TCCTargetPlusAllowNoCarReferencePoint,
      LTIPPctRefPt: ReferencePoints.LTIPPctReferencePoint,
      BonusPctRefPt: ReferencePoints.BonusPctReferencePoint,
      BonusTargetPctRefPt: ReferencePoints.BonusTargetPctReferencePoint,
      SalesIncentiveActualRefPt: ReferencePoints.SalesIncentiveActualReferencePoint,
      SalesIncentiveTargetRefPt: ReferencePoints.SalesIncentiveTargetReferencePoint
    });

    instance.updateMrpValues();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
