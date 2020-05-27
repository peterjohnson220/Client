import { CurrencyDto, Currency } from 'libs/models/common';

export class PayfactorsApiModelMapper {
  ///
  /// IN
  ///
  static mapCurrencyDtosToCurrency(cu: CurrencyDto[]): Currency[] {
    return cu.map(c => {
      return {
        CurrencyCode: c.CurrencyCode,
        CurrencyName: c.CurrencyName,
        CurrencyDisplay: `${c.CurrencyCode} - ${c.CurrencyName}`
      };
    });
  }
}
