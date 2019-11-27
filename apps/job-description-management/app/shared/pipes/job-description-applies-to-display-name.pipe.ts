import { Pipe, PipeTransform } from '@angular/core';

import { JobDescriptionAppliesToItem } from '../models/job-description-appliesto-item.model';

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
