export interface Tile {
  Id: number;
  Name: string;
  Url: string;
  Position: number;
  Size: number;
  CssClass?: string;
  BgColor?: string;
  TileData?: any;
}

export function generateMockTile(): Tile {
  return {
    Id: 1,
    Name: 'test tile',
    Url: 'test tile url',
    Position: 0,
    Size: 2,
    CssClass: 'test cssClass',
    BgColor: 'test bgColor',
    TileData: [ 'test tile data' ]
  };
}
