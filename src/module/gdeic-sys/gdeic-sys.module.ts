import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { GdeicModule } from '../gdeic/gdeic.module';

import { GdeicSysResource } from './resource/gdeic-sys.resource';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        GdeicModule
    ],
    providers: [
        GdeicSysResource
    ],
    declarations: [],
    exports: []
})
export class GdeicSysModule { }