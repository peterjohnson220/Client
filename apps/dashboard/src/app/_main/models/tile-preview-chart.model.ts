import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewChartData } from './tile-preview-chart-data.model';

export interface TilePreviewChart extends  TilePreviewBase {
  ChartType: string;
  ChartLabel: string;
  ChartComponentData: TilePreviewChartData[];
}
