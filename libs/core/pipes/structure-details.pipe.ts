import { Pipe, PipeTransform } from '@angular/core';

import { StructureDetails } from '../../ui/structure-details/models/structure-details.model';

@Pipe({
  name: 'structureDetails'
})
export class StructureDetailsPipe implements PipeTransform {

  transform(StructureDataRow: any): StructureDetails {
    return {
      StructureName: StructureDataRow['vw_CompanyJobsStructureInfo_Structure_Name'],
      CurrencyCode: StructureDataRow['vw_CompanyJobsStructureInfo_Currency'],
      Rate: StructureDataRow['vw_CompanyJobsStructureInfo_Rate'],
      EffectiveDate: StructureDataRow['vw_CompanyJobsStructureInfo_Effective_Date'],
      PayMarket: StructureDataRow['CompanyPayMarkets_PayMarket'],
      ControlPoint: StructureDataRow['vw_CompanyJobsStructureInfo_Control_Point']
    };
  }

}
