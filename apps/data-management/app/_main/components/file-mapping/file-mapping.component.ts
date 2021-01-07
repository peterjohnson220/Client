import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/internal/operators';

import { CompanySettingsApiService } from 'libs/data/payfactors-api';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import {
    LoaderType, ORG_DATA_PF_BENEFITS_MAPPING_FIELDS, ORG_DATA_PF_EMPLOYEE_FIELDS, ORG_DATA_PF_EMPLOYEE_TAG_FIELDS, ORG_DATA_PF_JOB_FIELDS,
    ORG_DATA_PF_JOB_RANGE_STRUCTURE_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
    ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS, ORG_DATA_PF_SUBSIDIARIES_MAPPING_FIELDS
} from 'libs/features/org-data-loader/constants';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers';
import { InternalField, LoaderEntityStatus, VisibleLoaderOptionModel } from 'libs/features/org-data-loader/models';
import { CompanySetting, CompanySettingsEnum, LoaderFieldSet } from 'libs/models';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/organizational-data-field-mapping.actions';
import { EntityChoice } from '../../models';

@Component({
  selector: 'pf-file-mapping',
  templateUrl: './file-mapping.component.html',
  styleUrls: ['./file-mapping.component.scss']
})
export class FileMappingComponent implements OnInit, OnChanges, OnDestroy {

  @Input() entities: EntityChoice[];
  @Input() existingCompanyLoaderSettings: ILoadSettings;
  @Input() selectedCompany: CompanySelectorItem;
  @Input() loaderConfigurationGroupId: number;
  @Output() mappingComplete = new EventEmitter();

  payfactorsPaymarketDataFields: InternalField[];
  payfactorsJobDataFields: InternalField[];
  payfactorsStructureDataFields: InternalField[];
  payfactorsStructureMappingDataFields: InternalField[];
  payfactorsEmployeeDataFields: InternalField[];
  payfactorsEmployeeTagsDataFields: InternalField[];
  payfactorsSubsidiariesDataFields: InternalField[];
  payfactorsBenefitsDataFields: InternalField[];
  templateReferenceConstants = {
    LoaderType,
  };
  isEmployeesLoadEnabled: boolean;
  isEmployeeTagsLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  isSubsidiariesLoadEnabled: boolean;
  isBenefitsLoadEnabled: boolean;
  visibleLoaderOptions: VisibleLoaderOptionModel;
  companyMappings$: Observable<LoaderFieldSet[]>;
  companyMappingsLoading$: Observable<boolean>;
  selectedCompanySetting$: Observable<CompanySetting[]>;
  private unsubscribe$ = new Subject();

  selected: boolean;

  constructor(
    private store: Store<fromOrgDataAutoloaderReducer.State>,
    private companySettingsApiService: CompanySettingsApiService) {
    this.payfactorsPaymarketDataFields = this.buildInternalFields(ORG_DATA_PF_PAYMARKET_FIELDS, false);
    this.payfactorsJobDataFields = this.buildInternalFields(ORG_DATA_PF_JOB_FIELDS, false);
    this.payfactorsStructureDataFields = this.buildInternalFields(ORG_DATA_PF_STRUCTURE_FIELDS, false);
    this.payfactorsStructureMappingDataFields = this.buildInternalFields(ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS, false);
    this.payfactorsEmployeeDataFields = this.buildInternalFields(ORG_DATA_PF_EMPLOYEE_FIELDS, false);
    this.payfactorsSubsidiariesDataFields = this.buildInternalFields(ORG_DATA_PF_SUBSIDIARIES_MAPPING_FIELDS, false);
    this.payfactorsBenefitsDataFields = this.buildInternalFields(ORG_DATA_PF_BENEFITS_MAPPING_FIELDS, false);
    this.payfactorsEmployeeTagsDataFields = this.buildInternalFields(ORG_DATA_PF_EMPLOYEE_TAG_FIELDS, false);
    this.isEmployeesLoadEnabled = false;
    this.isEmployeeTagsLoadEnabled = false;
    this.isJobsLoadEnabled = false;
    this.isPaymarketsLoadEnabled = false;
    this.isStructuresLoadEnabled = false;
    this.isStructureMappingsLoadEnabled = false;
    this.isSubsidiariesLoadEnabled = false;
    this.isBenefitsLoadEnabled = false;
    this.visibleLoaderOptions = {
      clientFileName: false,
      selectFile: false
    };
    this.selected = false;

    this.companyMappings$ = this.store.select(fromOrgDataAutoloaderReducer.getFieldMappings);
    this.companyMappingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingFieldMappings);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.selectedCompany && !!changes.selectedCompany.currentValue) {
      this.selectedCompanySetting$ = this.companySettingsApiService.getCompanySettings(this.selectedCompany.CompanyId);

      this.selectedCompanySetting$.pipe(
        takeUntil(this.unsubscribe$),
        filter(companySetting => !!companySetting)
      ).subscribe(setting => {
        const jobRangeStruct = setting.find(s => s.Key === CompanySettingsEnum.EnableJobRangeStructureRangeTypes);
        if (jobRangeStruct.Value === 'true') {
          const internalJobRangeStructureFields = this.buildInternalFields(ORG_DATA_PF_JOB_RANGE_STRUCTURE_FIELDS, false);
          this.payfactorsStructureDataFields = this.payfactorsStructureDataFields.concat(internalJobRangeStructureFields);
          this.updateEntities();
        }
      });
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new fromOrgDataFieldMappingsActions.LoadingFieldMappings(this.selectedCompany.CompanyId, this.loaderConfigurationGroupId));
    this.updateEntities();
  }

  updateEntities() {
    this.entities.forEach(e => {
      if (this.enabledTabs(e.FileBeginsWith) && !this.selected) {
        e.isSelectedTab = true;
        this.selected = true;
      }
      switch (e.templateReferenceConstants) {
        case LoaderType.PayMarkets:
          e.payfactorsDataFields = this.payfactorsPaymarketDataFields;
          e.loaderEnabled = this.isPaymarketsLoadEnabled;
          break;
        case LoaderType.Jobs:
          e.payfactorsDataFields = cloneDeep(this.payfactorsJobDataFields);
          if (e.customFields !== null) {
            const customJobDisplayNames = e.customFields.Employees.map(udf => udf.Value);
            e.payfactorsDataFields.push.apply(e.payfactorsDataFields, this.buildInternalFields(customJobDisplayNames, false));
          }
          e.loaderEnabled = this.isJobsLoadEnabled;
          break;
        case LoaderType.Structures:
          e.payfactorsDataFields = this.payfactorsStructureDataFields;
          e.loaderEnabled = this.isStructuresLoadEnabled;
          break;
        case LoaderType.StructureMapping:
          e.payfactorsDataFields = this.payfactorsStructureMappingDataFields;
          e.loaderEnabled = this.isStructureMappingsLoadEnabled;
          break;
        case LoaderType.Subsidiaries:
          e.payfactorsDataFields = this.payfactorsSubsidiariesDataFields;
          e.loaderEnabled = this.isSubsidiariesLoadEnabled;
          break;
        case LoaderType.Benefits:
          e.payfactorsDataFields = this.payfactorsBenefitsDataFields;
          e.loaderEnabled = this.isBenefitsLoadEnabled;
          break;
        case LoaderType.Employees:
          e.payfactorsDataFields = cloneDeep(this.payfactorsEmployeeDataFields);
          if (e.customFields !== null) {
            const customEmployeeDisplayNames = e.customFields.Employees.map(udf => udf.Value);
            e.payfactorsDataFields.push.apply(e.payfactorsDataFields, this.buildInternalFields(customEmployeeDisplayNames, false));
          }
          e.loaderEnabled = this.isEmployeesLoadEnabled;
          break;
        case LoaderType.EmployeeTags:
          e.payfactorsDataFields = cloneDeep(this.payfactorsEmployeeTagsDataFields);
          if (e.customFields !== null) {
            e.payfactorsDataFields.push.apply(e.payfactorsDataFields, this.buildInternalFields(e.customFields.EmployeeKeyFields, false));
            e.payfactorsDataFields.push.apply(e.payfactorsDataFields, this.buildInternalFields(e.customFields.EmployeeTags, true));
          }
          e.loaderEnabled = this.isEmployeeTagsLoadEnabled;
      }
    });
  }
  enabledTabs(loaderType: string) {
    return this.entities.find(e => e.FileBeginsWith === loaderType.toLowerCase()).isChecked;
  }

  selectedTab(loaderType: string) {
    return this.entities.find(e => e.FileBeginsWith === loaderType.toLowerCase()).isSelectedTab;
  }

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }
    return this.entities.filter(x => x.isChecked);
  }

  onMappingComplete($event: LoaderEntityStatus) {
    this.mappingComplete.emit($event);
  }

  private buildInternalFields(fieldNames: string[], areDataElementNames: boolean) {
    const internalFields: InternalField[] = [];
    fieldNames.forEach(fieldName => {
      internalFields.push({FieldName: fieldName, IsDataElementName: areDataElementNames});
    });
    return internalFields;
  }
}
