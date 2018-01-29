import { Directive, Host, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { MapService, ɵn } from 'ngx-mapbox-gl/';
import * as MapBoxGeocoder from 'mapbox-gl-geocoder';

import { environment } from 'environments/environment';

@Directive({
  selector: '[pfGeocoder]'
})
export class GeocoderDirective implements OnInit, OnDestroy {
  mapLoadedSubscription: Subscription;
  mapCreatedSubscription: Subscription;
  @Input('payMarket') payMarket = '';
  constructor(
    private mapService: MapService,
    @Host() private controlComponent: ɵn
  ) {}

  ngOnInit(): void {
    this.mapCreatedSubscription = this.mapService.mapCreated$.subscribe(() => {
      this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
    });
    this.mapLoadedSubscription = this.mapService.mapLoaded$.subscribe(() => {
      const geo: any = this.controlComponent.control;
      if (this.controlComponent.content.nativeElement) {
        geo.query(this.payMarket);
      }
    });
  }
  ngOnDestroy(): void {
    this.mapCreatedSubscription.unsubscribe();
    this.mapLoadedSubscription.unsubscribe();
  }
}

