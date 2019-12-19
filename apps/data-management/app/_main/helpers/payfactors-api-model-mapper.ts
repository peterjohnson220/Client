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
  ProviderSupportedEntityDTO
} from 'libs/models/hris-api';

import {
  AuthenticationType,
  EntityTypeModel,
  EntityDataField,
  PfTestCredentialsPackage,
  Provider,
  TransferMethod,
  WorkdayRestCredentialsPackage, WorkdaySoapCredentialsPackage,
  EntityChoice
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

  static mapProviderResponseToProvider(response: ProviderResponse[]): Provider[] {
    return response.map(p => {
      return {
        ProviderId: p.provider_ID,
        ProviderName: p.providerName,
        ProviderCode: p.providerCode,
        ImageUrl: p.providerImageUrl,
        AuthenticationTypeId: p.authenticationType_ID
      };
    });
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
      ProviderCode: providerCode,
      SyncEmployees: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Employees) > -1,
      SyncJobs: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Jobs) > -1,
      SyncPaymarkets: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.PayMarkets) > -1,
      SyncStructures: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.Structures) > -1,
      SyncStructureMappings: selectedEntities.findIndex(s => s.EntityType === OrgDataEntityType.StructureMappings) > -1
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
        EntityType: entityType,
        FieldName: pef.fieldName,
        IsRequired: pef.requiredField,
        HasDescription: pef.hasDescription,
        Description: pef.description,
        AssociatedEntity: []
      };
    });
  }

  static mapProviderEntityFieldsResponseToEntityDataField(response: ProviderEntitiyFieldsResponse, entityType: OrgDataEntityType): EntityDataField[] {
    return response.fields.map( pef => {
      return {
        EntityType: entityType,
        FieldName: pef.name
      };
    });
  }

  static createMappingPackage(request: any, entityType: OrgDataEntityType): MappingPackage {
    return {
      MappingPayload: {
        Items: [
          {
            OrgDataEntityType: entityType,
            Mappings: [
              {
                DestinationField: '',
                SourceField: '',
                SourceMetadata: {
                  DataType: ImportDataType.String,
                  IsArray: false,
                  Name: '',
                  MetaData: ''
                }
              }
            ]
          }
        ]
      }
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
        dbName: p.entityMappingTypeCode
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
}
