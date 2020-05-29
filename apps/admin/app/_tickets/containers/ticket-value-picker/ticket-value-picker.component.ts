import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { TicketFieldType } from '../../constants/tickets-constants';
import { PickerHelper } from '../../helpers';
import { PfServicesRep, UserTicketType, UserTicketState } from '../../models';


import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { Store } from '@ngrx/store';
import { GenericKeyValue } from 'libs/models';

@Component({
  selector: 'pf-ticket-value-picker',
  templateUrl: './ticket-value-picker.component.html',
  styleUrls: ['./ticket-value-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketValuePickerComponent implements OnInit {
  @ViewChild(ComboBoxComponent) private comboBox: ComboBoxComponent;

  @Input() public data: any[];
  @Input() public ticketId: number;
  @Input() public textField: string;
  @Input() public valueField: string;
  @Input() public pickerType: TicketFieldType;
  @Input() public selectedValue: any;
  @Input() public pickerOnly = true;

  public ticketFieldType = TicketFieldType;
  public pickerHelper = new PickerHelper();
  public showLabel = false;

  constructor(private store: Store<fromTicketReducer.State>) { }

  ngOnInit(): void {
    if (!this.pickerOnly) {
      this.showLabel = true;
    }
  }

  switchView() {
    if (this.pickerOnly) {
      return;
    }

    this.showLabel = !this.showLabel;
  }

  public comboValueChanged(value: any): void {
    const changedFields: GenericKeyValue<string, string>[] = [];
    switch (this.pickerType) {
      case TicketFieldType.SERVICEUSER: {
        const v = value as PfServicesRep;
        if (v) {
          changedFields.push({Key: 'ServicesUserId', Value: Math.abs(v.PfServicesRepId).toString()});
        }
        break;
      }
      case TicketFieldType.TYPE: {
        const  v = value as UserTicketType;
        if (v) {
          changedFields.push({ Key: 'UserTicketType', Value: v.TicketTypeName });
          changedFields.push({ Key: 'FileType', Value: v.TicketSubTypeName });
        }
        break;
      }
      case TicketFieldType.STATUS: {
        const v = value as UserTicketState;
        if (v) {
          changedFields.push({Key: 'UserTicketState', Value: v.UserTicketState});
        }
        break;
      }
    }
    if (changedFields.length > 0) {
      this.store.dispatch(new fromTicketActions.UpdateTicket(
        {
          userTicketId: this.ticketId,
          updateFields: changedFields
        }
      ));
    }

    this.switchView();
  }

  focus() {
    this.comboBox.focus();
  }
}
