import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Gdeic } from './service/gdeic.service';
import { GdeicConfig, GdeicConfigConfig } from './service/gdeic-config.service';
import { GdeicRestful } from './service/gdeic-restful.service';

import { GdeicSysResource } from './resource/gdeic-sys.resource';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        Gdeic,
        GdeicConfig,
        GdeicRestful,
        GdeicSysResource
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