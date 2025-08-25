"use client"

import { Activity, Brain, Heart, Home } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Diabetes Prediction",
      icon: Activity,
      path: "/diabetes",
    },
    {
      title: "Heart Disease Prediction",
      icon: Heart,
      path: "/heart-disease",
    },
    {
      title: "Parkinson's Disease Prediction",
      icon: Brain,
      path: "/parkinsons",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-xl font-bold">MediPredict</span>
        </div>
        <div className="flex md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton isActive={pathname === item.path} onClick={() => router.push(item.path)}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
