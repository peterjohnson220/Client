import { CompensableFactorRequest, CompensableFactorsResponse } from 'libs/models/payfactors-api';

export class CompensableFactorDataMapper {
  static getCompensableFactorDataMap(data: CompensableFactorsResponse[]): CompensableFactorsResponse[] {
    Object.keys(data).forEach(key => {
      data[key].map(x => {
        x.Selected = false;
      });
    });

    return data;
  }

  static mapSelectedFactorsToCompensableFactorsRequest(sf): CompensableFactorRequest[] {
    const factorsToSend: CompensableFactorRequest[] = [];
    if (!!sf) {
      if (!!sf.Years_Experience) {
        factorsToSend.push({Name: 'Years_Experience', SelectedFactors: sf.Years_Experience.map(x => x.Name)});
      }
      if (!!sf.Skills) {
        factorsToSend.push({Name: 'Skills', SelectedFactors: sf.Skills.map(x => x.Name)});
      }
      if (!!sf.Certs) {
        factorsToSend.push({Name: 'Certs', SelectedFactors: sf.Certs.map(x => x.Name)});
      }
      if (!!sf.Education && sf.Education[0].Name !== 'Any') {
        factorsToSend.push({Name: 'Education', SelectedFactors: sf.Education.map(x => x.Name)});
      }
      if (!!sf.Supervisory_Role) {
        factorsToSend.push({Name: 'Supervisory_Role', SelectedFactors: sf.Supervisory_Role.map(x => x.Name)});
      }
    }
    return factorsToSend;
  }
}
