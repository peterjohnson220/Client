import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ControlTypeAttribute } from 'libs/models/common';
import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { Permissions } from 'libs/constants';
import { SaveError } from 'libs/models/common/save-error';

import * as fromCompanyFLSAStatusActions from '../actions/company-flsa-status.actions';
import * as fromJobDescriptionManagementSharedReducer from '../reducers';
import * as fromJobFamilyActions from '../actions/job-family.actions';
import * as fromControlTypesActions from '../actions/control-types.actions';
import { ControlDataHelper } from '../helpers';

@Injectable()
export class JobDescriptionManagementService {
  constructor(
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private companyJobApiService: CompanyJobApiService,
    private store: Store<fromJobDescriptionManagementSharedReducer.State>
  ) {
  }

  static getDefaultPermissions() {
    return [
      {permission: Permissions.JOB_DESCRIPTIONS, selected: true, display: 'View', disabled: true},
      {permission: Permissions.CAN_EDIT_JOB_DESCRIPTION, selected: false, display: 'Edit', disabled: false}
    ];
  }

  // Create a data row from control type attributes, and if data is passed in then
  // set the data attribute value if it can be sourced
  createDataRow(attributes: ControlTypeAttribute[], data?: string) {
    return ControlDataHelper.createDataRow(attributes, data);
  }

  getControlTypes() {
    this.store.dispatch(new fromControlTypesActions.LoadControlTypes());
  }

  getJobFamilies() {
    this.store.dispatch(new fromJobFamilyActions.LoadJobFamilies());
  }

  getJobFLSAStatuses() {
    this.store.dispatch(new fromCompanyFLSAStatusActions.LoadCompanyFlsaStatuses());
  }

  userEmailHasJobPermission(emailAddr: string, jobId: number) {
    return this.jobDescriptionManagementApiService.userEmailHasJobPermission(encodeURIComponent(emailAddr), jobId)
      .map(result => {
        return result;
      });
  }

  hasData(attributes: ControlTypeAttribute[], dataRow: any) {
    return attributes.some(a => !!dataRow[a.Name]);
  }

  inactivateControl(controlType: string) {
    return this.jobDescriptionManagementApiService.inactivateControl(controlType)
      .do(() => this.getControlTypes());
  }

  buildErrorModel(error: any, item: string, goBackLink: string) {
    const newError = new SaveError();

    newError.GoBackLink = goBackLink;

    if (error.status === 409) { // conflict error
      newError.IsConflict = true;
      newError.ErrorMessage = `Uh oh! It appears that your ${item} has become out of sync. Please refresh the page to continue.`;
    } else if (error.status === 403) {
      newError.IsConflict = false;
      newError.ErrorMessage = `You do not have permission to perform this action for this ${item}. ` +
        `Please contact your services associate for assistance.`;
    } else { // other error
      newError.IsConflict = false;
      newError.ErrorMessage = `There was an error saving this ${item}. Please contact your services associate for assistance.`;
    }

    return newError;
  }

  getJobsByControlOptionValue(controlName: string, fieldName: string, choiceFieldOptionValue: string): Observable<string[]> {
    return this.jobDescriptionManagementApiService.getJobsByControlOptionValue(controlName, fieldName, choiceFieldOptionValue);
  }

  getPublicJdmColumns(publicCompanyId: number) {
    return this.jobDescriptionManagementApiService.getPublicJdmColumns(publicCompanyId);
  }
}
