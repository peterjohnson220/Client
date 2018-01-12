import { Component } from '@angular/core';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  mapStyle = 'mapbox://styles/mapbox/light-v9';
  constructor() { }
}
