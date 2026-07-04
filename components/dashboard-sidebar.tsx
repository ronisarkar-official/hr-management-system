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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
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
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  Trash2,
  UserCheck,
  Calendar,
  FileText,
  Users,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SettingsDialog } from "@/components/settings-dialog";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const DATA = {
  teams: [
    {
      name: "HRMS Portal",
      logo: GalleryVerticalEnd,
      plan: "Odoo Hackathon 2026",
    },
    {
      name: "Tech Department",
      logo: AudioWaveform,
      plan: "Engineering",
    },
    {
      name: "HR Operations",
      logo: Command,
      plan: "Management",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Recent Activity",
          url: "/dashboard#activity",
        },
      ],
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: Frame,
      items: [
        {
          title: "Personal Details",
          url: "/dashboard/profile",
        },
        {
          title: "Job & Salary",
          url: "/dashboard/profile#job",
        },
      ],
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: UserCheck,
      items: [
        {
          title: "Daily Check-in",
          url: "/dashboard/attendance",
        },
        {
          title: "Weekly Log",
          url: "/dashboard/attendance#weekly",
        },
      ],
    },
    {
      title: "Leave Requests",
      url: "/dashboard/leaves",
      icon: Calendar,
      items: [
        {
          title: "Apply Leave",
          url: "/dashboard/leaves",
        },
        {
          title: "Leave History",
          url: "/dashboard/leaves#history",
        },
      ],
    },
    {
      title: "Payroll",
      url: "/dashboard/payroll",
      icon: FileText,
      items: [
        {
          title: "Salary Structure",
          url: "/dashboard/payroll",
        },
        {
          title: "Payslips",
          url: "/dashboard/payroll#payslips",
        },
      ],
    },
  ],
  adminModules: [
    {
      name: "Employee Directory",
      url: "/dashboard/admin/employees",
      icon: Users,
    },
    {
      name: "Admin Attendance",
      url: "/dashboard/admin/attendance",
      icon: UserCheck,
    },
    {
      name: "Leave Approvals",
      url: "/dashboard/admin/leaves",
      icon: Calendar,
    },
    {
      name: "Payroll Management",
      url: "/dashboard/admin/payroll",
      icon: CreditCard,
    },
  ],
};

export const DashboardSidebar = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) {
        router.push("/login");
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

  if (!activeTeam) return null;

  return (
    <>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <activeTeam.logo className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {activeTeam.name}
                        </span>
                        <span className="truncate text-xs">
                          {activeTeam.plan}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Departments
                    </DropdownMenuLabel>
                    {DATA.teams.map((team) => (
                      <DropdownMenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                        className="gap-2 p-2"
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <team.logo className="size-4 shrink-0" />
                        </div>
                        {team.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* ONLY RENDER ADMIN MODULES IF USER IS AN ADMIN */}
            {userRole === "admin" && (
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                  <SidebarGroupLabel className="p-0 text-foreground font-extrabold tracking-wide uppercase text-[11px] flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    HR Admin Modules
                  </SidebarGroupLabel>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-foreground font-bold border border-primary/20">
                    ADMIN
                  </span>
                </div>
                <SidebarMenu>
                  {DATA.adminModules.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        className="hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                      >
                        <Link href={item.url}>
                          <item.icon className="text-muted-foreground shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}

            {/* EMPLOYEE PORTAL (COMMON FOR ALL OR PERSONAL FOR ADMIN) */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                {userRole === "admin" ? "My Personal Employee Account" : "Employee Portal"}
              </SidebarGroupLabel>
              <SidebarMenu>
                {DATA.navMain.map((item) => (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
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
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userRole === "admin" ? "HR Officer" : "Employee"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
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
                      <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                        <User className="mr-2 size-4" />
                        My Profile
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
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      {userRole === "admin" ? "HR Admin Portal" : "HRMS Dashboard"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 pt-4">{children}</div>
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
};
