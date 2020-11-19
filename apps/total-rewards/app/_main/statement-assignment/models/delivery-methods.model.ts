import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards';
import { DeliveryMethod } from 'libs/features/total-rewards/total-rewards-statement/models/delivery-method';

export interface DeliveryOption {
  Method: DeliveryMethod;
  EmailTemplate?: StatementEmailTemplate;
  SaveEmailTemplate?: boolean;
}
