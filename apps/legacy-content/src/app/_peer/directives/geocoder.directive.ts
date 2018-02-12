import { Directive, Host, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { ɵn, ɵa } from 'ngx-mapbox-gl/';
import * as MapBoxGeocoder from 'mapbox-gl-geocoder';

import { environment } from 'environments/environment';

@Directive({
  selector: '[pfGeocoder]'
})
export class GeocoderDirective implements OnInit, OnDestroy {
  mapLoadedSubscription: Subscription;

  constructor(
    @Host() private controlComponent: ɵn,
    @Host() private mapComponent: ɵa
  ) {}

  ngOnInit(): void {
    this.mapLoadedSubscription = this.mapComponent.load.subscribe(map => {
      // This is a hack to get the GeoCoder control to render on top.
      const existingControl = this.controlComponent.control;
      map.removeControl(existingControl);
      map.addControl(new MapBoxGeocoder({accessToken: environment.mapboxAccessToken}), this.controlComponent.position);
      map.addControl(existingControl, this.controlComponent.position);
    });
  }
  ngOnDestroy(): void {
    this.mapLoadedSubscription.unsubscribe();
  }
}

