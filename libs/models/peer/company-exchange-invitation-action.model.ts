import { ExchangeRequestAction, generateMockExchangeRequestAction } from './exchange-request-action.model';
import { ExchangeInvitation, generateMockExchangeInvitation } from './exchange-invitation.model';

export interface CompanyExchangeInvitationAction extends ExchangeRequestAction {
  CompanyInvitation: ExchangeInvitation;
}

export function generateMockCompanyExchangeInvitationAction(): CompanyExchangeInvitationAction {
  return {
    ...generateMockExchangeRequestAction(),
    CompanyInvitation: generateMockExchangeInvitation()
  };
}
