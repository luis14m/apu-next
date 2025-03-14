// src/app/resumen/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Actividad } from "@/types/actividad";
import { Elemento } from "@/types/elemento";
import { getActividades } from "@/services/actividadService";
import { getElementosAsignados } from "@/services/actividad-elemento";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ResumenPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [elementosPorActividad, setElementosPorActividad] = useState<{
    [key: number]: Elemento[];
  }>({});
  const [expandedActividades, setExpandedActividades] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const actividades = await getActividades();
        setActividades(actividades);

        const elementosPorActividad: { [key: number]: Elemento[] } = {};
        for (const actividad of actividades) {
          const elementosAsignados = await getElementosAsignados(actividad.id);
          elementosPorActividad[actividad.id] = elementosAsignados;
        }
        setElementosPorActividad(elementosPorActividad);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    loadData();
  }, []);

  const toggleElementos = (actividadId: number) => {
    setExpandedActividades((prev) => ({
      ...prev,
      [actividadId]: !prev[actividadId],
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Resumen de Actividades</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actividades.map((actividad) => (
            <TableRow key={actividad.id}>
              <TableCell>{actividad.codigo}</TableCell>
              <TableCell>{actividad.nombre}</TableCell>
              <TableCell>{actividad.unidad}</TableCell>
              <TableCell>{actividad.precio_unitario}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleElementos(actividad.id)}
                >
                  {expandedActividades[actividad.id] ? "-" : "+"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {actividades.map((actividad) => (
        <div key={actividad.id} className="mt-4">
          {expandedActividades[actividad.id] && (
            <div className="ml-8">
              <h2 className="text-xl font-bold mb-2">Elementos de {actividad.nombre}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Precio Unitario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elementosPorActividad[actividad.id].map((elemento) => (
                    <TableRow key={elemento.id}>
                      <TableCell>{elemento.codigo}</TableCell>
                      <TableCell>{elemento.nombre}</TableCell>
                      <TableCell>{elemento.unidad}</TableCell>
                      <TableCell>{elemento.precio_unitario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}