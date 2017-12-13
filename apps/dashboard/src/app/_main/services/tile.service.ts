import { Injectable } from '@angular/core';

import { Tile } from '../models/tile.model';

@Injectable()
export class TileService {

  getTiles(): Tile[] {

    return [
      { Id: 1, Name: 'Employees', Url: '#', Position: 1, Size: 1, CssClass: 'tileBlue', TileData: 'tile data' },
      { Id: 2, Name: 'Structures', Url: '#', Position: 2, Size: 1, CssClass: 'tileGreen', TileData: 'tile data' },
      { Id: 3, Name: 'Pricing Projects', Url: '#', Position: 3, Size: 2, CssClass: 'tileLightBlue', TileData: 'tile data' },
      { Id: 4, Name: 'Data Insights', Url: '#', Position: 4, Size: 1, CssClass: 'tileGreen', TileData: 'tile data' },
      { Id: 5, Name: 'My Jobs', Url: '#', Position: 5, Size: 2, CssClass: 'tileLightBlue', TileData: 'tile data' },
      { Id: 6, Name: 'Surveys', Url: '#', Position: 6, Size: 1, CssClass: 'tileBlue', TileData: 'tile data' },
      { Id: 7, Name: 'Pay Markets', Url: '#', Position: 7, Size: 1, CssClass: 'tileBlue', TileData: 'tile data' },
      { Id: 8, Name: 'Job Descriptions', Url: '#', Position: 8, Size: 1, CssClass: 'tileGreen', TileData: 'tile data' },
      { Id: 9, Name: 'Resources', Url: '#', Position: 9, Size: 1, CssClass: 'tileBlue', TileData: 'tile data' },
      { Id: 10, Name: 'Service', Url: '#', Position: 10, Size: 1, CssClass: 'tileGreen', TileData: 'tile data' }];

  }
}
