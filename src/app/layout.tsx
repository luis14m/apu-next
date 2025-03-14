import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Analisis PU",
  description: "App en Next",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

       <div className="flex justify-end p-4">
       <NavigationMenu>
          <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Inicio
              </NavigationMenuLink>
            </Link>
            <Link href="/actividades" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Actividades
              </NavigationMenuLink>
            </Link>
            <Link href="/elementos" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Elementos
              </NavigationMenuLink>
            </Link>
            <Link href="/resumen" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Resumen
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenu>

       </div>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
