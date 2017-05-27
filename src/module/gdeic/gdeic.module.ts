import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        Gdeic
    ],
    declarations: [],
    exports: []
})
export class GdeicModule {
    static fooRoot(config: GdeicConfigConfig): ModuleWithProviders {
        return {
            ngModule: GdeicModule,
            providers: [
                { provide: GdeicConfigConfig, useValue: config }
            ]
        }
    }
}