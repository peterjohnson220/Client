import { TilePreviewChartTypes } from './tile-preview-chart-types';

export class TilePreviewChartType {
  AllTypes: TilePreviewChartTypes[];

  Donut = TilePreviewChartTypes.Donut;
  Pie = TilePreviewChartTypes.Pie;

  constructor() {
    this.AllTypes = [
      TilePreviewChartTypes.Donut,
      TilePreviewChartTypes.Pie
    ];
  }
}
