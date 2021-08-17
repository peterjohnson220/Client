import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';
import { CompensableFactorRequest } from 'libs/models/comphub/get-crowd-sourced-job-pricing';

export class CompensableFactorDataMapper {
  static getCompensableFactorDataMap(data: CompensableFactorsResponseModel[]): CompensableFactorsResponseModel[] {
    Object.keys(data).forEach(key => {
      data[key].map(x => {
        x.Selected = false;
      });
    });

    return data;
  }

  static mapSelectedFactorsToCompensableFactorsRequest(sf): CompensableFactorRequest[] {
    const factorsToSend: CompensableFactorRequest[] = [];
    if (!!sf.Years_Experience) {
      factorsToSend.push({ Name: 'Years_Experience', SelectedFactors: sf.Years_Experience.map(x => x.Name) });
    }
    if (!!sf.Skills) {
      factorsToSend.push({ Name: 'Skills', SelectedFactors: sf.Skills.map(x => x.Name) });
    }
    if (!!sf.Certs) {
      factorsToSend.push({ Name: 'Certs', SelectedFactors: sf.Certs.map(x => x.Name) });
    }
    if (!!sf.Education && sf.Education[0].Name !== 'Any') {
      factorsToSend.push({ Name: 'Education', SelectedFactors: sf.Education.map(x => x.Name) });
    }
    if (!!sf.Supervisory_Role) {
      factorsToSend.push({ Name: 'Supervisory_Role', SelectedFactors: sf.Supervisory_Role.map(x => x.Name) });
    }

    return factorsToSend;
  }
}
