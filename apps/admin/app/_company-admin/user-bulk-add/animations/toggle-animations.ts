import {animate, state, style, transition, trigger} from '@angular/animations';


export const toggleStateAnimation =   trigger('toggleState', [
    state('true', style({ minHeight: '50px' })),
    state('false', style({ maxHeight: 0, padding: 0, display: 'none' })),
    transition('0 => 1', animate('300ms')),
    transition('1 => 0', animate('200ms'))
]);
