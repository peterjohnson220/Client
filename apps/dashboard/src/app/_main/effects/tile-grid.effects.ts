import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { DashboardTile } from 'libs/models';

import * as fromDashboardActions from '../actions/tile-grid.actions';
import { Tile, TileType, TileTypes } from '../models';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .ofType(fromDashboardActions.LOADING_TILES)
    .switchMap(() =>
      this.dashboardApiService.getUserDashboardTiles()
        .map((dashboardTiles: DashboardTile[]) => this.mapDashboardTilesToTiles(dashboardTiles))
        .map((tiles: Tile[]) => new fromDashboardActions.LoadingTilesSuccess(tiles))
        .catch(error => of (new fromDashboardActions.LoadingTilesError(error)))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}

  static mapDashboardTileToTile(dashboardTile: DashboardTile): Tile {
    return {
      label: dashboardTile.TileName,
      iconClass: dashboardTile.IconClass,
      tileId: dashboardTile.TileId,
      type: TileGridEffects.mapTileNameToTileType(dashboardTile.TileName),
      payload: undefined
    };
  }

  static mapTileNameToTileType(label: string): TileTypes {
    switch (label) {
      case 'Employees':
        return TileTypes.Employees;
      case 'Data Insights':
        return TileTypes.DataInsights;
      case 'Job Descriptions':
        return TileTypes.JobDescriptions;
      case 'Jobs':
        return TileTypes.MyJobs;
      case 'Pay Markets':
        return TileTypes.PayMarkets;
      case 'Pricing Projects':
        return TileTypes.PricingProjects;
      case 'Resources':
        return TileTypes.Resources;
      case 'Service':
        return TileTypes.Service;
      case 'Structures':
        return TileTypes.Structures;
      case 'Surveys':
        return TileTypes.Structures;
      default:
        return TileTypes.Unknown;
    }
  }

  mapDashboardTilesToTiles(dashboardTiles: DashboardTile[]): Tile[] {
    const tileType = new TileType();
    return dashboardTiles
      .map(dt => TileGridEffects.mapDashboardTileToTile(dt))
      .filter(t => tileType.AllTypes.indexOf(t.type) !== -1);
  }
}
