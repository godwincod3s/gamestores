// app/(routes)/account/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Sidebar,
  DesktopSidebar,
  MobileSidebar,
  SidebarLink,
} from "@/components/ui/sidebar";
import { wpGetUserByToken } from "@/lib/wpAuth";
import AccountAvatar from "@/components/AccountAvatar";
import {
  IconShoppingCart,
  IconDownload,
  IconMapPin,
  IconCreditCard,
  IconUser,
  IconHeart,
} from "@tabler/icons-react";
import Image from "next/image";
import vars from "@/globalvars";

const { app_name } = vars;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("wp_token")?.value ?? null;

  if (!token) {
    redirect("/login");
  }

  let user = null;
  try {
    user = await wpGetUserByToken(token);
  } catch (err) {
    redirect("/login");
  }

  const avatar =
    user?.avatar_urls?.["96"] ||
    user?.avatar_urls?.[96] ||
    `https://www.gravatar.com/avatar/?d=mp&s=96`;

  const navLinks = [
    { label: "Overview", href: "/account", icon: <IconUser className="w-5 h-5" /> },
    { label: "Orders", href: "/account/orders", icon: <IconShoppingCart className="w-5 h-5" /> },
    { label: "Downloads", href: "/account/downloads", icon: <IconDownload className="w-5 h-5" /> },
    { label: "Addresses", href: "/account/addresses", icon: <IconMapPin className="w-5 h-5" /> },
    { label: "Payment Methods", href: "/account/payment-methods", icon: <IconCreditCard className="w-5 h-5" /> },
    { label: "Wishlist", href: "/account/wishlist", icon: <IconHeart className="w-5 h-5" /> },
    { label: "Cart", href: "/account/cart", icon: <IconShoppingCart className="w-5 h-5" /> },
    { label: "Account Details", href: "/account/account-details", icon: <IconUser className="w-5 h-5" /> },
  ];

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-8 flex gap-6 h-[100vh]">
        {/* Desktop sidebar */}
        <DesktopSidebar className="shrink-0 bg-neutral-50 dark:bg-neutral-900 border-r ">
          {/* Top: Logo / branding */}
          <div className="px-4 py-4 border-b">
            <a href="/" className="flex items-center gap-3">
              <Image src="/checkout-cart-12kb.webp" width={100} height={100} alt="Logo" className="w-8 h-8 hidden md:block" />
              <span className="text-lg font-bold capitalize">{app_name}</span>
            </a>
          </div>

          {/* Middle: nav (grow to fill center) */}
          <div className="flex-1 overflow-auto px-2 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </nav>
          </div>

          {/* Bottom: account avatar & actions */}
          <div className="px-3 py-4 border-t">
            <AccountAvatar
              name={user?.display_name || user?.username || ''}
              email={user?.email}
              avatar={avatar}
            />
          </div>
        </DesktopSidebar>

        {/* Main content & mobile */}
        <div className="flex-1 min-w-0">
          {/* Mobile top bar + slide-over content */}
          <MobileSidebar className="mb-4">
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Logo at top of slide-over */}
                <div className="px-2 pb-4 border-b mb-4">
                  <a href="/" className="flex items-center gap-3">
                    <Image src="/checkout-cart-12kb.webp" width={100} height={100} alt="Logo" className="w-8 h-8" />
                    <span className="text-lg font-bold capitalize">{app_name}</span>
                  </a>
                </div>

                {/* Nav */}
                <div className="px-2 space-y-2">
                  {navLinks.map((link) => (
                    <SidebarLink key={link.href} link={link} className="w-full" />
                  ))}
                </div>
              </div>

              {/* Bottom avatar / logout */}
              <div className="px-2 pt-4 border-t">
                <AccountAvatar
                  name={user?.display_name || user?.username || ''}
                  email={user?.email}
                  avatar={avatar}
                />
              </div>
            </div>
          </MobileSidebar>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </Sidebar>
  );
}