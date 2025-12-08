"use client";
import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { easeInOut } from "motion/react";

/**
 * Aceternity-like Sidebar
 *
 * Features:
 * - Desktop: hover to expand/collapse (compact collapsed width, smooth animation)
 * - Mobile: top bar with menu icon; open -> full-screen slide-over
 * - SidebarLink: icon-centered when collapsed, label when expanded
 * - Active link: left accent bar + highlight
 * - Tooltip on collapsed icons (animated)
 */
type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

/* ---------- context ---------- */
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

/* ---------- constants ---------- */
const COLLAPSED_WIDTH = 92; // px
const EXPANDED_WIDTH = 280; // px
const TRANSITION = { duration: 0.22, ease: easeInOut };

/* ---------- Desktop Sidebar ---------- */
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: DivProps) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        "hidden md:flex md:flex-col shrink-0 h-full bg-neutral-50 dark:bg-neutral-900 border-r border-transparent",
        className
      )}
      animate={{
        width: animate ? (open ? EXPANDED_WIDTH : COLLAPSED_WIDTH) : EXPANDED_WIDTH,
      }}
      transition={TRANSITION}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...(props as any)}
      style={{ minWidth: COLLAPSED_WIDTH }}
    >
      <div className="h-full overflow-hidden flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

/* ---------- Mobile Sidebar (top bar and slide-over) ---------- */
export const MobileSidebar = ({
  className,
  children,
  ...props
}: DivProps ) => {
  const { open, setOpen } = useSidebar();

  return (
    <div className={cn("md:hidden w-full", className)} {...props}>
      <div className="h-12 px-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border-b">
        <div className="flex items-center">
          {/* small branding placeholder */}
          <div className="text-sm font-semibold">GameStores</div>
        </div>
        <div className="flex items-center">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <IconMenu2 className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={TRANSITION}
            className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 p-6 overflow-auto"
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <IconX className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Tooltip for collapsed icons ---------- */
const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="relative"
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-black text-white text-xs px-2 py-1 shadow"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Sidebar Link component (active, collapsed tooltip, accent) ---------- */
export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = !!pathname && (pathname === link.href || pathname.startsWith(link.href + "/"));

  return (
    <div className="relative">
      {/* left accent for active link */}
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 rounded-r-md transition-all",
          isActive ? "bg-gradient-to-b from-blue-500 to-indigo-500" : "bg-transparent"
        )}
      />
      <a
        href={link.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 py-2 px-3 rounded-r-md transition-colors",
          isActive ? "bg-gradient-to-r from-blue-50 to-transparent text-blue-600" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
          open ? "justify-start" : "justify-center",
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-md", isActive ? "bg-white/50" : "")}>
          {/* Tooltip only needed when collapsed */}
          {open ? (
            link.icon
          ) : (
            <Tooltip label={link.label}>
              <div>{link.icon}</div>
            </Tooltip>
          )}
        </div>

        {/* label: show only when expanded */}
        <motion.span
          initial={false}
          animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          transition={TRANSITION}
          className={cn("text-sm leading-tight mr-2 overflow-hidden", open ? "inline-block" : "hidden")}
        >
          {link.label}
        </motion.span>
      </a>
    </div>
  );
};

/* ---------- SidebarBody wrapper (optional) ---------- */
export const SidebarBody = (props: DivProps) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as DivProps )} />
    </>
  );
};