export interface GdeicAccount {
  Sid: string;
  Name: string;
  Roles: GdeicRole[];
  LockoutEnabled: boolean;
  ManageOu: GdeicManageOu;
  [name: string]: any;
}

export interface GdeicRole {
  Id: number;
  Name: string;
  Description: string;
  Order: number;
  IsActive: boolean;
  IsBackstage: boolean;
  [name: string]: any;
}

export interface GdeicManageOu {
  Id: number;
  OuName: string;
  DnName: string;
  [name: string]: any;
}

export interface GdeicMenu {
  Id: number;
  Name: string;
  ParentId: number;
  Url: string;
  Order: number;
  SubMenus: GdeicMenu[];
  IsActive: boolean;
  Roles: GdeicRole[] | any[];
  [name: string]: any;
}
