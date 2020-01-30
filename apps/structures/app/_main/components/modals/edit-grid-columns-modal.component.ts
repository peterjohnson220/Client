import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {take} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';
import {select, Store} from '@ngrx/store';

import {ListAreaColumn} from 'libs/models/common/list-area';
import { AsyncStateObj } from 'libs/models/state';

import * as fromStructures from '../../reducers';
import * as fromJobRangeModelingActions from '../../actions/job-range-modeling-grid.actions';

@Component({
  selector: 'pf-edit-grid-columns-modal',
  templateUrl: './edit-grid-columns-modal.component.html',
  styleUrls: ['./edit-grid-columns-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditGridColumnsModalComponent implements OnInit, OnDestroy {
  @ViewChild('editGridColumnsModal', { static: true }) public editGridColumnsModal: any;
  public ListAreaColumns: ListAreaColumn[];
  public loading: boolean;
  listAreaColumnsAsync$: Observable<AsyncStateObj<ListAreaColumn[]>>;
  listAreaColumnsLoading$: Observable<boolean>;
  listAreaColumnsLoadingSubscription: Subscription;
  modalReference: NgbModalRef;

  constructor(
    private store: Store<fromStructures.State>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
      this.listAreaColumnsAsync$ = this.store.pipe(select(fromStructures.getListAreaColumnsAsync));
      this.listAreaColumnsLoading$ = this.store.pipe(select(fromStructures.getListAreaColumnsLoading));
  }

  open() {
    this.modalReference = this.modalService.open(this.editGridColumnsModal, { backdrop: 'static', windowClass: 'edit-grid-columns-modal' });
    this.listAreaColumnsAsync$.pipe(
      take(1)
    ).subscribe(listAreaColumnsAsync => {
      this.ListAreaColumns = cloneDeep(listAreaColumnsAsync.obj);
    });
  }

  ngOnInit() {
    this.listAreaColumnsLoadingSubscription = this.listAreaColumnsLoading$.subscribe(listAreaColumnsLoading => {
      this.loading = listAreaColumnsLoading;
    });
  }

  ngOnDestroy() {
    this.listAreaColumnsLoadingSubscription.unsubscribe();
  }

  saveButtonClicked() {
    this.store.dispatch(new fromJobRangeModelingActions.SaveListAreaColumns({Columns: this.ListAreaColumns}));
    this.modalReference.close();
  }
}
