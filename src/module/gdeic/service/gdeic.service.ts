import { Injectable } from '@angular/core';

@Injectable()
export class Gdeic {
    constructor() { }

    static copy<T>(source: T): T {
        let json = JSON.stringify(source);
        return JSON.parse(json);
    }
}