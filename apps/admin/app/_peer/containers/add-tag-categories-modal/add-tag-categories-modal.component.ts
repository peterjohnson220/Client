import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { State } from '@progress/kendo-data-query';

import { PfValidators } from 'libs/forms/validators';
import { GridTypeEnum } from 'libs/models/common';
import { AddTagCategoriesRequest, Exchange } from 'libs/models/peer';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';

@Component({
  selector: 'pf-add-tag-categories-modal',
  templateUrl: './add-tag-categories-modal.component.html',
  styleUrls: ['./add-tag-categories-modal.component.scss']
})

export class AddTagCategoriesModalComponent implements OnInit, OnDestroy {
  addTagCategoriesModalOpen$: Observable<boolean>;
  addingTagCategoriesToExchange$: Observable<boolean>;
  addingTagCategoriesToExchangeError$: Observable<boolean>;
  gridState$: Observable<State>;
  exchange$: Observable<Exchange>;

  selections: number[] = [];
  selections$: Observable<number[]>;
  selectionsSubscription: Subscription;
  addTagCategoriesModalOpenSubscription: Subscription;

  addTagCategoriesForm: FormGroup;
  attemptedSubmit = false;
  exchangeId: number;
  searchTerm: string;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.addTagCategoriesModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getAddTagCategoriesModalOpen));
    this.addingTagCategoriesToExchange$ = this.store.pipe(select(fromPeerAdminReducer.getAddingTagCategoriesToExchange));
    this.addingTagCategoriesToExchangeError$ = this.store.pipe(select(fromPeerAdminReducer.getAddingTagCategoriesToExchangeError));
    this.selections$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridSelections));
    this.gridState$ = this.store.pipe(select(fromPeerAdminReducer.getTagCategoriesGridStateForModal));
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));

    this.exchangeId = this.route.parent.snapshot.params.id;
    this.createForm();
  }

  get primaryButtonText() {
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Add (${numOfSelections})`;
  }
  get primaryButtonTextSubmitting() {
    const numOfSelections = this.selections ? this.selections.length : 0;
    return `Adding (${numOfSelections})`;
  }
  get selectionsControl() { return this.addTagCategoriesForm.get('selections'); }

  createForm(): void {
    this.addTagCategoriesForm = this.fb.group({
      'selections': [[], [PfValidators.selectionRequired]]
    });
  }

  // Events
  handleModalDismissed() {
    this.attemptedSubmit = false;
    this.searchTerm = '';
    this.store.dispatch(new fromTagCategoriesActions.CloseAddTagCategoriesModal());
    this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.TagCategories));
  }

  handleFormSubmit() {
    this.attemptedSubmit = true;
    const addTagCategoriesRequest: AddTagCategoriesRequest = {
      ExchangeId: this.exchangeId,
      TagCategoryIds: this.selections
    };
    this.store.dispatch(new fromTagCategoriesActions.AddTagCategoriesToExchange(addTagCategoriesRequest));
  }

  handleCellClick(): void {
    this.selectionsControl.markAsTouched();
  }

  updateSearchFilter(newSearchTerm: string) {
    this.store.dispatch(new fromGridActions.UpdateFilter(
      GridTypeEnum.TagCategories,
      {columnName: 'DisplayName', value: newSearchTerm}
    ));
    this.loadTagCategories();
  }

  ngOnInit() {
    this.selectionsSubscription = this.selections$.subscribe(selections => {
      this.selections = selections;
    });
    this.addTagCategoriesModalOpenSubscription = this.addTagCategoriesModalOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.loadTagCategories();
      }
    });
  }

  ngOnDestroy() {
    this.selectionsSubscription.unsubscribe();
    this.addTagCategoriesModalOpenSubscription.unsubscribe();
  }

  // Helper Method
  loadTagCategories() {
    this.gridState$.pipe(take(1)).subscribe(gridState => {
      this.store.dispatch(new fromTagCategoriesActions.LoadTagCategories(
        {
          exchangeId: this.exchangeId,
          listState: gridState
        }
      ));
    });
  }
}
