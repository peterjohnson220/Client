import { FormControl } from '@angular/forms';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

export function TemplateNameIsInUse(jobDescriptionTemplateApiService: JobDescriptionTemplateApiService, origTemplateName: string, templateId: number) {
    return function (control: FormControl) {


    if (!control.dirty) { return new Promise (resolve => resolve(null)); }

    if (control.value === origTemplateName) { return new Promise (resolve => resolve(null)); }

    return jobDescriptionTemplateApiService.exists(control.value, templateId)
        .map(exists => exists === true ? { templateNameExists: true } : null).toPromise();
    };
}

