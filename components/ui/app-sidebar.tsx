"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  MonitorCog ,
  SquareTerminal,
  ShoppingCart,
  LayoutDashboard,
  Users,
  CircleDollarSign,
  ShieldUser,
  LocateFixed,
  Box,
  PieChart,
  Map,
  CreditCard 
} from "lucide-react"

import { NavMain } from "../../components/ui/nav-main"
import { NavProjects } from "../../components/ui/nav-projects"
import { NavUser } from "../../components/ui/nav-user"
import { TeamSwitcher } from "../../components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Nextjs team",
      logo: GalleryVerticalEnd,
      plan: "interns",
    },
    {
      name: "Flutter team",
      logo: AudioWaveform,
      plan: "interns",
    },
    {
      name: "Native team",
      logo: Command,
      plan: "interns",
    },
    {
      name: "Laravel team",
      logo: Box,
      plan: "employee",
    },
  ],
  navMain: [
    {
      title: "Role Permission",
      url: "/vendor/roles",
      icon: ShieldUser,
      items: [
        {
          title: "All roles",
          url: "/vendor/roles",
        },
        {
          title: "All permissions",
          url: "/vendor/roles/permissions",
        },
        {
          title: "Manage permissions",
          url: "/vendor/roles/permissions/manage",
        },
      ],
    },
    {
      title: "Products",
      url: "/vendor/product",
      icon: LayoutDashboard,
      items: [
        {
          title: "All Product",
          url: "/vendor/product",
        },
        {
          title: "Insert Product",
          url: "/vendor/product/create",
        },
      ],
    },
    {
      title: "Orders",
      url: "/vendor/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All orders",
          url: "/vendor/orders",
        },
        {
          title: "Complaints",
          url: "/vendor/orders/complaints",
        },
        {
          title: "Refunds",
          url: "/vendor/orders/refund",
        },
        {
          title: "Returns",
          url: "/vendor/orders/return",
        },
        {
          title: "Reviews",
          url: "/vendor/orders/reviews",
        },
      ],
    },
    {
      title: "Sellings",
      url: "/vendor/selling",
      icon: CircleDollarSign,
      items: [
        {
          title: "Sellings",
          url: "/vendor/selling",
        },
        {
          title: "Taxrule",
          url: "/vendor/selling/taxrule",
        },
        {
          title: "Create taxrule",
          url: "/vendor/selling/taxrule/create",
        },
      ],
    },
    {
      title: "Delivery Tracking",
      url: "/vendor/deliverytracking",
      icon: LocateFixed,
      items: [
        {
          title: "Delivery tracking",
          url: "/vendor/deliverytracking",
        },
      ],
    },
    {
      title: "Users",
      url: "/vendor/users",
      icon: Users,
      items: [
        {
          title: "All users",
          url: "/vendor/users",
        },
        {
          title: "Create user",
          url: "/vendor/users/create",
        },
        {
          title: "Assign role",
          url: "/vendor/users/assignrole",
        },
      ],
    },

    {
      title: "Site Settings",
      url: "/vendor/sitesettings/create",
      icon: MonitorCog ,
      items: [
        {
          title: "Site settings",
          url: "/vendor/sitesettings",
        }
      ],
    },
    {
      title: "Plans",
      url: "/vendor/sitesettings/plans",
      icon: CreditCard  ,
      items: [
        {
          title: "Plans",
          url: "/vendor/sitesettings/plans",
        },
        {
          title: "Plantype",
          url: "/vendor/sitesettings/plantype",
        },
        {
          title: "Biling Cycle",
          url: "/vendor/sitesettings/bilingcycle",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "/vendor/sitesettings/create",
    //   icon: Settings,
    //   items: [
    //     {
    //       title: "Site settings",
    //       url: "/vendor/sitesettings/create",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Appearance",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
