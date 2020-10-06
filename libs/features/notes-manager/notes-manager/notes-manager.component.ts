import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj, NotesBase } from 'libs/models';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';
import { NotesManagerContentComponent } from '../containers';
import { ApiServiceType } from '../constants/api-service-type-constants';

@Component({
  selector: 'pf-notes-manager',
  templateUrl: './notes-manager.component.html',
  styleUrls: ['./notes-manager.component.scss']
})
export class NotesManagerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entityId: number;
  @Input() display: 'component' | 'modal' = 'modal';
  @Input() isEditable = true;
  @Input() apiServiceIndicator: ApiServiceType;
  @Input() notesHeader: TemplateRef<any>;
  @Input() placeholderText: string;
  @Input() modalTitle: string;

  @Output() cancelChanges = new EventEmitter();
  @Output() saveSuccess = new EventEmitter();

  @ViewChild(NotesManagerContentComponent) notesManagerContent: NotesManagerContentComponent;

  showNotesManager = new BehaviorSubject<boolean>(false);
  showNotesManager$ = this.showNotesManager.asObservable();

  saveNotesSuccessSubscritpion: Subscription;

  notes$: Observable<AsyncStateObj<NotesBase[]>>;

  constructor(private store: Store<fromNotesManagerReducer.State>, private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.notes$ = this.store.select(fromNotesManagerReducer.getNotes);

    this.saveNotesSuccessSubscritpion = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.SAVE_NOTES_SUCCESS))
      .subscribe(data => {
        this.resetNotesManager();
        this.saveSuccess.emit();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.apiServiceIndicator?.currentValue) {
      this.store.dispatch(new fromNotesManagerActions.LoadApiService(changes.apiServiceIndicator.currentValue));
    }

    if (changes.entityId?.currentValue) {
      this.notesManagerContent?.resetForm();
      this.store.dispatch(new fromNotesManagerActions.GetNotes(changes.entityId.currentValue));
      if (this.display === 'modal') {
        this.showNotesManager.next(true);
      }
    }
  }

  ngOnDestroy() {
    this.saveNotesSuccessSubscritpion?.unsubscribe();
  }

  onCancelChanges() {
    this.cancelChanges.emit();
    this.resetNotesManager();
  }

  resetNotesManager() {
    this.notesManagerContent.resetForm();
    this.store.dispatch(new fromNotesManagerActions.ClearNotes());
    this.showNotesManager.next(false);
  }

  saveNotes() {
    this.store.dispatch(new fromNotesManagerActions.SaveNotes(this.entityId));
  }
}
