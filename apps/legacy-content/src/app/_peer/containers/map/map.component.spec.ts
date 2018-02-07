// import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
//
// import { StoreModule, Store, combineReducers } from '@ngrx/store';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Map, Control } from 'mapbox-gl';
// import { MapService, ɵa, SetupMap, NgxMapboxGLModule } from 'ngx-mapbox-gl';
//
// import * as fromRootState from 'libs/state/state';
// import { generateMockExchangeMapResponse } from 'libs/models/peer';
//
// import * as fromPeerDataReducer from '../../reducers';
// import { MapComponent } from './map.component';
// import * as fromPeerMapActions from '../../actions/peer-map.actions';
// import { GeocoderDirective } from '../../directives';
//
// @Injectable()
// export class ActivatedRouteStub {
//
//   // ActivatedRoute.paramMap is Observable
//   private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
//   paramMap = this.subject.asObservable();
//
//   // Test parameters
//   private _testParamMap: ParamMap;
//   get testParamMap() { return this._testParamMap; }
//   set testParamMap(params: {}) {
//     this._testParamMap = convertToParamMap(params);
//     this.subject.next(this._testParamMap);
//   }
//
//   // ActivatedRoute.snapshot.paramMap
//   get snapshot() {
//     return { paramMap: this.testParamMap };
//   }
// }
// TODO: According to the following issue, MapBox GL doesn't support out of browser initialization. (JP)
// TODO: https://github.com/mapbox/mapbox-gl-js/issues/3436
// TODO: In the future, we may want to separate the mapbox portion into a dumb component so that we can run these tests.
// TODO: However, at this point, these tests don't add much value anyways.
describe('Legacy Content - Peer - Map Component', () => {
// let fixture: ComponentFixture<MapComponent>;
// let instance: MapComponent;
// let store: Store<fromRootState.State>;
// let route: ActivatedRouteStub;
  it('should have commented out tests', () => {
    return undefined;
  });
//   const queryStringParams = {companyPayMarketId: 1, companyJobId: 2};
//   // Configure Testing Module for before each test
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           ...fromRootState.reducers,
//           peerData: combineReducers(fromPeerDataReducer.reducers)
//         }),
//         NgxMapboxGLModule
//       ],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: ActivatedRouteStub,
//         }
//       ],
//       declarations: [
//         Map,
//         Control,
//         GeocoderDirective
//       ],
//       // Shallow Testing
//       schemas: [ NO_ERRORS_SCHEMA ]
//     });
//
//     store = TestBed.get(Store);
//     route = TestBed.get(ActivatedRoute);
//
//     route.testParamMap = queryStringParams;
//
//     spyOn(store, 'dispatch');
//
//     fixture = TestBed.createComponent(MapComponent);
//     instance = fixture.componentInstance;
//   });
//
//   it('should dispatch LoadingInitialPeerMapFilter action OnInit using the route query string parameters', () => {
//     const expectedAction = new fromPeerMapActions.LoadingInitialPeerMapFilter({
//       CompanyJobId: queryStringParams.companyJobId,
//       CompanyPayMarketId: queryStringParams.companyPayMarketId
//     });
//
//     fixture.detectChanges();
//
//     expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
//   });
//
//   it('should dispatch an UpdatePeerMapFilterBounds action when refreshMap is called if canLoadPeerMap$ is true', () => {
//     const mockMapEvent = getMockMapEvent();
//     const expectedAction = new fromPeerMapActions.UpdatePeerMapFilterBounds({
//       bounds: mockMapEvent.getBounds(),
//       zoom: mockMapEvent.getZoom()
//     });
//
//     store.dispatch(new fromPeerMapActions.LoadingPeerMapSuccess(generateMockExchangeMapResponse()))
//
//     fixture.detectChanges();
//
//     instance.refreshMap(mockMapEvent);
//
//     expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
//   });
//
});
//
// export function getMockMapEvent(): any {
//   return {
//     target: {
//       _loaded: true,
//       getBounds() {
//         return [0, 0, 0, 0];
//       },
//       getZoom() {
//         return 1;
//       }
//     }
//   };
// }
