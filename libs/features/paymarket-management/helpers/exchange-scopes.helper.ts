import { GenericKeyValue, ExchangeScopes } from 'libs/models';

export class ExchangeScopesHelper {
  static mapGenericKeyValuesToExchangeScopes(
    response: GenericKeyValue<number, string>[],
    allExchangeScopes: ExchangeScopes[]): ExchangeScopes[] {
      return response.map(i => {
        const exchange = allExchangeScopes.find(e => e.ExchangeId === i.Key);
        const scope = exchange?.ExchangeScopeItems.find(s => s.ExchangeScopeGuid === i.Value);
        if (exchange && scope) {
          return {
            ExchangeId: exchange.ExchangeId,
            ExchangeName: exchange.ExchangeName,
            ExchangeScopeItems: [scope]
          };
        }
      });
  }
}
