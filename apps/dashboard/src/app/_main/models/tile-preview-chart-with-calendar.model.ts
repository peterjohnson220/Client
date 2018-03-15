import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewChartData } from './tile-preview-chart-data.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewChartWithCalendar extends TilePreviewBase {
  TileId: number;
  ChartType: string;
  ChartLabel: string;
  ChartComponentData: TilePreviewChartData[];
}

export function generateTilePreviewChartWithCalendarFromTile(tile: Tile): TilePreviewChartWithCalendar {
  return {
    TileId: tile.Id,
    PreviewType: TilePreviewTypes.Chart,
    ChartType: tile.ChartType,
    ChartLabel: tile.ChartLabel,
    ChartComponentData: tile.TilePreviewData,
  };
}
