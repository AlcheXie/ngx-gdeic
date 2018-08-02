export interface GdeicAccount {
  Id: number | string;
  Sid?: string;
  Name: string;
  Roles: GdeicRole[];
  ManageOu: GdeicManageOu | GdeicAdOu;
  Region?: { Code: string, Name: string, ParentCode: string };
  Department?: string;
  LockoutEnabled?: boolean;
}

export interface GdeicSimpleAccount {
  UserId: string;
  UserName: string;
  LoginName: string;
  RoleNames: string[];
  ManagerOuId: string;
  ManagerCode: string;
}

export interface GdeicRole {
  Id: number | string;
  Name: string;
  Description?: string;
  Order?: number;
  IsActive?: boolean;
  IsBackstage?: boolean;
}

export interface GdeicMenu {
  Id: number | string;
  Name: string;
  Url: string;
  Icon: string;
  Roles: GdeicRole[];
  ParentId?: number | string;
  Order?: number;
  IsActive?: boolean;
  SubMenus?: GdeicMenu[];
}

export interface GdeicManageOu {
  Id: number;
  OuName: string;
  DnName: string;
  ParentId: number;
  SubOus: GdeicManageOu[];
}

export interface GdeicAdOu {
  Id: string;
  Name: string;
  FullName: string;
  RegionCode: string;
  ParentId: string;
  SubAdNodes: GdeicAdOu[];
  Type: string;
}
