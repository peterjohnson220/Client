import { SsoUrl } from '../../constants';

export class CustomerConnection {
  Email: string;
  CompanyId: number;
  FileData: string;
  LogOutUrl: string;
}

export function generateMockCustomerConnection(): CustomerConnection {
  return {
    Email: 'pfSsoTest@pfSsoTest.com',
    CompanyId: 13,
    FileData: '',
    LogOutUrl: SsoUrl.SSO_DEFAULT_LOGOUT_URL
  };
}
