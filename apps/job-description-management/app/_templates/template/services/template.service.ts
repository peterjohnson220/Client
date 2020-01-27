import { Injectable } from '@angular/core';

@Injectable()
export class TemplateService {

    private lastId: number;

    generateEpochId() {
        let id = Date.now();
        if (this.lastId) {
            if (id <= this.lastId) {
                id = this.lastId + 1;
            }
        }
        this.lastId = id;
        return id;
    }
}
