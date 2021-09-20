export interface JobPricingChartSettings {
  MarginLeft: number;
  MarginRight: number;
  MarginBottom: number;
  SpacingTop: number;
  Height: number;
  Theme: 'print' | 'default';
  ShowPayLabel: boolean;
  DecimalPlaces: number;
  LabelYPosition?: number;
  PayLabel?: string;
  IncludeAvgLine?: boolean;
  ForceDecimals?: boolean;
  ForceChartAlignment?: boolean;
  TooltipYOffset?: number;
  TooltipXOffset?: number;
}

export function getDefaultChartSettings(): JobPricingChartSettings {
  return {
    MarginLeft: 100,
    MarginRight: 30,
    MarginBottom: 30,
    SpacingTop: 30,
    Height: 100,
    Theme: 'default',
    ShowPayLabel: true,
    DecimalPlaces: 1,
    LabelYPosition: -5,
    IncludeAvgLine: true,
    ForceDecimals: true,
    ForceChartAlignment: false,
    TooltipYOffset: -27,
    TooltipXOffset: 83
  };
}
