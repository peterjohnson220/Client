import * as cloneDeep from 'lodash.clonedeep';

import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { MultiSelectItemGroup } from 'libs/ui/common';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

export class TicketStateHelper {

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
          Value: 'In Progress',
          Name: 'In Progress'
        },
        {
          IsSelected: false,
          Value: 'Waiting for Response',
          Name: 'Waiting for Response'
        }
      ]
    };
  }

  static buildTicketStateInboundFilter(selectedStates: string[]): PfDataGridFilter {
    return {
      SourceName: 'UserTicket_State',
      Operator: 'in',
      Value: null,
      Values: selectedStates
    };
  }
}
