export interface StatementDisplaySettings {
  ShowDecimals: boolean;
  ShowEmployeeContributions: boolean;
  ShowEmployeeId: boolean;
  ShowInformationEffectiveDate: boolean;
}

export enum StatementDisplaySettingsEnum {
  ShowDecimals = 'ShowDecimals',
  ShowEmployeeContributions = 'ShowEmployeeContributions',
  ShowEmployeeId = 'ShowEmployeeId',
  ShowInformationEffectiveDate = 'ShowInformationEffectiveDate'
}

export function generateMockDefaultDisplaySettings(): StatementDisplaySettings {
  return {
    ShowDecimals: false,
    ShowEmployeeContributions: false,
    ShowEmployeeId: true,
    ShowInformationEffectiveDate: true
  };
}
