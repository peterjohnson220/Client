import { TilePreviewChartTypes } from './tile-preview-chart-types';

export class TilePreviewChartType {
  AllTypes: TilePreviewChartTypes[];

  Donut = TilePreviewChartTypes.donut;
  Pie = TilePreviewChartTypes.pie;

  constructor() {
    this.AllTypes = [
      TilePreviewChartTypes.donut,
      TilePreviewChartTypes.pie
    ];
  }
}
