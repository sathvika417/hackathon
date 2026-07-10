import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogIn, UserPlus, LayoutDashboard, Settings, LogOut, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="profile-dropdown-trigger"
          aria-label="Open profile menu"
          className="glass grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          {user ? (
            <span
              data-testid="profile-avatar"
              className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500 font-mono-data text-[11px] font-semibold text-slate-950"
            >
              {initials}
            </span>
          ) : (
            <User className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="glass-strong w-56 rounded-2xl border-border p-1.5"
        data-testid="profile-dropdown-menu"
      >
        {user ? (
          <>
            <DropdownMenuLabel className="px-3 pt-3 pb-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Signed in as
              </div>
              <div className="mt-1 truncate font-display text-sm font-medium">
                {user.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-testid="menu-profile"
              onSelect={() => navigate("/profile")}
              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-muted"
            >
              <UserCircle2 className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              data-testid="menu-dashboard"
              onSelect={() => navigate("/analyze")}
              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-muted"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              data-testid="menu-settings"
              onSelect={() => navigate("/settings")}
              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-muted"
            >
              <Settings className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-testid="menu-logout"
              onSelect={() => {
                logout();
                navigate("/");
              }}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-red-500 focus:bg-red-500/10 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="px-3 pt-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem
              data-testid="menu-login"
              onSelect={() => navigate("/login")}
              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-muted"
            >
              <LogIn className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem
              data-testid="menu-signup"
              onSelect={() => navigate("/signup")}
              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-muted"
            >
              <UserPlus className="mr-2 h-4 w-4" strokeWidth={1.75} />
              Sign Up
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
