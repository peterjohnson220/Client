import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';
import { NotesManagerContentComponent } from '../containers';
import { ApiServiceType } from '../constants/api-service-type-constants';
import { AsyncStateObj } from '../../../../models/state';
import { NotesBase } from '../../../../models/notes';

@Component({
  selector: 'pf-notes-manager',
  templateUrl: './notes-manager.component.html',
  styleUrls: ['./notes-manager.component.scss']
})
export class NotesManagerComponent implements OnInit, OnChanges, OnDestroy, AfterContentChecked {
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
  notesSubscription: Subscription;

  notes$: Observable<AsyncStateObj<NotesBase[]>>;

  constructor(private store: Store<fromNotesManagerReducer.State>, private actionsSubject: ActionsSubject, private cdr: ChangeDetectorRef) { }

  ngAfterContentChecked() {
    // This block of code prevents ExpressionChangedAfterItHasBeenCheckedError
    this.notesSubscription = this.store.select(fromNotesManagerReducer.getNotes).subscribe(data => {
      this.notes$ = of(data);
      this.cdr.detectChanges(); // calls change detection for this component and ALL of its children
    });
  }

  ngOnInit() {
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
    this.notesSubscription.unsubscribe();
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
