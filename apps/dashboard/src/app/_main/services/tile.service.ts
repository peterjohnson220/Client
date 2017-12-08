import { Injectable } from '@angular/core';

import { Tile } from '../models/tile.model';

@Injectable()
export class TileService {

  getTiles(): Tile[] {

    return [
      { id: 1, name: 'Employees', url: '#', position: 1, size: 1, cssClass: 'tileBlue', tileData: 'tile data' },
      { id: 2, name: 'Structures', url: '#', position: 2, size: 1, cssClass: 'tileGreen', tileData: 'tile data' },
      { id: 3, name: 'Pricing Projects', url: '#', position: 3, size: 2, cssClass: 'tileLightBlue', tileData: 'tile data' },
      { id: 4, name: 'Data Insights', url: '#', position: 4, size: 1, cssClass: 'tileGreen', tileData: 'tile data' },
      { id: 5, name: 'My Jobs', url: '#', position: 5, size: 2, cssClass: 'tileLightBlue', tileData: 'tile data' },
      { id: 6, name: 'Surveys', url: '#', position: 6, size: 1, cssClass: 'tileBlue', tileData: 'tile data' },
      { id: 7, name: 'Pay Markets', url: '#', position: 7, size: 1, cssClass: 'tileBlue', tileData: 'tile data' },
      { id: 8, name: 'Job Descriptions', url: '#', position: 8, size: 1, cssClass: 'tileGreen', tileData: 'tile data' },
      { id: 9, name: 'Resources', url: '#', position: 9, size: 1, cssClass: 'tileBlue', tileData: 'tile data' },
      { id: 10, name: 'Service', url: '#', position: 10, size: 1, cssClass: 'tileGreen', tileData: 'tile data' }];

  }
}
