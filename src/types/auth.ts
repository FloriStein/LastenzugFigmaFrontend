export type Role = "operator" | "schichtleitung" | "mitarbeiter" | "gast";
export type SidebarRole = Exclude<Role, "gast">;
