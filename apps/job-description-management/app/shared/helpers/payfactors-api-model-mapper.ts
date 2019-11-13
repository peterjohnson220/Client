import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { JdmListFilter } from 'libs/models/user-profile';
import { UserFilterResponse } from 'libs/models/payfactors-api/user-profile/response';
import {
  ControlLabelResponse,
  JobDescriptionHistoryListItemResponse
} from 'libs/models/payfactors-api/job-description-management/response';
import {
  CompanyJobViewListItemsResponse,
  JobInformationFieldForBulkExportResponse,
  JobMatchResultResponse,
  ExtendedInfoResponse,
  JobDescriptionSourceResponse,
 JobDescriptionDataResponse
} from 'libs/models/payfactors-api/job-description/response';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response';
import {
  AppliesToAttributesExistResponse
} from 'libs/models/payfactors-api/job-description/response/applies-to-attributes-exist-response.model';
import { CompositeFilterUppercase, TemplateListItem } from 'libs/models/jdm';
import { ControlLabel, AvailableJobInformationField, JobDescriptionAppliesToItem, AppliesToAttributesExist } from '../models';

import {
  JobDescriptionAppliesToItemResponse
} from 'libs/models/payfactors-api/job-description/response/job-description-appliesto-item-response.model';
import { GetJobDescriptionData, JobDescriptionExtendedInfo, JobDescriptionHistoryListItem,
  JobMatchResult, JobDescriptionSource } from '../../_job-description/models';

export class PayfactorsApiModelMapper {
  static mapAppliesToAttributesExistResponseToAppliesToAttributesExist(response: AppliesToAttributesExistResponse):
    AppliesToAttributesExist {
    return {
      JobDescriptionTitleExists: response.JobDescriptionTitleExists,
      AppliesToExists: response.AppliesToExists,
      AppliesToValueInvalid: response.AppliesToValueInvalid,
      CanRemoveValues: response.CanRemoveValues,
      JobDescriptionAppliesTo: null
    };
  }

  static mapCompositeFilterToCompositeUppercase(compositeFilter: CompositeFilterDescriptor): CompositeFilterUppercase {
    if (!compositeFilter) {
      return null;
    }

    const filters: any[] = compositeFilter.filters;
    return {
      Logic: compositeFilter.logic,
      Filters: filters.map(f => {
        return {
          Field: f.field,
          Operator: f.operator,
          Value: f.value,
          IgnoreCase: f.ignoreCase
        };
      })
    };
  }

  static mapCompositeFilterUppercaseToCompositeFilter(compositeFilter: CompositeFilterUppercase): CompositeFilterDescriptor {
    const filters: any[] = compositeFilter.Filters;
    const logic: any = compositeFilter.Logic;
    return {
      logic: logic,
      filters: filters.map(f => {
        return {
          field: f.Field,
          operator: f.Operator,
          value: f.Value,
          ignoreCase: f.IgnoreCase
        };
      })
    };
  }

  static mapControlLabelResponseToControlLabel(response: ControlLabelResponse): ControlLabel {
    return {
      Label: response.Label,
      Type: response.Type,
      TemplateId: response.TemplateId,
      TemplateName: response.TemplateName
    };
  }

  static mapControlLabelResponseListToControlLabelList(response: ControlLabelResponse[]): ControlLabel[] {
    return response.map(clr => {
      return this.mapControlLabelResponseToControlLabel(clr);
    });
  }

  static mapCompanyJobViewListItemsResponseToGridDataResult(response: CompanyJobViewListItemsResponse): GridDataResult {
    return {
      total: response.Count,
      data: JSON.parse(response.Data)
    };
  }

  static mapJifForBulkExportResponseToAvailableJif(response: JobInformationFieldForBulkExportResponse): AvailableJobInformationField {
    return {
      Id: response.Id,
      DisplayName: response.DisplayName,
      FieldName: response.FieldName,
      IsDefault: response.IsDefault,
      IsRequired: response.IsRequired,
      Checked: false
    };
  }

  static mapJifForBulkExportResponseListToAvailableJifList(response: JobInformationFieldForBulkExportResponse[]):
    AvailableJobInformationField[] {
    return response.map(jiffber => this.mapJifForBulkExportResponseToAvailableJif(jiffber));
  }

  static mapJDAppliesToItemResponseToJDAppliesToItem(response: JobDescriptionAppliesToItemResponse):
    JobDescriptionAppliesToItem {
    return {
      DisplayName: response.DisplayName,
      ColumnName: response.ColumnName,
      Source: response.Source
    };
  }

  static mapJDAppliesToItemResponseListToJDAppliesToItemList(response: JobDescriptionAppliesToItemResponse[]):
    JobDescriptionAppliesToItem[] {
    return response.map(jdatir => this.mapJDAppliesToItemResponseToJDAppliesToItem(jdatir));
  }

  static mapJDDataResponseToJDDataResponseItem(response: JobDescriptionDataResponse):
    GetJobDescriptionData {
    return {
      JobDescriptionId: response.JobDescriptionId,
      RevisionNumber: response.JobDescriptionRevision
    };
  }

  static mapJDExtendedInfoResponseToJDExtendedInfoItem(response: ExtendedInfoResponse):
  JobDescriptionExtendedInfo {
    return {
      JobFamily: response.JobFamily,
      TemplateId: response.TemplateId,
      WorkflowId: response.WorkflowId
    };
  }

  static mapJDHistoryListItemResponseToJDHistoryListItem(response: JobDescriptionHistoryListItemResponse):
    JobDescriptionHistoryListItem {
    return {
      VersionNumber: response.VersionNumber,
      CreatedDate: response.CreatedDate,
      CreatedBy: response.CreatedBy,
      Status: response.Status,
      HasWorkflow: response.HasWorkflow
    };
  }

  static mapJDHistoryListItemResponseListToJDHistoryListItemList(response: JobDescriptionHistoryListItemResponse[]):
    JobDescriptionHistoryListItem[] {
    return response.map(jdhli => this.mapJDHistoryListItemResponseToJDHistoryListItem(jdhli));
  }

  static mapTemplateListItemResponseToTemplateItem(response: TemplateListItemResponse): TemplateListItem {
    return {
      TemplateId: response.TemplateId,
      TemplateName: response.TemplateName,
      CreatedBy: response.CreatedBy,
      CreatedDate: response.CreatedDate,
      LastModifiedBy: response.LastModifiedBy,
      LastModifiedDate: response.LastModifiedDate,
      EffectiveDate: null,
      AssignedJobsCount: response.AssignedJobsCount,
      Status: response.Status,
      Version: response.Version
    };
  }

  static mapTemplateListItemResponseListToTemplateItemList(response: TemplateListItemResponse[]): TemplateListItem[] {
    return response.map(tlir => {
      return this.mapTemplateListItemResponseToTemplateItem(tlir);
    });
  }

  static mapUserFilterResponseToJdmListFilter(response: UserFilterResponse): JdmListFilter {
    return {
      Id: response.Id.toString(),
      Name: response.Name,
      CompositeFilter: response.CompositeFilter
    };
  }

  static mapUserFilterResponseListToJdmListFilterList(response: UserFilterResponse[]): JdmListFilter[] {
    return response.map(ufr => {
      return this.mapUserFilterResponseToJdmListFilter(ufr);
    });
  }

  static mapJobMatchResultResponsesToJobMatchResults(response: JobMatchResultResponse[]): JobMatchResult[] {
    return response.map(j => {
      return this.mapJobMatchResultResponseToJobMatchResult(j);
    });
  }

  static mapJobMatchResultResponseToJobMatchResult(response: JobMatchResultResponse): JobMatchResult {
    return {
      Code: response.Code,
      EffectiveDate: response.EffectiveDate,
      Id: response.Id,
      IsSurvey: response.IsSurvey,
      MatchStrength: response.MatchStrength,
      Name: response.Name,
      SurveyId: response.SurveyId,
      SurveyName: response.SurveyName,
      SurveyPublisher: response.SurveyPublisher,
      JobDescription: response.JobDescription
    };
  }

  static mapJobDescriptionSourceResponsesToJobDescriptionSources(response: JobDescriptionSourceResponse[]): JobDescriptionSource[] {
    return response.map(jd => {
      return this.mapJobDescriptionSourceResponseToJobDescriptionSource(jd);
    });
  }

  static mapJobDescriptionSourceResponseToJobDescriptionSource(response: JobDescriptionSourceResponse): JobDescriptionSource {
    return {
      DescriptionId: response.DescriptionId,
      JobCode: response.JobCode,
      JobTitle: response.JobTitle,
      JobFamily: response.JobFamily,
      JobLevel: response.JobLevel,
      Status: response.Status,
      AppliesTo: response.AppliesTo,
      JobDescriptionTitle: response.JobDescriptionTitle,
      Version: response.Version
    };
  }
}
