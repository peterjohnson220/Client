import cloneDeep from 'lodash/cloneDeep';

import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { GroupedListItem } from 'libs/models/list';

export class TicketStateHelper {

  static applySelectedTicketStatesToField(fields: ViewField[], selectedValues: string[]): ViewField {
    const ticketStateField: ViewField = fields.find((f: ViewField) => f.SourceName === 'UserTicket_State');
    const updatedField: ViewField = cloneDeep(ticketStateField);
    updatedField.FilterValues = selectedValues;
    updatedField.FilterOperator = 'in';
    return updatedField;
  }

  static createOpenState(): GroupedListItem {
    return {
      Name: 'Open',
      Value: 'Open',
      TotalChildren: 2,
      Children: [
        {
          Value: 'In Progress',
          Name: 'In Progress'
        },
        {
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

  static getTicketStateValues(selectedStates: string[]): string[] {
    const results = [];
    selectedStates.forEach(state => {
      if (state === 'Open') {
        results.push('In Progress');
        results.push('Waiting for Response');
      } else {
        results.push(state);
      }
    });
    return results;
  }
}
