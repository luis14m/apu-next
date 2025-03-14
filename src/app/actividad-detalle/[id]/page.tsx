// src/app/actividad-detalle/[id]/page.tsx
"use client"; // Marcar como componente del cliente

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Actividad } from "@/types/actividad";
import { Elemento } from "@/types/elemento";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getActividadById, updateActividad } from "@/services/actividadService";
import {
  getElementosNoAsignados,
  getElementosAsignados,
  asignarElemento,
  desasignarElemento,
} from "@/services/actividad-elemento";

export default function ActividadDetallePage() {
  const { id } = useParams(); // Obtener el ID de la URL
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [elementosAsignados, setElementosAsignados] = useState<Elemento[]>([]);
  const [elementosDisponibles, setElementosDisponibles] = useState<Elemento[]>([]);
  const [mostrarAsignarElemento, setMostrarAsignarElemento] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // Cargar la actividad y los elementos asignados al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const actividadId = Number(id);
        const actividad = await getActividadById(actividadId);
        setActividad(actividad);
  
        const elementosAsignados = await getElementosAsignados(actividadId);
        setElementosAsignados(elementosAsignados);
      }
    };
  
    loadData();
  }, [id]);

  // Cargar elementos disponibles cuando se muestra la sección de asignar
  useEffect(() => {
    const loadElementosDisponibles = async () => {
      if (mostrarAsignarElemento && actividad?.id) {
        const elementos = await getElementosNoAsignados(actividad.id);
        setElementosDisponibles(elementos);
      }
    };

    loadElementosDisponibles();
  }, [mostrarAsignarElemento, actividad]);

  const handleAsignarElemento = async (elemento: Elemento) => {
    if (!actividad?.id || !elemento?.id) return;
  
    
    try {
      // Asignar el elemento a la actividad
      await asignarElemento(actividad.id, elemento.id);
  
      // Calcular el nuevo precio unitario
      const nuevoPrecioUnitario = actividad.precio_unitario + elemento.precio_unitario;
  
      // Actualizar el precio unitario en la base de datos
      await updateActividad(actividad.id, { precio_unitario: nuevoPrecioUnitario });
  
      // Actualizar el estado local de la actividad
      const updatedActividad = { ...actividad, precio_unitario: nuevoPrecioUnitario };
      setActividad(updatedActividad);
  
      // Actualizar las listas de elementos
      setElementosDisponibles((prev) => prev.filter((e) => e.id !== elemento.id));
      setElementosAsignados((prev) => [...prev, elemento]);
    } catch (error) {
      console.error("Error asignando elemento:", error);
    } finally {
      
    }
  };

  // Función para desasignar un elemento de la actividad
  const handleDesasignarElemento = async (elementoId: number) => {
    if (!actividad?.id) return;

    try {
      await desasignarElemento(actividad.id, elementoId);

      // Actualizar el precio unitario de la actividad
      const elemento = elementosAsignados.find((e) => e.id === elementoId);
      if (elemento) {
        const updatedActividad = { ...actividad, precio_unitario: actividad.precio_unitario - elemento.precio_unitario };
        setActividad(updatedActividad);
      }

      // Actualizar las listas de elementos
      setElementosAsignados((prev) => prev.filter((e) => e.id !== elementoId));
      setElementosDisponibles((prev) => [...prev, ...elementosAsignados.filter((e) => e.id === elementoId)]);
    } catch (error) {
      console.error("Error desasignando elemento:", error);
    }
  };

  // Filtrar elementos disponibles según el término de búsqueda
  const filteredElementos = elementosDisponibles.filter((elemento) =>
    Object.values(elemento).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!actividad) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Detalle de la Actividad</h1>
      </div>

      {/* Detalles de la actividad */}
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
          <TableRow>
            <TableCell>{actividad.codigo}</TableCell>
            <TableCell>{actividad.nombre}</TableCell>
            <TableCell>{actividad.unidad}</TableCell>
            <TableCell>{actividad.precio_unitario}</TableCell>
            <TableCell>
              <Button onClick={() => setMostrarAsignarElemento(!mostrarAsignarElemento)}>
                {mostrarAsignarElemento ? "Ocultar" : "Asignar"}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Elementos asignados */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Elementos Asignados</h2>
        {elementosAsignados.length > 0 ? (
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
              {elementosAsignados.map((elemento) => (
                <TableRow key={elemento.id}>
                  <TableCell>{elemento.codigo}</TableCell>
                  <TableCell>{elemento.nombre}</TableCell>
                  <TableCell>{elemento.unidad}</TableCell>
                  <TableCell>{elemento.precio_unitario}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDesasignarElemento(elemento.id!)}>
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No hay elementos asignados a esta actividad.</p>
        )}
      </div>

      {/* Elementos disponibles para asignar */}
      {mostrarAsignarElemento && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Elementos Disponibles</h2>
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              
            />
          </div>
          {filteredElementos.length > 0 ? (
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
                {filteredElementos.map((elemento) => (
                  <TableRow key={elemento.id}>
                    <TableCell>{elemento.codigo}</TableCell>
                    <TableCell>{elemento.nombre}</TableCell>
                    <TableCell>{elemento.unidad}</TableCell>
                    <TableCell>{elemento.precio_unitario}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleAsignarElemento(elemento)}>
                        Asignar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No hay elementos disponibles para asignar.</p>
          )}
        </div>
      )}
    </div>
  );
}