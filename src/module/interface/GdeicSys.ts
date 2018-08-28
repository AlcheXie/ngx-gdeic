export interface GdeicAccount {
  Id: string;
  Name: string;
  Roles: GdeicRole[];
  Ou?: GdeicOu;
  LockoutEnabled?: boolean;
}

export interface GdeicAdAccount extends GdeicAccount {
  ManageOu?: GdeicOu;
}

export interface GdeicRegisterAccount {
  LoginName: string;
  Name: string;
  PassWord: string;
  RegionCode: string;
  OuId: string;
}

export interface GdeicLoginAccount {
  UserId: string;
  UserName: string;
  LoginName: string;
  RoleNames: string[];
  ManagerOuId: string;
  ManagerCode: string;
}

export interface GdeicAd {
  Id: string;
  Name: string;
  FullName: string;
  RegionCode: string;
  ParentId: string;
  Type: 'ou' | 'user';
  SubAdNodes: GdeicAd[];
}

export type GdeicOu = GdeicAd;

export interface GdeicRole {
  Id: string;
  Name: string;
  Description?: string;
  Order?: number;
  IsActive?: boolean;
  IsBackstage?: boolean;
}

export interface GdeicMenu {
  Id: string;
  Name: string;
  Url: string;
  Roles: GdeicRole[];
  ParentId?: string;
  Description?: string;
  Icon?: string;
  Order?: number;
  IsActive?: boolean;
  SubMenus?: GdeicMenu[];
}
