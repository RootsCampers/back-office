"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Users,
  Headphones,
  Truck,
  DollarSign,
  LogOut,
  Kanban,
  UserPlus,
  Calendar,
  Route,
  AlertTriangle,
  Ticket,
  Car,
  Wrench,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/en/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Sales",
    icon: <TrendingUp className="h-5 w-5" />,
    children: [
      {
        label: "CRM",
        href: "/en/sales/crm",
        icon: <Kanban className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Operations",
    icon: <Users className="h-5 w-5" />,
    children: [
      {
        label: "Host Acquisition",
        href: "/en/operations/host-acquisition",
        icon: <UserPlus className="h-4 w-4" />,
      },
      {
        label: "Bookings",
        href: "/en/operations/bookings",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        label: "Trips",
        href: "/en/operations/trips",
        icon: <Route className="h-4 w-4" />,
      },
      {
        label: "Incidents",
        href: "/en/operations/incidents",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Support",
    icon: <Headphones className="h-5 w-5" />,
    children: [
      {
        label: "Tickets",
        href: "/en/support/tickets",
        icon: <Ticket className="h-4 w-4" />,
      },
      {
        label: "Travelers",
        href: "/en/support/travelers",
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: "Hosts",
        href: "/en/support/hosts",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Fleet",
    icon: <Truck className="h-5 w-5" />,
    children: [
      {
        label: "Vehicles",
        href: "/en/fleet/vehicles",
        icon: <Car className="h-4 w-4" />,
      },
      {
        label: "Maintenance",
        href: "/en/fleet/maintenance",
        icon: <Wrench className="h-4 w-4" />,
      },
      {
        label: "Documents",
        href: "/en/fleet/documents",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Finance",
    icon: <DollarSign className="h-5 w-5" />,
    children: [
      {
        label: "Payments",
        href: "/en/finance/payments",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: "Invoices",
        href: "/en/finance/invoices",
        icon: <Receipt className="h-4 w-4" />,
      },
      {
        label: "Reports",
        href: "/en/finance/reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
];

interface NavItemProps {
  item: NavItem;
  isCollapsed: boolean;
}

function NavItemComponent({ item, isCollapsed }: NavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = item.href ? pathname === item.href : false;
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const isChildActive = hasChildren
    ? children.some((child) => pathname === child.href)
    : false;

  // Auto-expand if a child is active
  const shouldBeOpen = isOpen || isChildActive;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!shouldBeOpen)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "text-slate-300 hover:text-white hover:bg-slate-800",
            isChildActive && "text-white bg-slate-800"
          )}
        >
          {item.icon}
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {shouldBeOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          )}
        </button>
        {!isCollapsed && shouldBeOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4">
            {children.map((child) => (
              <Link
                key={child.href}
                href={child.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === child.href
                    ? "text-white bg-primary"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {child.icon}
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "text-white bg-primary"
          : "text-slate-300 hover:text-white hover:bg-slate-800"
      )}
    >
      {item.icon}
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/en";
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">RC</span>
                </div>
                <span className="font-semibold">Back-Office</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5 rotate-90" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigation.map((item) => (
              <NavItemComponent
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-800">
            {!isCollapsed && user && (
              <div className="mb-3 px-3">
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs text-slate-400">Team Member</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
