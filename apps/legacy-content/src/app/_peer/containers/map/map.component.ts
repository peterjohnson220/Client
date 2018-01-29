import { Component } from '@angular/core';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent {
  paymarket = 'Boston';
  mapStyle = 'mapbox://styles/mapbox/light-v9';
  earthquakes = {
    'type': 'FeatureCollection',
    'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },

    'features': [
      {
        'type': 'Feature',
        'properties': { 'Primary ID': '1.26', 'Secondary ID': '7km NE of Lake Arrowhead, California' },
        'geometry': { 'type': 'Point', 'coordinates': [ -117.1413333, 34.297 ] }
      },
      {
        'type': 'Feature',
        'properties': { 'Primary ID': '1.87', 'Secondary ID': '13km NNE of Pahala, Hawaii' },
        'geometry': { 'type': 'Point', 'coordinates': [ -155.434494, 19.3199997 ] }
      }
     ]
  };

  constructor() { }
}
