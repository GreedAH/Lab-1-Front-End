export type NavChildItem = {
  label: string;
  href: string;
};

export type NavParentItem = {
  label: string;
  children: NavChildItem[];
};

export type RoleNavItems = {
  SUPER_ADMIN: NavParentItem[];
  ADMIN: NavParentItem[];
};

export const navigationItems: RoleNavItems = {
  SUPER_ADMIN: [
    {
      label: "Users",
      children: [
        { label: "Create Super Admin", href: "/admin/users/create" },
        { label: "Create Admin", href: "/admin/create" },
        { label: "Manage Users", href: "/admin/users" },
      ],
    },
    {
      label: "Events",
      children: [
        { label: "Create Event", href: "/events/create" },
        { label: "Manage Events", href: "/events" },
      ],
    },
  ],
  ADMIN: [
    {
      label: "Events",
      children: [
        { label: "Create Event", href: "/events/create" },
        { label: "Manage Events", href: "/events" },
      ],
    },
  ],
};
