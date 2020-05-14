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
        model.SortField = 'ServicesUserFullName';
        break;
      case 'Status':
        model.SortField = 'UserTicketState';
        break;
      case 'Type':
        model.SortField = 'UserTicketType';
        break;
      case 'CompanyName':
        model.SortField = 'CompanyName';
        break;
      case 'Id':
        model.SortField = 'Id';
        break;
      case 'Created':
        model.SortField = 'CreateDate';
        break;
      case 'OpenedUserFullName':
        model.SortField = 'OpenedUserFullName';
        break;
      case 'UserModifiedDate':
        model.SortField = 'UserModifiedDate';
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
        case 'CompanyIDName':
          model.Company_IDName = f.value;
          break;
        case 'Id':
          model.UserTicket_ID = f.value;
          break;
        case 'Created':
          model.StartDate = f.value.start;
          model.EndDate = f.value.end;
          break;
        case 'UserModifiedDate':
          model.ModifiedStartDate = f.value.start;
          model.ModifiedEndDate = f.value.end;
          break;
        case 'OpenedUserFullName':
          model.Opened_User = f.value;
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
