import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';

export class SearchRequestFilterMapper {
  static mapGridStateToUserTicketSearchRequest
    (filter: CompositeFilterDescriptor, skip: number, take: number, sort: string, direction: string)
    : UserTicketSearchRequest {
    const model: UserTicketSearchRequest = { Skip: skip, Take: take, SortField: sort, SortDirection: direction };

    // map our grid to our db for sorting
    switch (sort) {
      case 'ServiceUser':
        model.SortField = 'ServicesUser_ID';
        break;
      case 'Status':
        model.SortField = 'UserTicket_State';
        break;
      case 'Type':
        model.SortField = 'UserTicket_Type';
        break;
      case 'CompanyName':
        model.SortField = 'Company_Name';
        break;
      case 'Id':
        model.SortField = 'UserTicket_ID';
        break;
      case 'Created':
        model.SortField = 'Create_Date';
        break;
      case '':
        break;
      default:
        throw new Error('sorting not implemented for this field');

    }

    filter.filters.forEach((f: FilterDescriptor) => {
      switch (f.field) {
        case 'ServiceUser':
          model.ServicesUser_ID = f.value;
          break;
        case 'Status':
          model.UserTicket_State = f.value;
          break;
        case 'Type':
          model.UserTicket_Type = f.value;
          break;
        case 'CompanyName':
          model.Company_Name = f.value;
          break;
        case 'Id':
          model.UserTicket_ID = f.value;
          break;
        case 'Created':
          model.StartDate = f.value.start;
          model.EndDate = f.value.end;
          break;
        case '':
          break;
        default:
          throw new Error('filtering not implemented for this field');
      }
    });
    return model;
  }
}
