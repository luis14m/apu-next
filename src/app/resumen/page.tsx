// src/app/resumen/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Actividad } from "@/types/actividad";
import { Elemento } from "@/types/elemento";
import { getActividades } from "@/services/actividadService";
import { getElementosAsignados } from "@/services/actividadElementoService";
import { ChevronDown, ChevronRight } from "lucide-react";

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
      <h1 className="text-2xl font-bold mb-4 text-center">Resumen de Actividades</h1>

      <div className="space-y-4">
        {actividades.map((actividad) => (
          <div key={actividad.id} className="border rounded-md overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
              onClick={() => toggleElementos(actividad.id)}
            >
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-black">
                  {actividad.codigo} - {actividad.nombre}
                </h3>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span>Unidad: {actividad.unidad}</span>
                <span>Precio Unitario
                  : ${actividad.precio_unitario}</span>
                {expandedActividades[actividad.id] ? (
                  <ChevronDown className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 ml-2" />
                )}
              </div>
            </div>
            
            {expandedActividades[actividad.id] && (
              <div className="p-4 bg-white">
                {elementosPorActividad[actividad.id]?.length > 0 ? (
                  <div className="pl-6">
                    <h4 className="font-medium mb-2">Elementos:</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unidad
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unitario
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {elementosPorActividad[actividad.id].map((elemento) => (
                          <tr key={elemento.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {elemento.codigo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {elemento.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {elemento.unidad}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${elemento.precio_unitario}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay elementos asignados a esta actividad</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}