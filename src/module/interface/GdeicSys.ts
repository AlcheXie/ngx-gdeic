export interface GdeicAccount {
  Sid: string;
  Name: string;
  Roles: GdeicRole[];
  ManageOu: GdeicManageOu;
  Region?: { Code: string, Name: string, ParentCode: string };
  Department?: string;
  LockoutEnabled?: boolean;
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
  Id: number | string;
  OuName: string;
  DnName: string;
  ParentId: number;
  SubOus: GdeicManageOu[];
}
