

export const dynamic = "force-dynamic"; // 👈 Fuerza ruta dinámica
import { getElementos } from "@/services/elementoService";
import { Elemento } from "@/types/elemento";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import NewElementForm from "./NewElementForm";

export default async function HomePage() {
  const elementos: Elemento[] = await getElementos({ cache: "no-store" });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Base de Elementos</h1>

    
      {/* Tabla de elementos */}
      <DataTable columns={columns} 
      data={elementos}
      addButton={<NewElementForm />}  />
    </div>
  );
}