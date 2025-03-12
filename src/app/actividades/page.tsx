export const dynamic = "force-dynamic"; // 👈 Fuerza ruta dinámica
import { getActividades } from "@/services/actividadService";
import {Actividad } from "@/types/actividad";
import { DataTable } from "@/app/actividades/data-table";
import { columns } from "./columns";

//Next.js ejecuta este código en el servidor automáticamente
export default async function HomePage() {
  const actividades: Actividad[] = await getActividades({ cache: "no-store" }); // Obtener datos en el servidor

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Base de Actividades</h1>
     
      <DataTable columns={columns} data={actividades} />
    </div>
  );
}