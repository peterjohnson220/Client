declare var newrelic: any;

export class NewRelicService {
  constructor() { }

  static setCustomAttributes(companyId: number, userId: number) {
    if (typeof newrelic === 'object' && companyId > 0 && userId > 0) {
      newrelic.setCustomAttribute('UserId', userId);
      newrelic.setCustomAttribute('CompanyId', companyId);
    }
  }
}
