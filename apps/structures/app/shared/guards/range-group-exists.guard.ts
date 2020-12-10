import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import * as fromRootState from 'libs/state/state';

import * as fromMetadataActions from '../../_job-based-range/shared/actions/shared.actions';
import * as fromJobBasedRangeReducer from '../../_job-based-range/shared/reducers';
import { PayfactorsApiModelMapper } from '../../_job-based-range/shared/helpers/payfactors-api-model-mapper';

@Injectable()
export class RangeGroupExistsGuard implements CanActivate, OnDestroy {
  userContextSubscription: Subscription;
  companyId: number;

  constructor(
    private store: Store<fromJobBasedRangeReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userContextSubscription = this.store.pipe(select(fromRootState.getUserContext))
      .subscribe(context => this.companyId = context.CompanyId);
  }

  rangeGroupExists(rangeGroupId: number): Observable<boolean> {
    return this.structureRangeGroupApiService.getCompanyStructureRangeGroup(rangeGroupId).pipe(
      map((response) => {
        if (response) {
          const metadata = PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(response);
          this.store.dispatch(new fromMetadataActions.SetMetadata(metadata));
          this.store.dispatch(new fromMetadataActions.GetCompanyExchanges(this.companyId));
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

  ngOnDestroy(): void {
    this.userContextSubscription.unsubscribe();
  }
}
