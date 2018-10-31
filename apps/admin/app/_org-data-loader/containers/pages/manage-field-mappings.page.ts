import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Company } from 'libs/models/company/company.model';
import { OrgDataFieldMappingsApiService } from 'libs/data/payfactors-api/org-data-loader';

import * as fromOrgDataAutoloaderReducer from '../../reducers';
import * as fromCompanySelectorActions from '../../actions/company-selector.actions';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import { MappingModel } from '../../models';
import {
  ORG_DATA_PF_EMPLOYEE_FIELDS,
  ORG_DATA_PF_JOB_FIELDS, ORG_DATA_PF_PAYMARKET_FIELDS, ORG_DATA_PF_STRUCTURE_FIELDS,
  ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS
} from '../../constants';

@Component({
  selector: 'pf-autoloader-field-mapping-page',
  templateUrl: './manage-field-mappings.page.html',
  styleUrls: ['./manage-field-mappings.page.scss']
})
export class ManageFieldMappingsPageComponent implements OnInit {

  payfactorsPaymarketDataFields: string[];
  payfactorsJobDataFields: string[];
  payfactorsStructureDataFields: string[];
  payfactorsStructureMappingDataFields: string[];
  payfactorsEmployeeDataFields: string[];
  paymarketMappingComplete: boolean;
  jobMappingComplete: boolean;
  structureMappingComplete: boolean;
  structureMappingMappingComplete: boolean;
  employeeMappingComplete: boolean;
  companies$: Observable<Company[]>;
  companiesLoading$: Observable<boolean>;
  selectedCompany: number;
  mappings: MappingModel[];
  saveMappingsSuccess$: Observable<boolean>;
  saveMappingsError$: Observable<boolean>;
  saveMessage: string;
  saveClass: string;

  constructor (private store: Store<fromOrgDataAutoloaderReducer.State>, private orgDataAutoloaderApi: OrgDataFieldMappingsApiService) {
    this.payfactorsPaymarketDataFields = ORG_DATA_PF_PAYMARKET_FIELDS;
    this.payfactorsJobDataFields = ORG_DATA_PF_JOB_FIELDS;
    this.payfactorsStructureDataFields = ORG_DATA_PF_STRUCTURE_FIELDS;
    this.payfactorsStructureMappingDataFields = ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS;
    this.payfactorsEmployeeDataFields = ORG_DATA_PF_EMPLOYEE_FIELDS;

    this.paymarketMappingComplete = true;
    this.jobMappingComplete = true;
    this.structureMappingComplete = true;
    this.structureMappingMappingComplete = true;
    this.employeeMappingComplete = true;

    this.companies$ = this.store.select(fromOrgDataAutoloaderReducer.getCompanies);
    this.companiesLoading$ = this.store.select(fromOrgDataAutoloaderReducer.getCompaniesLoading);

    this.mappings = [];
    this.saveMappingsSuccess$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsSuccess);
    this.saveMappingsError$ = this.store.select(fromOrgDataAutoloaderReducer.getSavingFieldMappingsError);

    this.saveMappingsSuccess$.subscribe(success => {
      if (success) {
        this.saveClass = 'success';
        this.saveMessage = 'Mappings Saved.';
      }
    });

    this.saveMappingsError$.subscribe(error => {
      if (error) {
        this.saveClass = 'error';
        this.saveMessage = 'Saving Mappings Failed';
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromCompanySelectorActions.LoadingCompanies());
  }

  onPaymarketMappingComplete($event: any) {
    this.saveMessage = '';
    this.paymarketMappingComplete = $event.complete;
    if (this.paymarketMappingComplete) {
      this.addOrReplaceMappings('Paymarkets', $event.mappings);
    }
  }

  onJobMappingComplete($event: any) {
    this.saveMessage = '';
    this.jobMappingComplete = $event.complete;
    if (this.jobMappingComplete) {
      this.addOrReplaceMappings('Jobs', $event.mappings);
    }
  }

  onStructureMappingComplete($event: any) {
    this.saveMessage = '';
    this.structureMappingComplete = $event.complete;
    if (this.structureMappingComplete) {
      this.addOrReplaceMappings('Structures', $event.mappings);
    }
  }

  onStructureMappingMappingComplete($event: any) {
    this.saveMessage = '';
    this.structureMappingMappingComplete = $event.complete;
    if (this.structureMappingMappingComplete) {
      this.addOrReplaceMappings('StructureMapping', $event.mappings);
    }
  }

  onEmployeeMappingComplete($event: any) {
    this.saveMessage = '';
    this.employeeMappingComplete = $event.complete;
    if (this.employeeMappingComplete) {
      this.addOrReplaceMappings('Employees', $event.mappings);
    }
  }

  onCompanySelected($event: number) {
    this.selectedCompany = $event;
    this.orgDataAutoloaderApi.getCustomJobFields(this.selectedCompany).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsJobDataFields.push(udf.Value);
      });
    });

    this.orgDataAutoloaderApi.getCustomEmployeeFields(this.selectedCompany).subscribe(res => {
      res.forEach((udf) => {
        this.payfactorsEmployeeDataFields.push(udf.Value);
      });
    });
  }

  SaveMappings() {
    this.store.dispatch(new fromOrgDataFieldMappingsActions.SavingFieldMappings({
      mappings: this.mappings,
      companyId: this.selectedCompany
    }));
  }

  private addOrReplaceMappings(loaderType: string, mappings: string[]) {
    let index = -1;
    const mappingsModel: MappingModel = {
      LoaderType: loaderType,
      Mappings: mappings
    };

    for (let i = 0; i < this.mappings.length; i++) {
      if (this.mappings[i].LoaderType === loaderType) {
        index = i;
      }
    }

    if (index !== -1) {
      this.mappings[index] = mappingsModel;
    } else {
      this.mappings.push(mappingsModel);
    }
  }
}
