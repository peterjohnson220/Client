import { SsoUrl } from '../../constants';

export class SelectedCustomerConnection {
  CompanyName: string;
  CompanyId: number;
  IdpId: string;
  EmailDomain: string;
  MetadataFile: string;
  SsoLogOutUrl: string;
  Certificate: string;
}

export function generateMockSelectedCustomerConnection(): SelectedCustomerConnection {
  return {
    CompanyName: 'PayfactorsTest',
    CompanyId: 13,
    IdpId: 'pftestsso.com',
    EmailDomain: 'pftestsso.com',
    MetadataFile: '',
    SsoLogOutUrl: SsoUrl.SSO_DEFAULT_LOGOUT_URL,
    Certificate: ''
  };
}
