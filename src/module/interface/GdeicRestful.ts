import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface GdeicRestfulAction {
  url: string;
  method?: string;
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | { [param: string]: string | string[]; };
  isSearch?: boolean;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  callbackParam?: string;
  retry?: number;
}

export interface GdeicResult {
  StatusCode: number;
  ErrorMsg: string;
  Data?: any;
}
