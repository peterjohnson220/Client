import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewChartData } from './tile-preview-chart-data.model';

export interface TilePreviewChart extends  TilePreviewBase {
  ChartType: string;
  ChartLabel: string;
  ChartComponentData: TilePreviewChartData[];
}

export function generateTilePreviewChartFromTile(tile: Tile): TilePreviewChart {
  return {
    ChartType: tile.ChartType,
    ChartLabel: tile.ChartLabel,
    ChartComponentData: tile.TilePreviewData,
  };
}
