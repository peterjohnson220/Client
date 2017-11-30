export class Tile {
  constructor(
  public id: number,
  public name: string,
  public url: string,
  public position: number,
  public size: number = 1,
  public cssClass?: string,
  public bgColor?: string,
  public tileData?: any) {}
}
