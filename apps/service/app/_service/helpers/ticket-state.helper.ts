import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { MultiSelectItemGroup } from 'libs/ui/common';

export class TicketStateHelper {

  static getSelectedValues(ticketStates: MultiSelectItemGroup[]): string[] {
    const selectedValues: string[] = [];
    ticketStates.forEach(group => {
      group.Items.forEach(item => {
        if (item.IsSelected) {
          selectedValues.push(item.Value);
        }
      });
    });
    return selectedValues;
  }

  static applySelectedTicketStatesToField(fields: ViewField[], selectedValues: string[]): ViewField {
    const ticketStateField: ViewField = fields.find((f: ViewField) => f.SourceName === 'UserTicket_State');
    const updatedField: ViewField = cloneDeep(ticketStateField);
    updatedField.FilterValues = selectedValues;
    updatedField.FilterOperator = 'in';
    return updatedField;
  }

  static createOpenState(): MultiSelectItemGroup {
    return {
      GroupIndex: 1,
      Title: 'Open',
      Items: [
        {
          IsSelected: false,
          Value: 'In Progress'
        },
        {
          IsSelected: false,
          Value: 'Waiting for Response'
        }
      ]
    };
  }
}
