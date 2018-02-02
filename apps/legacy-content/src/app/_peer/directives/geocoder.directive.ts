import { Directive, Host, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { MapService, ɵn } from 'ngx-mapbox-gl/';
import * as MapBoxGeocoder from 'mapbox-gl-geocoder';

import { environment } from 'environments/environment';

@Directive({
  selector: '[pfGeocoder]'
})
export class GeocoderDirective implements OnInit {
  mapCreatedSubscription: Subscription;
  constructor(
    private mapService: MapService,
    @Host() private controlComponent: ɵn
  ) {}

  ngOnInit(): void {
    this.mapCreatedSubscription = this.mapService.mapCreated$.subscribe(created => {
      this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
      this.mapService.addControl(this.controlComponent.control, this.controlComponent.position);
    });
  }
}

