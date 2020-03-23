export interface ODataQuery {
  Fields?: string[];
  OrderBy?: string;
  Filter?: string;
  Top?: number;
  Skip?: number;
}

export function generateQueryObject(query: ODataQuery): any {
  const queryObject = {};
  if (query.Fields && query.Fields.length) {
    queryObject['$select'] = query.Fields.join();
  }
  if (query.OrderBy) {
    queryObject['$orderby'] = query.OrderBy;
  }
  if (query.Filter) {
    queryObject['$filter'] = query.Filter;
  }
  if (query.Top) {
    queryObject['$top'] = query.Top;
  }
  if (query.Skip) {
    queryObject['$skip'] = query.Skip;
  }

  return queryObject;
}
