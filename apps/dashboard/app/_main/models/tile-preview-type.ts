import { TilePreviewTypes } from './tile-preview-types';

export class TilePreviewType {
  AllTypes: TilePreviewTypes[];

  Chart = TilePreviewTypes.Chart;
  ChartWithCalendar = TilePreviewTypes.ChartWithCalendar;
  ChartWithList = TilePreviewTypes.ChartWithList;
  Icon = TilePreviewTypes.Icon;
  List = TilePreviewTypes.List;
  PlaceHolder = TilePreviewTypes.PlaceHolder;
  BasicList = TilePreviewTypes.BasicList;
  Peer = TilePreviewTypes.Peer;
  TotalRewards = TilePreviewTypes.TotalRewards;

  constructor() {
    this.AllTypes = [
      TilePreviewTypes.Chart,
      TilePreviewTypes.ChartWithCalendar,
      TilePreviewTypes.ChartWithList,
      TilePreviewTypes.Icon,
      TilePreviewTypes.List,
      TilePreviewTypes.PlaceHolder,
      TilePreviewTypes.BasicList,
      TilePreviewTypes.Peer,
      TilePreviewTypes.TotalRewards
    ];
  }
}
