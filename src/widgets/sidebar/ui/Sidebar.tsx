import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";

import { useMeQuery } from "@/entities/user";
import { useLogout } from "@/features/auth/logout";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import {
  CloseIcon,
  GearIcon,
  GridIcon,
  MenuIcon,
  PlusIcon,
  PuzzleIcon,
  UserIcon,
} from "@/shared/ui/icon";
import { IconButton } from "@/shared/ui/icon-button";

/**
 * Right-hand app-shell navigation, matching the legacy panel's behavior:
 * an icon-only rail from `md` up, collapsing below that to a floating
 * toggle button. Either one replaces itself with the same gradient panel
 * (identity + labeled nav) sliding in from the right edge over the
 * content, which blurs behind it, and closes on an outside click, Escape,
 * or (below `md`) an explicit close button.
 */
export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const { data: me } = useMeQuery();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  const navItems: Array<{ label: string; icon: ReactNode; to?: string }> = [
    { label: "ارسال نامه", icon: <PlusIcon /> },
    { label: "پیشخوان", icon: <GridIcon />, to: "/dashboard" },
    { label: "تنظیمات فردی", icon: <GearIcon /> },
    { label: "جلسه آنلاین", icon: <PuzzleIcon /> },
  ];

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setExpanded(false)}
        className={cn(
          "fixed inset-0 z-30 backdrop-blur-sm transition-opacity duration-300",
          expanded ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {!expanded && (
        <IconButton
          label="باز کردن منو"
          tone="brand"
          size="lg"
          onClick={() => setExpanded(true)}
          className="auth-gradient fixed top-20 right-4 z-40 shadow-fab md:hidden"
        >
          <MenuIcon />
        </IconButton>
      )}

      <div
        className={cn(
          "auth-gradient fixed inset-y-0 right-0 z-40 hidden w-20 shrink-0 flex-col items-center gap-3 py-6 text-on-gradient md:flex",
          expanded && "md:hidden"
        )}
      >
        <IconButton label="ارسال نامه" tone="on-gradient" size="lg">
          <PlusIcon />
        </IconButton>
        <IconButton
          label="پیشخوان"
          tone="on-gradient"
          size="lg"
          onClick={() => navigate("/dashboard")}
        >
          <GridIcon />
        </IconButton>
        <IconButton
          label="تنظیمات فردی"
          tone="on-gradient"
          size="lg"
          onClick={() => setExpanded((v) => !v)}
        >
          <GearIcon />
        </IconButton>
        <IconButton label="جلسه آنلاین" tone="on-gradient" size="lg">
          <PuzzleIcon />
        </IconButton>
      </div>

      <div
        aria-hidden={!expanded}
        className={cn(
          "auth-gradient fixed inset-y-0 right-0 z-40 flex w-[min(22rem,85vw)] flex-col justify-between overflow-y-auto px-6 py-8 text-on-gradient shadow-md transition-transform duration-300 ease-out",
          expanded ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <div className="flex items-start gap-2">
          <UserIcon className="mt-0.5 shrink-0 text-2xl" />
          <div>
            <p className="text-lg font-bold">{me?.data?.fullName}</p>
            <p className="mt-1 text-sm text-on-gradient-muted">
              {me?.data?.position}
            </p>
            <span className="mt-4 block text-sm text-on-gradient-muted">
              تغییر رمز عبور
            </span>
            <Button
              tone="on-gradient"
              size="sm"
              className="mt-2 px-0!"
              onClick={logout}
            >
              خروج
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setExpanded(false)}
                  className="flex items-center justify-end gap-3 text-sm font-medium hover:text-on-gradient-muted"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="flex items-center justify-end gap-3 text-sm font-medium hover:text-on-gradient-muted"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              )
            )}
          </nav>

          <IconButton
            label="بستن منو"
            tone="on-gradient"
            size="lg"
            onClick={() => setExpanded(false)}
            className="self-end border border-on-gradient-line md:hidden"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};
