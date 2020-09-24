import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { DragulaService } from 'ng2-dragula';
import orderBy from 'lodash/orderBy';

import { DATE_FORMATS } from 'libs/features/org-data-loader/constants';
import { ConverterSettings } from 'libs/models/hris-api';

import * as fromConverterSettingsActions from '../../actions/converter-settings.actions';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFieldMappingReducer from '../../reducers';
import { EntityDataField, EntityField } from '../../models';


@Component({
  selector: 'pf-entity-mapping',
  templateUrl: './entity-mapping.component.html',
  styleUrls: ['./entity-mapping.component.scss']
})
export class EntityMappingComponent implements OnInit, OnDestroy {

  dateFormats: Array<{ text: string, value: string}> = DATE_FORMATS;

  @Input() provider: string;
  @Input() entityType: string;
  @Input() entityGroupName = 'associated-bag';
  @Input() sourceName: string;
  @Input() targetName: string;
  @Input() connectionId: number;

  private providerSearchTerm = '';
  private payfactorsSearchTerm = '';

  providerFields$: Observable<EntityField>;
  payfactorFields$: Observable<EntityField>;

  globalDateSetting$: Observable<ConverterSettings>;

  filteredProviderFields: EntityDataField[] = [];
  filteredPayfactorsFields: EntityDataField[] = [];

  dragulaSub: Subscription;
  providerFieldsSubscription: Subscription;
  payfactorFieldsSubscription: Subscription;
  globalDateSettingSubscription: Subscription;


  providerFields: EntityDataField[];
  payfactorsFields: EntityDataField[];

  selectedDateFormat = 'Select format for date fields';

  constructor(private store: Store<fromFieldMappingReducer.State>, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    this.payfactorFields$ = this.store.select(fromFieldMappingReducer.getPayfactorsFields);
    this.providerFields$ = this.store.select(fromFieldMappingReducer.getProviderFields);

    if (this.entityType.toLowerCase() === 'employees') {
      this.globalDateSetting$ = this.store.select(fromFieldMappingReducer.getGlobalDateSetting);
      this.globalDateSettingSubscription = this.globalDateSetting$.subscribe(v => {
        if (v) {
          this.selectedDateFormat = v.options.DateTimeFormat;
        }
      });
    }

    this.providerFieldsSubscription = this.providerFields$
    .subscribe(v => {
      if (v) {
        this.providerFields = orderBy(v[this.entityType], [field => field.DisplayName.toLocaleLowerCase()], ['asc']);
        this.filteredProviderFields = this.providerFields.filter( pf =>
          pf.DisplayName.toLocaleLowerCase().includes(this.providerSearchTerm) && !pf.HasAssociation
        );
      }
    });

    this.payfactorFieldsSubscription = this.payfactorFields$
    .subscribe(v => {
      if (v) {
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
    this.globalDateSettingSubscription.unsubscribe();
    this.dragulaSub.unsubscribe();
    this.dragulaService.destroy(this.entityGroupName);
  }

  handleSearchTermChanged(searchTerm: string, type: string): void {
    if (type === 'provider' && this.providerFields && this.providerFields.length) {
      this.providerSearchTerm = searchTerm.toLocaleLowerCase();
      this.filteredProviderFields = this.providerFields.filter( pf =>
        pf.DisplayName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) && !pf.HasAssociation
      );
    }

    if (type === 'payfactors' && this.payfactorsFields && this.payfactorsFields.length) {
      this.payfactorsSearchTerm = searchTerm.toLocaleLowerCase();
      this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
        pf.DisplayName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
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

  onDateFormatSelected(event) {
    this.selectedDateFormat = event.target.value;
    const converterOptions: ConverterSettings = {
      connection_ID: this.connectionId,
      fieldName: null,
      entityType: 'Employees',
      options: {
        DateTimeFormat: this.selectedDateFormat
      },
      dataType: 'Date'
    };
    this.store.dispatch(new fromConverterSettingsActions.AddConverterSetting(converterOptions));
  }

}
