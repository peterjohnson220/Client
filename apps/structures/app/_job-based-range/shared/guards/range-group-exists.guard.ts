import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';

import * as fromMetadataActions from '../actions/shared.actions';
import * as fromJobBasedRangeReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class RangeGroupExistsGuard implements CanActivate {

  constructor(
    private store: Store<fromJobBasedRangeReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  rangeGroupExists(rangeGroupId: number): Observable<boolean> {
    return this.structureRangeGroupApiService.getCompanyStructureRangeGroup(rangeGroupId).pipe(
      map((response) => {
        if (response) {
          const metadata = PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(response);
          this.store.dispatch(new fromMetadataActions.SetMetadata(metadata));
          return true;
        } else {
          this.router.navigate(['/not-found'], { relativeTo: this.route });
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-found'], { relativeTo: this.route });
        return of(false);
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.rangeGroupExists(route.params.id);
  }
}
