import { TilePreviewTypes } from './tile-preview-types';

export class TilePreviewType {
  AllTypes: TilePreviewTypes[];

  Chart = TilePreviewTypes.Chart;
  ChartWithCalendar = TilePreviewTypes.ChartWithCalendar;
  ChartWithList = TilePreviewTypes.ChartWithList;
  Icon = TilePreviewTypes.Icon;
  List = TilePreviewTypes.List;
  PlaceHolder = TilePreviewTypes.PlaceHolder;

  constructor() {
    this.AllTypes = [
      TilePreviewTypes.Chart,
      TilePreviewTypes.ChartWithCalendar,
      TilePreviewTypes.ChartWithList,
      TilePreviewTypes.Icon,
      TilePreviewTypes.List,
      TilePreviewTypes.PlaceHolder
    ];
  }
}
