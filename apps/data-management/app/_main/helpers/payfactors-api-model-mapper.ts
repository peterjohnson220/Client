import { TransferMethodResponse, ProviderResponse,
  AuthenticationTypeResponse, CredentialsPackage, ConnectionPostRequest } from 'libs/models/hris-api';
import { TransferMethodTypes } from 'libs/constants/hris-api';
import { TransferMethod, Provider, AuthenticationType } from '../models';


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

  static mapFormValuesToCredentialsPackage(request: any, providerCode: string): CredentialsPackage {
    return {
      APIKey: request.apiKey ? request.apiKey : null,
      UserName: request.username ? request.username : null,
      Password: request.password ? request.password : null,
      Domain: request.domain ? request.domain : null,
      ProviderCode: providerCode
    };
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
}
