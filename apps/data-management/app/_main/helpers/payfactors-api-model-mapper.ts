import { TransferMethodResponse, ProviderResponse } from 'libs/models/hris-api';
import { TransferMethodTypes } from 'libs/constants/hris-api';
import { TransferMethod, Provider } from '../models';


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
        ImageUrl: p.providerImageUrl
      };
    });
  }
}
