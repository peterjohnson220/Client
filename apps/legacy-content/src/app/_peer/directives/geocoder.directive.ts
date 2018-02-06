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
    this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
    this.mapLoadedSubscription = this.mapComponent.load.subscribe(map => {
      map.addControl(this.controlComponent.control, this.controlComponent.position);
    });
  }
  ngOnDestroy(): void {
    this.mapLoadedSubscription.unsubscribe();
  }
}

