import { Input } from '@angular/core';

import { GdeicRestful } from '../../service/gdeic-restful.service';

export class GdeicHoldOn {
    @Input() holdOnText: string;

    isHoldingOn: boolean;

    constructor() {
        GdeicRestful.loading$.subscribe(data => this.isHoldingOn = data);
    }
}