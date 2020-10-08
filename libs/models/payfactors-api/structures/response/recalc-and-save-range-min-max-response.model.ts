import { CompanyStructureRange, CompanyStructureRangeOverride } from '../../../structures';


export interface RecalcAndSaveRangeMinMaxResponse {
  Range: CompanyStructureRange;
  RowIndex: number;
  Override: CompanyStructureRangeOverride;
}
