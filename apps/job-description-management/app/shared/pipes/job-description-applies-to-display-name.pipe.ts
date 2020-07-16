import { Pipe, PipeTransform } from '@angular/core';

import { JobDescriptionAppliesToItem } from 'libs/features/job-description-management/models';

@Pipe({ name: 'jobDescriptionAppliesToDisplayName', pure: true })
export class JobDescriptionAppliesToDisplayNamePipe implements PipeTransform {
    transform(listOfColumns: JobDescriptionAppliesToItem[], columnName: string) {
        if (columnName != null) {
            const result: any = listOfColumns.filter(cj => cj.ColumnName === columnName);
            return result;
        } else {
            return [new JobDescriptionAppliesToItem()];
        }
    }
}
