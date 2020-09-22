import { CompanyStructureRange, CompanyStructureRangeOverride } from '../../../structures';

export interface RevertRangeResponse {
  Range: CompanyStructureRange;
  OverrideDeleted: boolean;
  Override: CompanyStructureRangeOverride;
}
