import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromCompanyDescriptionActions from '../actions';
import * as fromEntityDescriptionReducer from '../reducers';
import {EntityDescriptionTypeEnum} from '../../../../models/entity-description/entity-description-type.enum';

@Component({
  selector: 'pf-entity-description-popover',
  templateUrl: './entity-description.component.html',
  styleUrls: ['./entity-description.component.scss']
})
export class EntityDescriptionComponent {
  @Input() entityType: EntityDescriptionTypeEnum;
  @Input() placement: 'left left-top left-bottom auto' | 'right right-top right-bottom auto';
  @Input() entityName: string;
  @Input() entityId: number;

  description$: Observable<string>;
  loadingDescription$: Observable<boolean>;

  hoveringEntityType: string;
  hoveringEntityId: Number;

  constructor(private store: Store<fromEntityDescriptionReducer.State>) {
    this.description$ = this.store.pipe(select(fromEntityDescriptionReducer.getEntityDescription));
    this.loadingDescription$ = this.store.pipe(select(fromEntityDescriptionReducer.getLoadingEntityDescription));
  }

  onMouseLeave() {
    this.hoveringEntityType = null;
    this.hoveringEntityId = 0;
  }

  onMouseEnter() {
    this.hoveringEntityType = this.entityType;
    this.hoveringEntityId = this.entityId;
    setTimeout( () => {
      if (this.hoveringEntityType === this.entityType && this.hoveringEntityId === this.entityId) {
        this.store.dispatch(new fromCompanyDescriptionActions.GetEntityDescription({entityType: this.entityType, entityId: this.entityId}));
      }
    }, 500 );
  }
}
