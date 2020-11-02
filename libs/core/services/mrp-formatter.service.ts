import { Injectable } from '@angular/core';

import { MrpModel } from '../../models/common/mrp.model';

@Injectable({
  providedIn: 'root'
})
export class MrpFormatterService {

  constructor() { }
  delimiter = '_';
  categoryRgx = `(${this.delimiter})(?!.*\\1)(.*?)(?=MRP)`; // get text between last occurrence of delimiter and MRP
  dataPrefixRgx = `.*(?=\\${this.delimiter})`; // find the last occurrence of our delimiter (_)
  dataSuffix = '_Reference_Point';
  percentileSuffix = 'th';

  mrpDisplayOverrides: any[] = [];

  generateDisplayOverrides(pricingInfo: any, mrpFields: string[]): any[] {
    const objKeys = Object.keys(pricingInfo);
    const mrpKeys = mrpFields.filter(mrp => objKeys.find(key => key.includes(mrp)));

    mrpKeys.forEach(mrp => this.mrpDisplayOverrides[mrp] = this.formatMrp(objKeys.find(key => key.includes(mrp)), pricingInfo).MRP);
    return this.mrpDisplayOverrides;
  }

  formatMrp(fieldName: string, dataRow: any): MrpModel {
    const category = fieldName.match(this.categoryRgx);

    if (category === null) {
      return null;
    }

    const prefix = fieldName.match(this.dataPrefixRgx);
    const percentile = dataRow[`${prefix[0]}${this.delimiter}${category[2]}${this.dataSuffix}`];

    if (percentile) {
      const percentileString = percentile.toString();
      switch (percentileString.slice(percentileString.length - 1)) {
        case '1':
          this.percentileSuffix = 'st';
          break;
        case '2':
          this.percentileSuffix = 'nd';
          break;
        case '3':
          this.percentileSuffix = 'rd';
          break;
        default:
          this.percentileSuffix = 'th';
          break;
      }
    }

    return {DataPrefix: prefix[0] + this.delimiter, DataSuffix: this.dataSuffix,
      PercentileSuffix: this.percentileSuffix, Category: category[2],
      MRP: percentile === null || percentile === undefined ? null : percentile.toString() + this.percentileSuffix};
  }
}
