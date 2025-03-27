// src/app/actividades/seleccionadas/page.tsx
"use client"; // Marcar como componente del cliente

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Actividad } from "@/types/actividad";
import { getActividadById } from "@/services/actividadService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ActividadesSeleccionadasPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids");

  useEffect(() => {
    const loadActividades = async () => {
      if (ids) {
        const idsArray = ids.split(",").map(Number);
        const actividadesPromises = idsArray.map((id) => getActividadById(id));
        const actividades = await Promise.all(actividadesPromises);
        setActividades(actividades.filter((actividad) => actividad !== null));
      }
    };

    loadActividades();
  }, [ids]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Actividades Seleccionadas</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actividades.map((actividad) => (
            <TableRow key={actividad.id}>
              <TableCell>{actividad.codigo}</TableCell>
              <TableCell>{actividad.nombre}</TableCell>
              <TableCell>{actividad.descripcion}</TableCell>
              <TableCell>{actividad.unidad}</TableCell>
              <TableCell>{actividad.precio_unitario}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}