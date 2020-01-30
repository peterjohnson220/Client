import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ControlTypeAttribute, ControlType } from 'libs/models';

import { CompanyControlsDndService, SmartListValidationService } from '../../services';
import { JobDescriptionManagementService } from '../../../../shared/services';
import { AttributeNamesAreUnique } from '../../validators';



@Component({
  selector: 'pf-company-control-layout',
  templateUrl: './company-control-layout.component.html',
  styleUrls: ['./company-control-layout.component.scss']
})
export class CompanyControlLayoutComponent implements OnInit, OnDestroy, OnChanges {
    @Input() controlType: ControlType;
    @Input() readOnly: boolean;
    @Input() editorType: string;
    @Input() editable: boolean;
    @Output() controlOptionDeleteClick = new EventEmitter<{affectedJobs: string[]}>();
    @Output() handleChange = new EventEmitter();

    types: Array<{ text: string, value: string }> = [
        { text: 'Textbox', value: 'Textbox' },
        { text: 'Text area', value: 'Textarea' },
        { text: 'Drop down', value: 'Dropdown' },
        { text: 'Text Editor', value: 'RichText' },
        { text: 'Radio button', value: 'RadioButton' }
    ];

    public attributeNameMask: string = Array(100).join('Y');
    public attributeNameRules: { [key: string]: RegExp } = {
        'Y': /^[^.$]*$/
    };

    readonly maxAttributes: number = 6;
    public controlLayoutForm: FormGroup;
    private activeTab = 0;
    public existingAttributeState: any = null;
    public maskValidationFlag = false;
    public submitted = false;
    public canEditTemplateData = false;

    private affectedJobsSubscription: Subscription;

    get attributes() { return (this.controlLayoutForm.get('Attributes')); }
    get attributesArray() { return (<FormArray>this.controlLayoutForm.get('Attributes')); }
    get getControlLayoutRawValue() { return this.controlLayoutForm.getRawValue(); }
    get formValue() { return (this.controlLayoutForm.getRawValue().Attributes); }
    get layoutForm() { return this.controlLayoutForm; }

    // "When a form has the status "disabled", it is considered exempt from all validation checks.
    // It cannot be both valid and disabled at the same time, so form.valid will always be false if the form is disabled."
    // https://github.com/angular/angular/issues/18678
    get isValid() { return !this.controlLayoutForm.invalid; }

    constructor(
        private formBuilder: FormBuilder,
        private companyControlsDndService: CompanyControlsDndService,
        private jobDescriptionManagementService: JobDescriptionManagementService,
        private smartListValidationService: SmartListValidationService) {

        this.buildForm();
        this.controlLayoutForm.valueChanges.subscribe((change) => {
            if (change.Attributes) {
                this.handleChange.emit();
            }
        });
    }

    buildForm() {
        this.controlLayoutForm = this.formBuilder.group(
            {'Attributes': this.formBuilder.array([], AttributeNamesAreUnique())},
            { validator: this.smartListValidationService.Validator(this.editorType).bind(this) }
        );
    }

    // #region Life cycle events

    ngOnInit() {
        this.companyControlsDndService.initDnD((attributeIndex, oldIndex, newIndex) => {

            const choiceArray = this.getChoiceArray(attributeIndex);
            const elementToMove = <FormGroup>choiceArray.at(oldIndex);

            choiceArray.removeAt(oldIndex);
            choiceArray.insert(newIndex, elementToMove);

        });
    }

    ngOnDestroy() {
        this.companyControlsDndService.destroyDnD();
        if (this.affectedJobsSubscription != null) {
            this.affectedJobsSubscription.unsubscribe();
        }
    }

    ngOnChanges(changes) {
        if (changes.readOnly && changes.readOnly.currentValue) {
            this.controlLayoutForm.disable();
        }
        if (changes.controlType && changes.controlType.currentValue) {
            if (changes.controlType.currentValue.Attributes) {
                this.existingAttributeState = changes.controlType.currentValue.Attributes;
            }
            const value =  changes.controlType.currentValue;
            if (value) {
                this.controlLayoutForm.patchValue({
                    Attributes: value.Attributes
                }, {emitEvent: false});

                this.resetAttributes();

                for (const attribute of value.Attributes) {
                    const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
                    controlArray.push(this.addAttribute(attribute));
                }

                if (this.readOnly) {
                    this.controlLayoutForm.disable();
                    if (this.editable) {
                        this.enableFieldsForEdit();
                    }
                }
            }
        }
        if (changes.editable) {
            if (changes.editable.currentValue === true) {
                this.enableFieldsForEdit();
            } else {
                this.controlLayoutForm.disable();
            }
        }
    }

    // #endregion

    // #region Event Handlers

    onAddNewAttribute() {
        this.addNewAttribute('');
    }

    onRemoveAttribute(index: number) {
        const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
        controlArray.removeAt(index);
        this.adjustWidth(controlArray);
        this.setActiveTab(0);
    }

    onHandleAttributeTypeChanged(attributeType: string, index: number) {
        if (attributeType === 'Dropdown'  || attributeType === 'RadioButton') {
            const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
            const item = <FormGroup>controlArray.at(index);
            (<FormControl>item.controls['CanBeSourced']).setValue(false);
        } else {
            const choiceArray = this.getChoiceArray(index);
            while (choiceArray.length) {
                choiceArray.removeAt(choiceArray.length - 1);
            }
        }
    }

    onAddNewOption(index: number, inputControl: any, controlArray: FormArray) {
        if (inputControl.value === '') { return; }
        const optionValue = this.handleDuplicateOptionValue(inputControl.value, controlArray);
        const addControl = this.addOption(optionValue, inputControl.value);
        controlArray.push(addControl);
        inputControl.value = '';
    }

    onUpdateSourcedAttribute(index: number) {
        const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
        const controlType = this.editorType;
        for (let i = 0; i < controlArray.length; i++) {
            const item = <FormGroup>controlArray.at(i);
            if (i !== index) {
                (<FormControl>item.controls['CanBeSourced']).setValue(false);
            }
        }
        if (controlType === 'SmartList') {
            for (let i = 0; i < controlArray.length; i++) {
                const item = <FormGroup>controlArray.at(i);
                if ( i === index ) {
                    (<FormControl>item.controls['Type']).setValue('Rendered');
                }

                if (i !== index) {

                    if ((<FormControl>item.controls['Type']).value === 'Rendered') {
                        (<FormControl>item.controls['Type']).setValue('Textbox');
                    }
               }
            }
        }
    }

    // #endregion

    //#region Public Members

    handleEditorTypeChange(editorType: string) {
        this.resetAttributes();
        this.editorType = editorType;
        this.layoutForm.setValidators(this.smartListValidationService.Validator(this.editorType));
        const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
        if (controlArray.length === 0 ) {
            if (editorType === 'SmartList') {
                this.addNewAttribute('Rendered', true);
            } else {
                this.addNewAttribute('');
            }
        }
    }

    //#endregion

    getChoiceArray(attributeIndex: number) {
        const attributeArray = <FormArray>this.layoutForm.controls['Attributes'];
        const attribute = <FormGroup>attributeArray.at(attributeIndex);

        return <FormArray>attribute.controls['Choices'];
    }

    resetAttributes() {
        const controlArray = <FormArray>this.attributes;
        while (controlArray.length) {
            controlArray.removeAt(controlArray.length - 1);
        }
    }

    addNewAttribute(attributeType: string, attributeCanBeSourced?: boolean) {
        const controlArray = <FormArray>this.layoutForm.controls['Attributes'];

        if (this.maxAttributes === controlArray.length) {
            return;
        }

        const attributeNumber = controlArray.length + 1;

        const attribute = new ControlTypeAttribute();
        attribute.Type = attributeType;
        attribute.Name = 'Field ' + attributeNumber;
        attribute.DisplayName = attribute.Name;
        attribute.CanEditTemplateData = false;
        attribute.CanBeSourced = attributeCanBeSourced ? attributeCanBeSourced : false;
        attribute.WidthPct = this.getEqualWidth(attributeNumber);

        controlArray.push(this.addAttribute(attribute));

        this.adjustWidth(controlArray);

        this.setActiveTab(controlArray.length - 1);
    }

    getEqualWidth(numberOfAttributes: number) {
        return 100 / numberOfAttributes;
    }

    adjustWidth(controlArray: FormArray) {
        const attributeWidth = this.getEqualWidth(controlArray.length);
        this.setEqualWith(attributeWidth, controlArray);
    }

    setEqualWith(attributeWidth: number, controlArray: FormArray) {
        for (let i = 0; i < controlArray.length; i++) {
           const item = <FormGroup>controlArray.at(i);
           (<FormControl>item.controls['WidthPct']).setValue(attributeWidth);
       }
    }

    setActiveTab(index: number) {
        this.activeTab = index;
    }

    addAttribute(attribute: ControlTypeAttribute) {

        const choices = this.addOptions(attribute.Choices);

        return this.formBuilder.group({
            Name: attribute.Name,
            DisplayName: [attribute.DisplayName, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
            Type: [attribute.Type, Validators.required],
            CanEditTemplateData: attribute.CanEditTemplateData,
            CanBeSourced: attribute.CanBeSourced,
            WidthPct: attribute.WidthPct,
            Choices: choices
        });
    }

    addOptions(choices: any[]) {

        if (choices) {
            const controlArray = this.formBuilder.array([]);
            for (const choice of choices) {
                controlArray.push(this.addOption(choice.value, choice.display));
            }
            return controlArray;
        } else {
            return this.formBuilder.array([]);
        }
    }

    addOption(value: string, display: string) {
        return this.formBuilder.group({
            value: [value, Validators.required],
            display: [display, Validators.required]
        });
    }

    handleDuplicateOptionValue(optionValue: string, controlArray: FormArray) {
        let duplicate = false;
        let count = 1;
        let i = 0;
        const originalOptionValue = optionValue;
        do {
            for (i = 0; i < controlArray.length; i++) {
                const controlValue = controlArray.at(i).value.value;
                if (optionValue === controlValue) {
                    duplicate = true;
                    optionValue = originalOptionValue + count;
                    count++;
                    break;
                }
            }
            if (i === controlArray.length) {
                duplicate = false;
            }
        } while (duplicate);

        return optionValue;
    }

    checkForValuesInUse(parentIndex: number, optionIndex: number, choiceFieldOptionValue: string, fieldName: string) {

        const attributeArray = this.getChoiceArray(parentIndex);
        const controlName = this.controlType.Type;

        // Ensures that the control is brand new
        if (controlName === undefined && !this.readOnly) {
            return this.removeOption(optionIndex, attributeArray);
        }

        this.affectedJobsSubscription = this.jobDescriptionManagementService.getJobsByControlOptionValue(controlName, fieldName, choiceFieldOptionValue)
            .subscribe(affectedJobs => {
                if (affectedJobs.length === 0) {
                    return this.removeOption(optionIndex, attributeArray);
                }
                this.controlOptionDeleteClick.emit({affectedJobs: affectedJobs});
            });
    }

    removeOption(index: number,  controlArray: FormArray) {
        controlArray.removeAt(index);
    }

    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                control.controls.forEach(c => this.markFormGroupTouched(c));
            }
        });
    }

    updateAttributeNames(controlSaveObj: ControlType) {
        const attributes = controlSaveObj.Attributes;
        for (const attribute of attributes) {
            attribute.Name = attribute.DisplayName;
        }
    }

    enableFieldsForEdit() {
        const controlArray = <FormArray>this.layoutForm.controls['Attributes'];
        for (let i = 0; i < controlArray.length; i++) {
            const attribute = <FormGroup>controlArray.at(i);
            (<FormControl>attribute.controls['DisplayName']).enable({ onlySelf: true, emitEvent: false });
            (<FormArray>attribute.controls['Choices']).enable({ onlySelf: true, emitEvent: false });
            (<FormArray>attribute.controls['WidthPct']).enable({ onlySelf: true, emitEvent: false });
        }
    }

}
