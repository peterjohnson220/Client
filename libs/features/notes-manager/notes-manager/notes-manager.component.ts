import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';
import { Store } from '@ngrx/store';
import { PricingNote } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { environment } from 'environments/environment';
import { Images } from 'libs/constants';

@Component({
  selector: 'pf-notes-manager',
  templateUrl: './notes-manager.component.html',
  styleUrls: ['./notes-manager.component.scss']
})
export class NotesManagerComponent implements OnChanges {

  @Input() showModal$: Observable<boolean>;
  @Input() pricingId: number;
  @Input() title = 'Pricing Notes';
  @Input() pricingNotesHeader: TemplateRef<any>;

  @Output() cancelChanges = new EventEmitter();

  loading$: Observable<boolean>;
  pricingNotes$: Observable<AsyncStateObj<PricingNote[]>>;

  avatarUrl = environment.avatarSource;
  defaultUserImage = Images.DEFAULT_USER;

  constructor(private store: Store<fromNotesManagerReducer.State>) {
    this.loading$ = this.store.select(fromNotesManagerReducer.getLoading);
    this.pricingNotes$ = this.store.select(fromNotesManagerReducer.getNotes);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricingId'] && changes['pricingId'].currentValue) {
      this.store.dispatch(new fromNotesManagerActions.GetNotes(changes['pricingId'].currentValue));
    }
  }

  onCancelChanges() {
    this.store.dispatch(new fromNotesManagerActions.ResetState());
    this.cancelChanges.emit();
  }

}
