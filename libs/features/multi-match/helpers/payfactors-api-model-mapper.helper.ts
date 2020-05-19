import { MatchedSurveyJob } from 'libs/models/payfactors-api';

import { JobToPrice } from '../models';


export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///

  static mapMatchedSurveyJobToJobsToPrice(sjl: MatchedSurveyJob[]): JobToPrice[] {
    return sjl.map((sj: MatchedSurveyJob): JobToPrice => {
      return {
        Code: sj.Job.Code,
        JobMatchCuts: [],
        Description: sj.Job.Description,
        Family: sj.Job.Family,
        Id: Number(sj.Id),
        Level: sj.Job.Level,
        Paymarket: sj.Paymarket,
        PaymarketId: sj.PaymarketId,
        Title: sj.Job.Title,
        TotalDataCuts: sj.DataCutsCount,
        LoadingDataCuts: false,
        LoadingDataCutsError: false
      };
    });
  }
}
