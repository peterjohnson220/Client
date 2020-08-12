import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import orderBy from 'lodash/orderBy';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {EntityDataField} from '../../models';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromDataManagementMainReducer from '../../reducers';
import * as fromFieldMappingReducer from '../../reducers';

@Component({
  selector: 'pf-entity-field-selection',
  templateUrl: './entity-field-selection.component.html',
  styleUrls: ['./entity-field-selection.component.scss']
})
export class EntityFieldSelectionComponent implements OnInit, OnDestroy {
  @Input() entityType: string;
  @Input() entityGroupName = 'associated-bag';
  @Input() sourceName: string;
  @Input() targetName: string;

  private payfactorsSearchTerm = '';

  filteredPayfactorsFields: EntityDataField[] = [];
  payfactorsFields: EntityDataField[];
  showModel$: Observable<boolean>;

  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<fromFieldMappingReducer.State>, private router: Router) { }

  ngOnInit(): void {
    this.showModel$ = this.store.select(fromDataManagementMainReducer.getShowSetupCompleteModal);
    this.store.select(fromDataManagementMainReducer.getFieldMappingPageLoading)
      .pipe(takeUntil(this.unsubscribe$), filter(v => !v))
      .subscribe(v => {
        // check for required columns
        this.payfactorsFields.filter(x => x.IsRequired && !x.AssociatedEntity?.length).forEach(x => {
          this.addAssociatedItem(x.EntityFieldId, x);
        });
    });
    this.store.select(fromFieldMappingReducer.getPayfactorsFields)
      .pipe(takeUntil(this.unsubscribe$), filter(v => v && v[this.entityType].length))
      .subscribe(v => {
        this.payfactorsFields = orderBy(
          v[this.entityType],
          [
            firstSortField => firstSortField.IsRequired,
            secondSortField => secondSortField.DisplayName.toLocaleLowerCase()
          ],
          ['desc', 'asc']
        );
        this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
          pf.DisplayName.toLocaleLowerCase().includes(this.payfactorsSearchTerm.toLocaleLowerCase())
        );
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  handleSearchTermChanged(searchTerm: string, type: string) {
    if (type === 'payfactors' && this.payfactorsFields && this.payfactorsFields.length) {
      this.payfactorsSearchTerm = searchTerm.toLocaleLowerCase();
      this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
        pf.DisplayName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    }
  }

  removeAssociatedItem(pfEntityId: number, entity: EntityDataField) {
    if (entity.IsRequired) {
      return;
    }
    this.store.dispatch(new fromFieldMappingActions.RemoveAssociatedEntity( {
      entity: entity,
      payfactorsEntityIndex: pfEntityId,
      entityType: this.entityType
    }));
  }

  addAssociatedItem(pfEntityId: number, entity: EntityDataField) {
    if (entity.AssociatedEntity?.length) {
      return;
    }

    this.store.dispatch(new fromFieldMappingActions.AddAssociatedEntity( {
      entity: entity,
      entityType: this.entityType,
      payfactorsEntityId: pfEntityId
    }));
  }
}
