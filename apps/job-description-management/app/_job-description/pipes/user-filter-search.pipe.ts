import { Pipe, PipeTransform } from '@angular/core';

import { JdmListFilter } from 'libs/models/user-profile';

@Pipe({ name: 'userFilterSearch', pure: true })
export class UserFilterSearchPipe implements PipeTransform {
    transform(listOfFilters: JdmListFilter[], searchTerm: string) {
        if (searchTerm != null) {
            searchTerm = searchTerm.toLowerCase();
            const test: any = listOfFilters.filter(f => f.Name.toLowerCase().indexOf(searchTerm) > -1);
            return test;
        } else {
            return listOfFilters;
        }
    }
}
