import { Pipe, PipeTransform } from '@angular/core';

import { CompanyJob } from 'libs/models';

@Pipe({ name: 'companyJobSearch', pure: true })
export class CompanyJobSearchPipe implements PipeTransform {
    transform(listofJobs: CompanyJob[], searchTerm: string) {
        if (searchTerm != null) {
            searchTerm = searchTerm.toLowerCase();
            const test: any = listofJobs.filter(
                cj => (cj.JobTitle && cj.JobTitle.toLowerCase().indexOf(searchTerm) > -1) || cj.JobCode.toLowerCase().indexOf(searchTerm) > -1
            );
            return test;
        } else {
            return listofJobs;
        }
    }
}
