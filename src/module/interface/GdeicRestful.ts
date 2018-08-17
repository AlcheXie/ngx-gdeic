export interface GdeicResultError {
  StatusCode: number;
  ErrorMsg?: string;
}

export interface GdeicRestfulResource {
  readonly ResourceName: string;
}
