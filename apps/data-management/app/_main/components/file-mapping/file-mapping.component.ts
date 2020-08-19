import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  LoaderType,
  ORG_DATA_PF_EMPLOYEE_FIELDS,
  ORG_DATA_PF_JOB_FIELDS,
  ORG_DATA_PF_PAYMARKET_FIELDS,
  ORG_DATA_PF_STRUCTURE_FIELDS,
  ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from 'libs/features/org-data-loader/constants';
import {LoaderEntityStatus, VisibleLoaderOptionModel} from 'libs/features/org-data-loader/models';
import { LoaderFieldSet } from 'libs/models/data-loads';
import {CompanySelectorItem} from 'libs/features/company/company-selector/models';
import { ILoadSettings } from 'libs/features/org-data-loader/helpers';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/organizational-data-field-mapping.actions';
import {EntityChoice} from '../../models';



@Component({
  selector: 'pf-file-mapping',
  templateUrl: './file-mapping.component.html',
  styleUrls: ['./file-mapping.component.scss']
})
export class FileMappingComponent implements OnInit {
  @Input() entities: EntityChoice[];
  @Input() existingCompanyLoaderSettings: ILoadSettings;
  @Input() selectedCompany: CompanySelectorItem;
  @Input() loaderConfigurationGroupId: number;
  @Output() mappingComplete = new EventEmitter();

  payfactorsPaymarketDataFields: string[];
  payfactorsJobDataFields: string[];
  payfactorsStructureDataFields: string[];
  payfactorsStructureMappingDataFields: string[];
  payfactorsEmployeeDataFields: string[];
  templateReferenceConstants = {
    LoaderType,
  };
  isEmployeesLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  visibleLoaderOptions: VisibleLoaderOptionModel;
  companyMappings$: Observable<LoaderFieldSet[]>;
  companyMappingsLoading$: Observable<boolean>;

  selected: boolean;

  constructor (private store: Store<fromOrgDataAutoloaderReducer.State>) {
    this.payfactorsPaymarketDataFields = ORG_DATA_PF_PAYMARKET_FIELDS;
    this.payfactorsJobDataFields = ORG_DATA_PF_JOB_FIELDS;
    this.payfactorsStructureDataFields = ORG_DATA_PF_STRUCTURE_FIELDS;
    this.payfactorsStructureMappingDataFields = ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS;
    this.payfactorsEmployeeDataFields = ORG_DATA_PF_EMPLOYEE_FIELDS;
    this.isEmployeesLoadEnabled = false;
    this.isJobsLoadEnabled = false;
    this.isPaymarketsLoadEnabled = false;
    this.isStructuresLoadEnabled = false;
    this.isStructureMappingsLoadEnabled = false;
    this.visibleLoaderOptions = {
      clientFileName: false,
      selectFile: false
    };
    this.selected = false;

    this.companyMappings$ = this.store.select(fromOrgDataAutoloaderReducer.getFieldMappings);
    this.companyMappingsLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getLoadingFieldMappings);
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
            e.customFields.Jobs.forEach((j) => {
              e.payfactorsDataFields.push(j.Value);
            });
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
        case LoaderType.Employees:
          e.payfactorsDataFields = cloneDeep(this.payfactorsEmployeeDataFields);
          if (e.customFields !== null) {
            e.customFields.Employees.forEach((em) => {
              e.payfactorsDataFields.push(em.Value);
            });
          }
          e.loaderEnabled = this.isEmployeesLoadEnabled;
          break;
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
}
