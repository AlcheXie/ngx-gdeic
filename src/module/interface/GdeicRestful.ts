export interface GdeicResultError {
  StatusCode: number;
  ErrorMsg?: string;
}

export interface GdeicRestfulResource {
  ResourceName: string;
  [name: string]: any;
}
