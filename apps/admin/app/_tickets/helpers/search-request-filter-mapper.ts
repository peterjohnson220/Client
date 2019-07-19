import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';

export class SearchRequestFilterMapper {
  static mapCompositeFilterDescriptorToUserTicketSearchRequest(filter: CompositeFilterDescriptor): UserTicketSearchRequest {
    const model: UserTicketSearchRequest = {};
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
      }
    });
    return model;
  }
}
