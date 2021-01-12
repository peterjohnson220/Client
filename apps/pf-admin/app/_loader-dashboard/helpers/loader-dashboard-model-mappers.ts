import { CompositeDataLoadSearchCriteria } from 'libs/models/admin/loader-dashboard/request';
import {
  FieldMappingDiff,
  GridSearchPayload,
  LoaderSettingDiff,
  LoaderSettingDiffResponse,
  UpdatedArchiveSummaryModel,
  UpdatedArchiveSummaryResponse
} from '../models';

export class LoaderDashboardModelMappers {
  static mapGridSearchPayloadToSearchCriteria(x: GridSearchPayload): CompositeDataLoadSearchCriteria {
    return {
      StartDate: x.StartDate,
      EndDate: x.EndDate,
      ExcludeTestCompanies: x.ExcludeTestCompanies,
      Page: x.Page,
      PageSize: x.Page,
    };
  }

  static mapUpdatedArchiveSummary(response: UpdatedArchiveSummaryResponse): UpdatedArchiveSummaryModel {
    return {
      CompositeDataLoadId: response.CompositeDataLoadId,
      CompanyId: response.CompanyId,
      CompanyName: response.CompanyName,
      DetectedFiles: response.DetectedFiles,
      UpdatedFiles: response.UpdatedFiles,
      RecordedConfigurationGroupId: response.RecordedConfigurationGroupId,
      DetectedConfigurationGroupId: response.DetectedConfigurationGroupId,
      FieldMappingsDiffs: this.mapFieldMappingsDiffs(response.FieldMappingsDiffs),
      LoaderSettingsDiffs: response.LoaderSettingsDiffs.map(lsd => {
        return this.mapLoaderSettingDiffs(lsd);
      }),
      IsRedropCapable: response.IsRedropCapable,
      ArchiveName: response.ArchiveName
    };
  }

  static mapFieldMappingsDiffs(response: object): Map<string, FieldMappingDiff[]> {
    return new Map<string, FieldMappingDiff[]>(Object.entries(response));
  }

  static mapLoaderSettingDiffs(response: LoaderSettingDiffResponse): LoaderSettingDiff {
    return {
      LoaderSetting: response.LoaderSetting,
      RecordedValue: response.RecordedValue,
      CurrentValue: response.CurrentValue
    };
  }
}
