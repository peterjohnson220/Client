import { Pipe, PipeTransform } from '@angular/core';

import { CompanyGridItem } from '../models';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

@Pipe({ name: 'companySearch', pure: true})
export class CompanySearchPipe implements PipeTransform {
    transform(allCompanies: GridDataResult, searchTerm: string, companiesList: CompanyGridItem[], state: any) {
        if (searchTerm != null) {
            if (searchTerm === '') {
                return allCompanies;
            }
            searchTerm = searchTerm.toLowerCase();
            const filteredItems = companiesList.filter(company => company.CompanyName.toLowerCase().indexOf(searchTerm) > -1
                || company.CompanyId.toString().indexOf(searchTerm) > -1);

            return process(filteredItems, state);
        } else {
            return allCompanies;
        }
    }
}
