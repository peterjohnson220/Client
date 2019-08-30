import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { remove } from 'lodash';

import { AsyncStateObj } from 'libs/models/state';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';
import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

import * as fromStructuresMainReducer from '../../../reducers';
import * as fromJobBasedRangeAllStructuresActions from '../../../actions/job-based-range-all-structures.actions';

@Component({
  selector: 'pf-job-based-range-structures-page',
  templateUrl: './job-based-range-structures.page.html',
  styleUrls: ['./job-based-range-structures.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobBasedRangeStructuresPageComponent implements OnInit, OnDestroy {
  companyStructureViewsAsync$: Observable<AsyncStateObj<CompanyStructureView[]>>;
  filteredCompanyStructureViewsSubscription: Subscription;
  filteredCompanyStructureViews: CompanyStructureView[];
  filteredCompanyStructureFavorites: CompanyStructure[];
  addCompanyStructureFavoriteErrorSubscription: Subscription;
  removeCompanyStructureFavoriteErrorSubscription: Subscription;

  constructor(public route: ActivatedRoute, private store: Store<fromStructuresMainReducer.State>) {
    this.companyStructureViewsAsync$ = this.store.pipe(select(fromStructuresMainReducer.getCompanyStructureViewsAsync));
    this.filteredCompanyStructureViewsSubscription =
      this.store.pipe(select(fromStructuresMainReducer.getFilteredCompanyStructureViews)).subscribe((emittedFilteredStructures) => {
        this.filteredCompanyStructureViews = cloneDeep(emittedFilteredStructures);
        this.filteredCompanyStructureFavorites = cloneDeep(emittedFilteredStructures.filter(
          csv => csv.IsFavorite).map(csv => csv.Structure));
      });
    this.addCompanyStructureFavoriteErrorSubscription =
      this.store.pipe(
        select(fromStructuresMainReducer.getCompanyStructureAddFavoriteError), filter(e => !!e)).subscribe((errorCompanyStructureId) => {
        // todo: show error toast
        this.removeCompanyStructureFavoriteLocal(errorCompanyStructureId, true);
        this.store.dispatch(new fromJobBasedRangeAllStructuresActions.ClearStructureFavoriteErrors());
      });
    this.removeCompanyStructureFavoriteErrorSubscription =
      this.store.pipe(
        select(fromStructuresMainReducer.getCompanyStructureRemoveFavoriteError), filter(e => !!e)).subscribe((errorCompanyStructureId) => {
        // todo: show error toast
        const errorCompanyStructure = this.filteredCompanyStructureViews.find(
          sv => sv.Structure.CompanyStructuresId === errorCompanyStructureId).Structure;
        this.addCompanyStructureFavoriteLocal(errorCompanyStructure, true);
        this.store.dispatch(new fromJobBasedRangeAllStructuresActions.ClearStructureFavoriteErrors());
      });
  }

  ngOnInit(): void {
    this.store.dispatch(new fromJobBasedRangeAllStructuresActions.GetCompanyStructureViews());
  }

  handleSearchClicked() {
  }

  handleFavoriteClicked(structureView: CompanyStructureView) {
    if (structureView.IsFavorite) {
      this.removeCompanyStructureFavoriteLocal(structureView.Structure.CompanyStructuresId);
      this.store.dispatch(new fromJobBasedRangeAllStructuresActions.RemoveStructureFavorite(structureView.Structure.CompanyStructuresId));
    } else {
      this.addCompanyStructureFavoriteLocal(structureView.Structure);
      this.store.dispatch(new fromJobBasedRangeAllStructuresActions.AddStructureFavorite(structureView.Structure.CompanyStructuresId));
    }
  }

  private addCompanyStructureFavoriteLocal(structure: CompanyStructure, isError = false) {
    this.filteredCompanyStructureFavorites.push(structure);

    if (isError) {
      this.filteredCompanyStructureViews.find(sv => sv.Structure.CompanyStructuresId === structure.CompanyStructuresId).IsFavorite = true;
    }
  }

  private removeCompanyStructureFavoriteLocal(companyStructureId: number, isError = false) {
    remove(this.filteredCompanyStructureFavorites, (sf) => sf.CompanyStructuresId === companyStructureId);

    if (isError) {
      this.filteredCompanyStructureViews.find(sv => sv.Structure.CompanyStructuresId === companyStructureId).IsFavorite = false;
    }
  }

  ngOnDestroy(): void {
    this.filteredCompanyStructureViewsSubscription.unsubscribe();
    this.addCompanyStructureFavoriteErrorSubscription.unsubscribe();
    this.removeCompanyStructureFavoriteErrorSubscription.unsubscribe();
  }
}
