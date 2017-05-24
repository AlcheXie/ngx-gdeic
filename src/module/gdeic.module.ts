import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Gdeic } from './services/gdeic.service';
import { GdeicConfig, GdeicConfigConfig } from './services/gdeic-config.service';

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
    constructor( @Optional() @SkipSelf() parentModule: GdeicModule) {
        if (parentModule) {
            throw new Error(
                'GdeicModule is already loaded. Import it in the AppModule only');
        }
    }

    static fooRoot(config: GdeicConfigConfig): ModuleWithProviders {
        return {
            ngModule: GdeicModule,
            providers: [
                { provide: GdeicConfigConfig, useValue: config }
            ]
        }
    }
}