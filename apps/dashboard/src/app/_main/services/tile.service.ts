import { Injectable } from '@angular/core';

import { Tile } from '../models/tile.model';
import { TileItem } from '../models/tile-item.model';

@Injectable()
export class TileService {

  getTiles() {
  return [new Tile(1, 'Employees', 'EmployeesUrl', 1, 1, 'tileBlue', 'Tile data here'),
      new Tile(2, 'Structures', 'URL', 2, 1, 'tileGreen'),
      new Tile(3, 'Pricing Projects', 'Url', 3, 2, 'tileLightBlue'),
      new Tile(4, 'Data Insights', 'Url', 4, 1, 'tileGreen'),
      new Tile(5, 'My Jobs', 'Url', 5, 2, 'tileLightBlue'),
      new Tile(6, 'Surveys', 'Url', 6, 1, 'tileBlue'),
      new Tile(7, 'Pay Markets', 'Url', 7, 1, 'tileBlue', 'pay markets tile data'),
      new Tile(8, 'Job Descriptions', 'Url', 8, 1, 'tileGreen'),
      new Tile(9, 'Resources', '', 9, 1, 'tileBlue'),
      new Tile(10, 'Service', '', 10, 1, 'tileGreen')];
  }
}
