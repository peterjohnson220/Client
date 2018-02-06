import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';


export interface TilePreviewList extends  TilePreviewBase {
  Title: string;
  SubTitle: string;
  DetailData: any;
}

  export function generateTilePreviewListFromTile(tile: Tile): TilePreviewList {

    const previewData = tile.TilePreviewData[0] !== undefined ?
      tile.TilePreviewData[0] : {Title: undefined, SubTitle: undefined, DetailData: undefined} ;

    const title =  previewData.Title !== undefined ? previewData.Title : undefined;
      const subTitle = previewData.SubTitle !== undefined ? previewData.SubTitle : undefined;
      const detailData = previewData.DetailData !== undefined && previewData.DetailData.length > 0 ? previewData.DetailData :  undefined;
      return {
        Title: title,
        SubTitle: subTitle,
        DetailData: detailData
      };
  }


