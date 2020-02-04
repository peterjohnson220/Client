import { ImportDataType, OrgDataEntityType, TransferMethodTypes} from 'libs/constants/hris-api';
import {
  AuthenticationTypeResponse,
  ConnectionPostRequest,
  CredentialsPackage,
  MappingPackage,
  PayfactorsEntityFieldsResponse,
  ProviderEntitiyFieldsResponse,
  ProviderResponse,
  TransferMethodResponse,
  ProviderSupportedEntityDTO, TransferScheduleSummary, SyncScheduleDtoModel,
  MappingPayloadItem,
  MappingPayloadMapping,
  ConnectionSummaryResponse
} from 'libs/models/hris-api';

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

  static mapFormValuesToCredentialsPackage(request: any, providerCode: string, selectedEntities: EntityTypeModel[]): CredentialsPackage {
    const c = {
      providerCode: providerCode,
      syncEmployees: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Employees) > -1,
      syncJobs: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Jobs) > -1,
      syncPaymarkets: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.PayMarkets) > -1,
      syncStructures: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Structures) > -1,
      syncStructureMappings: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.StructureMappings) > -1
    } as CredentialsPackage;

    switch (providerCode) {
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

  static createConnectionPostRequest(request: CredentialsPackage, companyId: number, providerId: number): ConnectionPostRequest {
    return {
      connection: {
        company_ID: companyId,
        provider_ID: providerId,
        active: true
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
        HasAssociation: false,
        DataType: ImportDataType[pef.dataType]
      };
    });
  }

  static createMappingPackage(request: EntityField): MappingPackage {
    return {
      MappingPayload: {
        Items: Object.entries(request)
          .map(([entityType, fields]) => this.getMappingsForEntity(entityType, fields))
          .filter( mpi => mpi.Mappings.length > 0)
      }
    };
  }

  static getMappingsForEntity(entityType: string , fields: EntityDataField[]): MappingPayloadItem {
    return {
      OrgDataEntityType: entityType,
      Mappings: fields.filter(field => field.AssociatedEntity && field.AssociatedEntity.length > 0)
      .map(field => ({
        DestinationField: field.FieldName,
        SourceField: field.AssociatedEntity[0].FieldName,
        SourceMetadata: {
          DataType: field.AssociatedEntity[0].DataType,
          IsArray: false,
          MetaData: {},
          Name: field.AssociatedEntity[0].FieldName
        }
      }))
    };
  }

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
      selectedEntities: connectionSummary.selectedEntities
    };
  }
}
