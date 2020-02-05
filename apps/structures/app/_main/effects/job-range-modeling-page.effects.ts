import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { StructuresApiService, StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { UpdateCompanyStructureRangeGroupNameDto } from 'libs/models/structures/update-company-structure-range-group-name-dto.model';

import * as fromJobRangeModelingActions from '../actions/job-range-modeling-page.actions';
import { JobRangeModelingResponse } from '../constants/structures.constants';

@Injectable()
export class JobRangeModelingPageEffects {
  @Effect()
  getStructureData$ = this.actions$
    .pipe(
      ofType(fromJobRangeModelingActions.GET_STRUCTURE_DATA),
      map((action: fromJobRangeModelingActions.GetStructureData) => action.payload),
      switchMap((companyStructureId: number) =>
        this.structuresApiService.getCompanyStructure(companyStructureId)
          .pipe(
            map((response) => new fromJobRangeModelingActions.GetStructureDataSuccess(response))
          )
      )
    );

  @Effect()
  getModelData$ = this.actions$
    .pipe(
      ofType(fromJobRangeModelingActions.GET_MODEL_DATA),
      map((action: fromJobRangeModelingActions.GetModelData) => action.payload),
      switchMap((companyStructureRangeGroupId: number) =>
        this.structuresRangeGroupApiService.getCompanyStructureRangeGroup(companyStructureRangeGroupId)
          .pipe(
            map((response) => new fromJobRangeModelingActions.GetModelDataSuccess(response))
          )
      )
    );

  @Effect()
  editCurrentModelName$ = this.actions$
    .pipe(
      ofType(fromJobRangeModelingActions.UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME),
      map((action: fromJobRangeModelingActions.UpdateCurrentCompanyStructureRangeGroupName) => action.payload),
      switchMap((updateCompanyStructureRangeGroupNameDto: UpdateCompanyStructureRangeGroupNameDto) =>
        this.structuresRangeGroupApiService.updateCompanyStructureRangeGroupName(updateCompanyStructureRangeGroupNameDto)
          .pipe(
            map((response) => new fromJobRangeModelingActions.UpdateCurrentCompanyStructureRangeGroupNameSuccess(response)),
            catchError(error =>
              of(new fromJobRangeModelingActions.UpdateCurrentCompanyStructureRangeGroupNameError(
                JobRangeModelingResponse.CompanyStructureRangeGroupError)))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private structuresApiService: StructuresApiService,
    private structuresRangeGroupApiService: StructureRangeGroupApiService
  ) {
  }
}
