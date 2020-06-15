import { FeedStatus, MarketDataFeedExport } from '../model';

import { MarketDataFeed } from 'libs/models/payfactors-api/market-data-feed';

export class FeedApiModelMapper {
  static mapFeedResponseToFeed(feed: MarketDataFeed): MarketDataFeedExport {
    return {
      FileName: feed.FileName,
      Completed: feed.Completed,
      EffectiveDate: feed.EffectiveDate,
      FeedId: feed.Id,
      Failed: feed.Failed,
      Status: this.getFeedStatus(feed),
      DownloadUrl: `/odata/MarketDataFeed/DownloadFileExport?exportId=${feed.Id}`
    };
  }

  static mapFeedListRepsonseToFeed(feeds: MarketDataFeed[]): MarketDataFeedExport[] {
    return feeds.map(f => this.mapFeedResponseToFeed(f));
  }

  private static getFeedStatus(feed: MarketDataFeed): FeedStatus {
    if (feed.Completed && feed.FileName) {
      return FeedStatus.Completed;
    } else if (feed.StartDate) {
      return FeedStatus.InProgress;
    }
    return FeedStatus.Queued;
  }

}
