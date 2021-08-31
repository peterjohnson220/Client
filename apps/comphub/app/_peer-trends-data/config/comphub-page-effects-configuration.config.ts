import * as fromComphubPageActions from '../../_shared/actions/comphub-page.actions';
import { IComphubPageEffectsConfiguration } from '../../_shared/helpers';

export class PeerTrendsComphubPageEffectsConfiguration implements IComphubPageEffectsConfiguration {
  comphubPageEffectsActionOverrides = [
    new fromComphubPageActions.UpdateFooterContext,
    new fromComphubPageActions.GetExchangeDataSets,
    new fromComphubPageActions.UpdateActiveCountryDataSet(''),
    new fromComphubPageActions.UpdateActiveExchangeDataSet(0)
  ];

}
