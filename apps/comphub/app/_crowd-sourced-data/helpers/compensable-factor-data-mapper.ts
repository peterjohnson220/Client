import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

export class CompensableFactorDataMapper {


  static getCompensableFactorDataMap(data: CompensableFactorsResponseModel[]): CompensableFactorsResponseModel[]{
    Object.keys(data).forEach(key => {
      data[key].map( x => {
        x.Selected = false;
      });
    });

    return data;
  }
}
