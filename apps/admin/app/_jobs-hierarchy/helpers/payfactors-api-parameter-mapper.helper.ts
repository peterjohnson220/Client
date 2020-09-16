import { SelectedJobFamily } from '../../../../../libs/models/jobs-hierarchy';

export class PayfactorsApiParameterMapper {

  static mapSelectedJobFamiliesToJobFamilyList(jobFamilySelectedList: SelectedJobFamily[]): string[] {
    const jobFamilies = jobFamilySelectedList.filter(x => x.Selected === true).map(x => x.JobFamily);
    return jobFamilies;
  }
}
