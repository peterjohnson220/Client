declare var newrelic: any;

export class NewRelicService {
  constructor() { }

  static setCustomAttributes(companyId: number, userId: number, ipAddress: string, sessionId: string, location: string) {
    if (typeof newrelic === 'object' && companyId > 0 && userId > 0) {
      newrelic.setCustomAttribute('UserId', userId);
      newrelic.setCustomAttribute('CompanyId', companyId);
      newrelic.setCustomAttribute('RequestIp', ipAddress);
      newrelic.setCustomAttribute('SessionId', sessionId);
      newrelic.setCustomAttribute('Location', location);
    }
  }
}
