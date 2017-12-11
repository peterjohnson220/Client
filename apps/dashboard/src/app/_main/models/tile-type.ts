import { TileTypes } from './tile-types';

export class TileType {
  AllTypes: TileTypes[] = [];
  DataInsights: TileTypes;
  Employees: TileTypes;

  constructor() {
    let index = 0;
    this.DataInsights = TileTypes.DataInsights;
    this.AllTypes[index++] = TileTypes.DataInsights;

    this.Employees = TileTypes.Employees;
    this.AllTypes[index++] = TileTypes.Employees;
  }
}
