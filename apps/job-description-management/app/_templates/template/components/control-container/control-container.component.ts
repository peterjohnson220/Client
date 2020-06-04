import { Component, Input } from '@angular/core';

import { ControlType } from 'libs/models';

@Component({
    selector: 'pf-control-container',
    templateUrl: './control-container.component.html',
    styleUrls: ['./control-container.component.scss']
})
export class ControlContainerComponent {
    constructor() { }

    @Input() controlTypes: ControlType[];
    @Input() containerName: string;
    @Input() readOnly: boolean;

    public hideControls = false;
}
