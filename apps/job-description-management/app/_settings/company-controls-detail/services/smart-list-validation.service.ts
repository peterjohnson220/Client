import { Injectable } from '@angular/core';
import { ValidatorFn, FormGroup, FormArray, FormControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SmartListValidationService {

  public validationResultSubject = new BehaviorSubject(false);
  constructor() { }

  public getValidationResult() {
    return this.validationResultSubject.asObservable();
  }

  public setValidationResult(validationResult: any) {
    this.validationResultSubject.next(validationResult);
  }

  public Validator(editorType: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: boolean} | null => {

        if (editorType !== 'SmartList' ) {
          this.setValidationResult(false);
          return;
        }

        const controlArray = <FormArray>group.controls['Attributes'];

        for (let i = 0; i < controlArray.length; i++) {
            const item = <FormGroup>controlArray.at(i);
            const canBeSourced = (<FormControl>item.controls['CanBeSourced']).value;

            if (canBeSourced) {
              this.setValidationResult(false);
              return;
            }
        }
        this.setValidationResult(true);
    };
}

}
