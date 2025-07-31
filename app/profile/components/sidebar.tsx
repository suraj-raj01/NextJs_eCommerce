"use client"

import * as React from "react"
import {
  CreditCard ,
  ShieldUser,
} from "lucide-react"

import { NavMain } from "../../../components/ui/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "../../../components/ui/sidebar"

// This is sample data.
const data = {
  
  navMain: [
    {
      title: "Profile",
      url: "/profile",
      icon: ShieldUser,
      items: [
        {
          title: "All Orders",
          url: "/profile/orders",
        },
        {
          title: "You're likes",
          url: "/vendor/roles/permissions",
        },
        {
          title: "Your current plan",
          url: "/vendor/roles/permissions",
        },
      ],
    },
    {
      title: "Get Plans",
      url: "/profile",
      icon: CreditCard ,
      items: [
        {
          title: "Get Subscriptions",
          url: "/profile/orders",
        },
        {
          title: "Become a Seller",
          url: "/vendor/roles/permissions",
        },
      ],
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />  
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
