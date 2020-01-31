import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { DragulaService } from 'ng2-dragula';
import { orderBy } from 'lodash';

import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFieldMappingReducer from '../../reducers';
import { EntityDataField, EntityField } from '../../models';

@Component({
  selector: 'pf-entity-mapping',
  templateUrl: './entity-mapping.component.html',
  styleUrls: ['./entity-mapping.component.scss']
})
export class EntityMappingComponent implements OnInit, OnDestroy {

  @Input() entityType: string;
  @Input() entityGroupName = 'associated-bag';

  private providerSearchTerm = '';
  private payfactorsSearchTerm = '';

  providerFields$: Observable<EntityField>;
  payfactorFields$: Observable<EntityField>;

  filteredProviderFields: EntityDataField[] = [];
  filteredPayfactorsFields: EntityDataField[] = [];

  dragulaSub: Subscription;
  providerFieldsSubscription: Subscription;
  payfactorFieldsSubscription: Subscription;

  providerFields: EntityDataField[];
  payfactorsFields: EntityDataField[];

  constructor(private store: Store<fromFieldMappingReducer.State>, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.payfactorFields$ = this.store.select(fromFieldMappingReducer.getPayfactorsFields);
    this.providerFields$ = this.store.select(fromFieldMappingReducer.getProviderFields);

    this.providerFieldsSubscription = this.providerFields$
    .subscribe(v => {
      if (v) {
        this.providerFields = orderBy(v[this.entityType], ['FieldName'], ['asc']);
        this.filteredProviderFields = this.providerFields.filter( pf =>
          pf.FieldName.toLocaleLowerCase().includes(this.providerSearchTerm) && !pf.HasAssociation
        );
      }
    });

    this.payfactorFieldsSubscription = this.payfactorFields$
    .subscribe(v => {
      if (v) {
        this.payfactorsFields = orderBy(v[this.entityType], ['IsRequired', 'FieldName'], ['desc', 'asc']);
        this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
          pf.FieldName.toLocaleLowerCase().includes(this.payfactorsSearchTerm.toLocaleLowerCase())
        );
      }
    });

    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel(this.entityGroupName)
      .subscribe(({ el, target, source, item, sourceModel, targetModel, sourceIndex, targetIndex }) => {
        if (targetModel.length > 1) {
          this.dragulaService.find(this.entityGroupName).drake.cancel(true);
          return;
        }

        const pfEntityId = target.getAttribute('payfactors-entity-id');
        if (pfEntityId) {
          this.addAssociatedItem(+pfEntityId, item);
        }
    }));

    this.dragulaService.createGroup(this.entityGroupName, {
      moves: (el, target, source, sibling) => {
        return el && el.classList && el.classList.contains('provider-field-list-item');
      },
      accepts: (el, target, source, sibling) => {
        return target.id !== 'provider-entity';
      },
      revertOnSpill: true
    });
  }

  ngOnDestroy() {
    this.payfactorFieldsSubscription.unsubscribe();
    this.providerFieldsSubscription.unsubscribe();
    this.dragulaSub.unsubscribe();
    this.dragulaService.destroy(this.entityGroupName);
  }

  handleSearchTermChanged(searchTerm: string, type: string): void {
    if (type === 'provider' && this.providerFields && this.providerFields.length) {
      this.providerSearchTerm = searchTerm.toLocaleLowerCase();
      this.filteredProviderFields = this.providerFields.filter( pf =>
        pf.FieldName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) && !pf.HasAssociation
      );
    }

    if (type === 'payfactors' && this.payfactorsFields && this.payfactorsFields.length) {
      this.payfactorsSearchTerm = searchTerm.toLocaleLowerCase();
      this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
        pf.FieldName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    }
  }

  removeAssociatedItem(pfEntityId: number, entity: EntityDataField) {
    this.store.dispatch(new fromFieldMappingActions.RemoveAssociatedEntity( {
      entity: entity,
      payfactorsEntityIndex: pfEntityId,
      entityType: this.entityType
    }));
  }

  addAssociatedItem(pfEntityId: number, entity: EntityDataField) {
    this.store.dispatch(new fromFieldMappingActions.AddAssociatedEntity( {
      entity: entity,
      entityType: this.entityType,
      payfactorsEntityId: pfEntityId
    }));
  }
}
