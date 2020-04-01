import { isEmpty } from 'lodash';

import { ImportDataType, OrgDataEntityType, TransferMethodTypes} from 'libs/constants/hris-api';
import { LoaderFileFormat, LoaderSettingsKeys } from 'libs/features/org-data-loader/constants';
import { LoaderSettings, OrgDataLoadHelper } from 'libs/features/org-data-loader/helpers';
import {
  AuthenticationTypeResponse,
  ConnectionPostRequest,
  ConnectionSummaryResponse,
  CredentialsPackage,
  FieldMappingsDTO,
  LoaderSettingsDTO,
  MappingPackage,
  MappingPayloadItem,
  PayfactorsEntityFieldsResponse,
  ProviderEntitiyFieldsResponse,
  ProviderResponse,
  ProviderSupportedEntityDTO,
  SyncScheduleDtoModel,
  TransferMethodResponse,
  TransferScheduleSummary,
  UserContext,
} from 'libs/models';

import {
  AuthenticationType,
  EntityTypeModel,
  EntityDataField,
  PfTestCredentialsPackage,
  Provider,
  TransferMethod,
  WorkdayRestCredentialsPackage, WorkdaySoapCredentialsPackage,
  EntityChoice,
  EntityField,
  ConnectionSummary
} from '../models';

export class PayfactorsApiModelMapper {
  static mapTransferMethodResponseToTransferMethod(response: TransferMethodResponse[]): TransferMethod[] {
    return response.map(tmr => {
      const selected = tmr.transferMethodName.toLowerCase() === TransferMethodTypes.HRIS_INTEGRATION;
      return {
        TransferMethodId: tmr.transferMethod_ID,
        TransferMethodName: tmr.transferMethodName,
        TransferMethodCode: tmr.transferMethodCode,
        Selected: selected
      };
    });
  }

  static mapProviderResponseToProvider(response: ProviderResponse): Provider {
    return {
      ProviderId: response.provider_ID,
      ProviderName: response.providerName,
      ProviderCode: response.providerCode,
      ImageUrl: response.providerImageUrl,
      AuthenticationTypeId: response.authenticationType_ID,
      Active: response.active,
    };
  }

  static mapProviderResponsesToProviders(response: ProviderResponse[]): Provider[] {
    return response.map(p => this.mapProviderResponseToProvider(p));
  }

  static mapAuthenticationTypeResponseToAuthenticationType(response: AuthenticationTypeResponse): AuthenticationType {
    return {
      AuthenticationCode: response.authenticationTypeCode,
      AuthenticationTypeId: response.authenticationType_ID,
      AuthenticationTypeName: response.authenticationTypeName
    };
  }

  static mapFormValuesToCredentialsPackage(request: any, connectionSummary: ConnectionSummary): CredentialsPackage {
    const c = {
      providerCode: connectionSummary.provider.ProviderCode,
      syncEmployees: connectionSummary.selectedEntities.includes(OrgDataEntityType.Employees),
      syncJobs: connectionSummary.selectedEntities.includes(OrgDataEntityType.Jobs),
      syncPaymarkets: connectionSummary.selectedEntities.includes(OrgDataEntityType.PayMarkets),
      syncStructures: connectionSummary.selectedEntities.includes(OrgDataEntityType.Structures),
      syncStructureMappings: connectionSummary.selectedEntities.includes(OrgDataEntityType.StructureMappings),
    } as CredentialsPackage;

    switch (connectionSummary.provider.ProviderCode) {
      case 'WORKDAY':
      case 'WDMOCK':
        return {
          ...c,
          UserName: request.username,
          Password: request.password,
          Domain: request.domain
        } as WorkdaySoapCredentialsPackage;
      case 'PFTEST':
        return {
          ...c,
          UserName: request.username,
          Password: request.password
        } as PfTestCredentialsPackage;
      case 'WDRESTRPT':
        return {
          ...c,
          UserName: request.username,
          Password: request.password,
          employeeReportUrl: request.employeeReportUrl,
          jobReportUrl: request.jobReportUrl,
          paymarketReportUrl: request.paymarketReportUrl,
          structureReportUrl: request.structureReportUrl,
          structureMappingReportUrl: request.structureMappingReportUrl
        } as WorkdayRestCredentialsPackage;
    }
  }

  static createConnectionPostRequest(
    request: CredentialsPackage,
    companyId: number,
    providerId: number,
    loaderConfigurationGroupId?: number
  ): ConnectionPostRequest {
    return {
      connection: {
        company_ID: companyId,
        provider_ID: providerId,
        active: true,
        loaderConfigurationGroupId,
      },
      credentialsPackage: request
    };
  }

  static mapPayfactorsEntityFieldsResponseToEntityDataField(response: PayfactorsEntityFieldsResponse, entityType: OrgDataEntityType): EntityDataField[] {
    return response.payfactorsEntityFields.map( pef => {
      return {
        EntityFieldId: pef.entityField_ID,
        EntityType: entityType,
        FieldName: pef.fieldName,
        DisplayName: pef.fieldName,
        IsRequired: pef.requiredField,
        HasDescription: pef.hasDescription,
        Description: pef.description,
        AssociatedEntity: [],
        DataType: ImportDataType[pef.dataType]
      };
    });
  }

  static mapProviderEntityFieldsResponseToEntityDataField(response: ProviderEntitiyFieldsResponse, entityType: OrgDataEntityType): EntityDataField[] {
    return response.fields.map( pef => {
      return {
        EntityType: entityType,
        FieldName: pef.name,
        DisplayName: pef.name,
        HasAssociation: false,
        Metadata: pef.metadata,
        IsArray: pef.isArray,
        DataType: ImportDataType[pef.dataType]
      };
    });
  }

  static createMappingPackage(request: EntityField): MappingPackage {
    return {
      mappingPayload: {
        items: Object.entries(request)
          .map(([entityType, fields]) => this.getMappingsForEntity(entityType, fields))
          .filter( mpi => mpi.mappings.length > 0
            && mpi.orgDataEntityType !== OrgDataEntityType.JobDescriptions ) // TODO: Remove this once we start on actual outbound integration
      }
    };
  }

  static getMappingsForEntity(entityType: string, fields: EntityDataField[]): MappingPayloadItem {
    return {
      orgDataEntityType: entityType,
      mappings: fields.filter(field => field.AssociatedEntity && field.AssociatedEntity.length > 0)
      .map(field => ({
        destinationField: field.FieldName,
        sourceField: field.AssociatedEntity[0].FieldName,
        sourceMetadata: {
          dataType: field.AssociatedEntity[0].DataType,
          isArray: field.AssociatedEntity[0].IsArray,
          metaData: field.AssociatedEntity[0].Metadata,
          name: field.AssociatedEntity[0].FieldName
        }
      }))
    };
  }

  static getLoadersMappings = (companyId: number, connectionSummary: ConnectionSummary, mappings: EntityField): FieldMappingsDTO => ({
    companyId,
    mappings: Object.entries(mappings)
      .filter(([entityType]) => entityType !== OrgDataEntityType.JobDescriptions)
      .map(([entityType, fields]: [string, EntityDataField[]]) => ({
        LoaderType: entityType,
        Mappings: fields.filter(field => !isEmpty(field.AssociatedEntity)).map(field => `${field.FieldName}__${field.AssociatedEntity[0].FieldName}`),
      })),
    loaderConfigurationGroupId: connectionSummary.loaderConfigurationGroupId
  })

  static mapEntitySelectionResponseToEntitySelection(response: ProviderSupportedEntityDTO[]): EntityChoice[] {
    return response.map(p => {
      return {
        isChecked: false,
        DisplayText: p.entityMappingTypeName,
        ToolTip: p.description,
        FileBeginsWith: null,
        File: null,
        isSelectedTab: null,
        templateReferenceConstants: null,
        payfactorsDataFields: null,
        loaderEnabled: null,
        columnNames: null,
        customFields: null,
        dbName: p.entityMappingTypeCode,
        isFullReplace: null,
        dateFormat: null,
        isLoadingFinish: true
      };
    });
  }

  static mapEntityChoiceToEntityTypeModel(providerSupportedEntities): EntityTypeModel[] {
    return providerSupportedEntities.filter(p => p.isChecked).map(x => {
      let type;
      switch (x.dbName) {
        case OrgDataEntityType.Employees:
            type = OrgDataEntityType.Employees;
            break;
        case OrgDataEntityType.Jobs:
            type = OrgDataEntityType.Jobs;
            break;
        case OrgDataEntityType.StructureMappings:
            type = OrgDataEntityType.StructureMappings;
            break;
        case OrgDataEntityType.Structures:
            type = OrgDataEntityType.Structures;
            break;
        case OrgDataEntityType.PayMarkets:
            type = OrgDataEntityType.PayMarkets;
            break;
        default: type = null;
      }
      return {
        EntityType: type,
        EntityName: x.DisplayText
      };
    });
  }

  static mapTransferScheduleSummariesToSyncScheduleDto(transferScheduleSummary: TransferScheduleSummary[]): SyncScheduleDtoModel[] {
    return transferScheduleSummary.map(t => {
      return {
        Expression: t.expression,
        EntityMappingType_ID: t.entityMappingType_ID,
        Active: t.active === 1,
        SyncSchedule_ID: t.syncSchedule_ID ? t.syncSchedule_ID : 0
      };
    });
  }

  static mapConnectionSummaryResponseToConnectionSummaryDto(connectionSummary: ConnectionSummaryResponse): ConnectionSummary {
    return {
      provider: connectionSummary.provider ? this.mapProviderResponseToProvider(connectionSummary.provider) : null,
      canEditConnection: connectionSummary.canEditConnection,
      hasConnection: connectionSummary.hasConnection,
      canEditMappings: connectionSummary.canEditMappings,
      statuses: connectionSummary.statuses,
      selectedEntities: connectionSummary.selectedEntities.map(e => OrgDataEntityType[e]),
      connectionID: connectionSummary.connection_ID,
      loaderConfigurationGroupId: connectionSummary.loaderConfigurationGroupId,
    };
  }

  static mapEntityChoicesWithConnectionSummary(entityChoices: EntityChoice[], connectionSummary: ConnectionSummary): EntityChoice[] {
    return entityChoices.map(e => {
      return {
        ...e,
        isChecked: connectionSummary.selectedEntities.findIndex(s => s === e.dbName) > -1
      };
    });
  }

  static mapSelectedEntityChoicesToOrgDataEntityTypes(entityChoices: EntityChoice[]): OrgDataEntityType[] {
    return entityChoices.filter(e => e.isChecked).map(e => {
      return e.dbName as OrgDataEntityType;
    });
  }

  static getLoaderSettingsForConnection = (summary: ConnectionSummary): LoaderSettings => ({
    isActive: true,
    isCompanyOnAutoloader: false,
    delimiter: null,
    dateFormat: null,
    isEmployeesLoadEnabled: summary.selectedEntities.includes(OrgDataEntityType.Employees),
    isJobsLoadEnabled: summary.selectedEntities.includes(OrgDataEntityType.Jobs),
    isPaymarketsLoadEnabled: summary.selectedEntities.includes(OrgDataEntityType.PayMarkets),
    isStructuresLoadEnabled: summary.selectedEntities.includes(OrgDataEntityType.Structures),
    isStructureMappingsLoadEnabled: summary.selectedEntities.includes(OrgDataEntityType.StructureMappings),
    fileFormat: LoaderFileFormat.JSON,

    // TODO: we need a UI to determine these settings
    isEmployeesFullReplace: false,
    isStructureMappingsFullReplace: false,
    validateOnly: false,
  })

  static getLoaderSettingsDtoForConnection = (userContext: UserContext, summary: ConnectionSummary): LoaderSettingsDTO => ({
    companyId: userContext.CompanyId,
    loaderConfigurationGroupId: summary.loaderConfigurationGroupId,
    settings: OrgDataLoadHelper.getLoaderSettingsToSave(PayfactorsApiModelMapper.getLoaderSettingsForConnection(summary), []),
  })

  static getDisabledLoaderSettingsDtoForConnection = (userContext: UserContext, summary: ConnectionSummary): LoaderSettingsDTO => ({
    companyId: userContext.CompanyId,
    loaderConfigurationGroupId: summary.loaderConfigurationGroupId,
    settings: [{
      LoaderSettingsId: undefined,
      KeyName: LoaderSettingsKeys.IsActive,
      KeyValue: 'false',
    }],
  })
}
