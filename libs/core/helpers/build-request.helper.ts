import { PayMarket } from '../../models/paymarket';
import { DefaultScope, NewlyAddedDefaultScope } from '../../features/paymarkets/paymarket-management/models';
import { ExchangeScopes } from '../../models/peer/exchange-scope';
import { AddPayMarketRequest, UpdatePayMarketRequest } from '../../models/payfactors-api/paymarket/request';

export class BuildRequestHelper {
  static buildAddPayMarketRequest(payMarketDto: PayMarket, defaultScopes?: DefaultScope[], exchangeScopes?: ExchangeScopes[]): AddPayMarketRequest {
    return {
      DefaultExchangeScopes: exchangeScopes.length !== 0 ? this.mapExchangeScopesToNewlyAddedExchangeScope(exchangeScopes) : [],
      DefaultScopes: defaultScopes.length !== 0 ? this.mapDefaultScopesToNewlyAddedDefaultScope(defaultScopes) : [],
      PayMarket: payMarketDto
    };
  }

  static buildUpdatePayMarketRequest(payMarketDto: PayMarket, defaultScopes?: DefaultScope[],
                                     exchangeScopes?: ExchangeScopes[], defaultScopesToDelete?: number[]): UpdatePayMarketRequest {
    return {
      DefaultExchangeScopes: exchangeScopes.length !== 0 ? this.mapExchangeScopesToNewlyAddedExchangeScope(exchangeScopes) : [],
      DefaultScopes: defaultScopes.length !== 0 ? this.mapDefaultScopesToNewlyAddedDefaultScope(defaultScopes) : [],
      DefaultScopeIdsToDelete: defaultScopesToDelete,
      PayMarket: payMarketDto
    };
  }

  static mapDefaultScopesToNewlyAddedDefaultScope(defaultScopes: DefaultScope[]): NewlyAddedDefaultScope[] {
    return defaultScopes.map((x) => {
      return {
        CombinedScope: x.Scope.Value,
        SurveyId: x.Survey.Id
      };
    });
  }

  static mapExchangeScopesToNewlyAddedExchangeScope(exchangeScopes: ExchangeScopes[]): number[] {
    const exchangeScopeIds = [];
    exchangeScopes.forEach(es => {
      es.ExchangeScopeItems.forEach( esi => {
        exchangeScopeIds.push(esi.ExchangeScopeId);
      });
    });
    return exchangeScopeIds;
  }
}
