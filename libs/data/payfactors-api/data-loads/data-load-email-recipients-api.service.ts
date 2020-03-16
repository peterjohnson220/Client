import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { EmailRecipientModel } from '../../../models/data-loads/email-recipient.model';


@Injectable()
export class DataLoadEmailRecipientsApiService {
  private endpoint = 'DataLoadEmailRecipients';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getRecipients(payload: any) {
    return this.payfactorsApiService.get<any>(`${this.endpoint}(${payload.companyId})`,
      {
        params: {
          loaderType: payload.loaderType,
          loaderConfigurationGroupId: payload.loaderConfigurationGroupId
        }
      });
  }

  insertRecipient(recipient: EmailRecipientModel) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.Insert`, {recipient: recipient});
  }

  deleteRecipient(recipient: EmailRecipientModel) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.Delete`, {recipient: recipient});
  }
}
