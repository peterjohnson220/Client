import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';

import { PayfactorsApiService } from '../payfactors-api.service';
import { EmailRecipientModel } from '../../../../apps/admin/app/_org-data-loader/models/email-recipient.model';


@Injectable()
export class DataLoadEmailRecipientsApiService {
  private endpoint = 'DataLoadEmailRecipients';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getRecipients(payload: any) {
    return this.payfactorsApiService.get<any>(`${this.endpoint}(${payload.companyId})`,
      {
        params: {
          loaderType: payload.loaderType
        }
      });
  }

  insertRecipient(recipient: EmailRecipientModel) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.Insert`, {recipient: recipient});
  }

  deleteRecipient(recipient: EmailRecipientModel) {
    return this.payfactorsApiService.delete<EmailRecipientModel>(`${this.endpoint}(${recipient.DataLoadEmailRecipientId})`,
      new RequestOptions({
        body: recipient
      })
    );
  }
}
