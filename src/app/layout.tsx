import type { Metadata } from "next";
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
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo y Título */}
              <div className="flex items-center space-x-6">
                <Link href="/" legacyBehavior passHref>
                  <img
                    src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
                    alt="KLV Ingeniería y Construcción"
                    className="h-16 w-auto"
                  />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">EstudiApp</h1>
              </div>

              {/* Barra de Navegación */}
              <div className="flex justify-end p-4">
                <NavigationMenu>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Inicio
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/actividades" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Actividades
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/elementos" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Elementos
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/resumen" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Resumen
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenu>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
