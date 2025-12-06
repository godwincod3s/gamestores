"use client";
import vars from "@/globalvars"
import { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Products", link: "/products" },
  { name: "Blog", link: "/blog" },
];
const {name} = vars;

export default function Header(props: { className: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <Navbar className={props.className}>
        <NavBody>
          <Link href="/" className="relative z-20 mr-4 flex items-center px-2 py-1">
            <span className="font-bold text-black dark:text-white">GameStores</span>
          </Link>
          <NavItems items={navItems} onItemClick={() => setIsOpen(false)} />
          <NavbarButton href="/products" variant="primary">
            Shop Now
          </NavbarButton>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="font-bold text-black dark:text-white Capitalize">
              {name}
            </Link>
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <NavbarButton href="/products" variant="primary" className="w-full mt-4">
              Shop Now
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
  );
}