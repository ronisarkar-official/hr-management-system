"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  Wallet,
  Users,
  Building2,
  UserCheck,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { SettingsDialog } from "@/components/settings-dialog";
import { NotificationBell } from "@/components/notification-bell";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const employeeNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Attendance", url: "/dashboard/attendance", icon: Clock },
  { title: "Leaves", url: "/dashboard/leaves", icon: CalendarDays },
  { title: "Payroll", url: "/dashboard/payroll", icon: Wallet },
];

const adminNav: NavItem[] = [
  { title: "Employees", url: "/dashboard/admin/employees", icon: Users },
  { title: "Departments", url: "/dashboard/admin/departments", icon: Building2 },
  { title: "Attendance", url: "/dashboard/admin/attendance", icon: UserCheck },
  { title: "Leave Approvals", url: "/dashboard/admin/leaves", icon: Calendar },
  { title: "Payroll", url: "/dashboard/admin/payroll", icon: CreditCard },
];

const navTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/profile": "Profile",
  "/dashboard/attendance": "Attendance",
  "/dashboard/leaves": "Leaves",
  "/dashboard/payroll": "Payroll",
  "/dashboard/admin/employees": "Employees",
  "/dashboard/admin/departments": "Departments",
  "/dashboard/admin/attendance": "Attendance",
  "/dashboard/admin/leaves": "Leave Approvals",
  "/dashboard/admin/payroll": "Payroll",
};

export const DashboardSidebar = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [profileId, setProfileId] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) {
        router.push("/login");
      } else {
        const { getMyProfile } = await import("@/lib/actions/profile");
        const result = await getMyProfile(data.user.id);
        if (result.success && result.data) {
          setProfileId(result.data.id);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const userRole = user?.user_metadata?.role || "employee";
  const userName = user?.user_metadata?.full_name || user?.email || "User";
  const userEmail = user?.email ?? "";
  const userAvatar = user?.user_metadata?.avatar_url ?? "";
  const userInitials =
    userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(url);
  };

  const currentPageTitle = navTitles[pathname] || "";

  return (
    <>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                    H
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">HRMS Portal</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userRole === "admin" ? "Admin Panel" : "Employee Portal"}
                    </span>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Admin Section */}
            {userRole === "admin" && (
              <SidebarGroup>
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                  Admin
                </SidebarGroupLabel>
                <SidebarMenu>
                  {adminNav.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon className="shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}

            {/* Employee Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {userRole === "admin" ? "Self Service" : "Menu"}
              </SidebarGroupLabel>
              <SidebarMenu>
                {employeeNav.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon className="shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userRole === "admin" ? "HR Officer" : "Employee"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {userName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {userEmail}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                        <Settings className="mr-2 size-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="mr-2 size-4" />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPageTitle && currentPageTitle !== "Overview" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-1 px-4">
              {profileId && <NotificationBell profileId={profileId} />}
            </div>
          </header>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-4"
          >
            {children}
          </motion.div>
        </SidebarInset>
      </SidebarProvider>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        userInitials={userInitials}
      />
    </>
  );
}
