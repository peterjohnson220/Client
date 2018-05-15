import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewChartWithCalendarData } from './tile-preview-chart-with-calendar-data.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewChartWithCalendar extends TilePreviewBase {
  TileId: number;
  ChartType: string;
  ChartLabel: string;
  ComponentData: TilePreviewChartWithCalendarData;
}

export function generateTilePreviewChartWithCalendarFromTile(tile: Tile): TilePreviewChartWithCalendar {
  return {
    TileId: tile.Id,
    PreviewType: TilePreviewTypes.ChartWithCalendar,
    ChartType: tile.ChartType,
    ChartLabel: tile.ChartLabel,
    ComponentData: tile.TilePreviewData ? tile.TilePreviewData[0] : null
  };
}
