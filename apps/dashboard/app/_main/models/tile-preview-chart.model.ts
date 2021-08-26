import { TileTypes } from 'libs/models';

import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewChartData } from './tile-preview-chart-data.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewChart extends  TilePreviewBase {
  TileType: TileTypes;
  ChartType: string;
  ChartLabel: string;
  ShouldLimitLegendText: boolean;
  ChartComponentData: TilePreviewChartData[];
}

export function generateTilePreviewChartFromTile(tile: Tile): TilePreviewChart {
  return {
    TileType: tile.Type,
    PreviewType: TilePreviewTypes.Chart,
    ChartType: tile.ChartType,
    ChartLabel: tile.ChartLabel,
    ShouldLimitLegendText: tile.ShouldLimitLegendText,
    ChartComponentData: tile.TilePreviewData,
  };
}
