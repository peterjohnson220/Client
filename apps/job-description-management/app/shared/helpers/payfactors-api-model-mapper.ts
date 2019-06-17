import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { JdmListFilter } from 'libs/models/user-profile';
import { ListAreaColumnResponse, UserFilterResponse } from 'libs/models/payfactors-api/user-profile/response';
import {
  ControlLabelResponse,
  JobDescriptionHistoryListItemResponse
} from 'libs/models/payfactors-api/job-description-management/response';
import {
  CompanyJobViewListItemsResponse,
  JobInformationFieldForBulkExportResponse
} from 'libs/models/payfactors-api/job-description/response';
import { ListAreaColumn } from 'libs/models/common';
import { TemplateListItemResponse } from 'libs/models/payfactors-api/job-description-template/response';
import {
  AppliesToAttributesExistResponse
} from 'libs/models/payfactors-api/job-description/response/applies-to-attributes-exist-response.model';
import { ListAreaColumnRequest } from 'libs/models/payfactors-api/user-profile/request/list-area-column-request.model';
import { CompositeFilterUppercase } from 'libs/models/jdm';

import { ControlLabel } from '../models/control-label.model';
import { AvailableJobInformationField } from '../models/available-job-information-field.model';
import { TemplateListItem } from '../models/template-list-item.model';
import { JobDescriptionHistoryListItem } from '../../_job-description/models/job-description-history-list-item.model';
import {
  JobDescriptionAppliesToItemResponse
} from 'libs/models/payfactors-api/job-description/response/job-description-appliesto-item-response.model';
import { JobDescriptionAppliesToItem } from '../models/job-description-appliesto-item.model';
import { AppliesToAttributesExist } from '../models/applies-to-attributes-exist.model';

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

  static mapListAreaColumnToListAreaColumnRequest(request: ListAreaColumn): ListAreaColumnRequest {
    return {
      ListAreaColumnId: request.ListAreaColumnId,
      ColumnDatabaseName: request.ColumnDatabaseName,
      ColumnDisplayName: request.ColumnDisplayName,
      ColumnDataType: request.ColumnDataType,
      Visible: request.Visible,
      Order: request.Order,
      Default: request.Default,
      Required: request.Required
    };
  }

  static mapListAreaColumnListToListAreaColumnRequestList(request: ListAreaColumn[]): ListAreaColumnRequest[] {
    return request.map(lacr => {
      return this.mapListAreaColumnToListAreaColumnRequest(lacr);
    });
  }

  static mapListAreaColumnResponseToListAreaColumn(response: ListAreaColumnResponse): ListAreaColumn {
    return {
      ListAreaColumnId: response.ListAreaColumnId,
      ColumnDatabaseName: response.ColumnDatabaseName,
      ColumnDisplayName: response.ColumnDisplayName,
      ColumnDataType: response.ColumnDataType,
      Visible: response.Visible,
      Order: response.Order,
      Default: response.Default,
      Required: response.Required,
      DisableDropdown: false
    };
  }

  static mapListAreaColumnResponseListToListAreaColumnList(response: ListAreaColumnResponse[]): ListAreaColumn[] {
    return response.map(lacr => {
      return this.mapListAreaColumnResponseToListAreaColumn(lacr);
    });
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
      Status: response.Status
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
}
