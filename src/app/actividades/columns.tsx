"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  
  Pencil,
  Trash2,
  CheckIcon,

} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Actividad, UNIDADES } from "@/types/actividad";
import Link from "next/link";

import { deleteActividad, updateActividad } from "@/services/actividadService";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { memo } from "react";
import {
  Dialog,

  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";



interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actividad: Actividad;
}

const EditableCell = memo(
  ({
    value,
    onSave,
  }: {
    value: string;
    onSave: (newValue: string) => void;
  }) => {
    const [editingValue, setEditingValue] = useState(value);

    const handleSave = () => {
      onSave(editingValue);
    };

    return (
      <div className="flex gap-2">
        <Input
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          autoFocus
        />
        <Button variant="ghost" size="icon" onClick={handleSave}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

export default EditableCell;

const handleDelete = async (id: string) => {
  if (!window.confirm("¿Estás seguro de eliminar?")) return;

  try {
    await deleteActividad(id);
    window.location.reload();
  } catch (error) {
    console.error("Error al eliminar el gasto:", error);
    alert("Hubo un error al eliminar el gasto");
  }
};

export const columns: ColumnDef<Actividad>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "codigo",
    accessorKey: "codigo",
    header: "Código",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const actividad = row.original;
      return (
        <Link
          href={`/actividad-detalle/${actividad.id}`} // Ruta dinámica
          className="text-blue-500 hover:underline"
        >
          {actividad.codigo}
        </Link>
      );
    },
  },
  {
    id: "nombre",
    accessorKey: "nombre",
    enableGlobalFilter: true,
    header: "Nombre",
    cell: ({ row }) => {
      const actividad = row.original;
      return (
        <Link
          href={`/actividad-detalle/${actividad.id}`} // Ruta dinámica
          className="text-blue-500 hover:underline"
        >
          {actividad.nombre}
        </Link>
      );
    },
  },
  {
    id: "descripcion",
    accessorKey: "descripcion",
    header: "Descripción",
    enableGlobalFilter: true,
  },
  {
    id: "unidad",
    accessorKey: "unidad",
    header: "Unidad",
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const actividad = row.original;
  
      // Estados para los campos editables
      const [codigoEditado, setCodigoEditado] = useState(actividad.codigo);
      const [nombreEditado, setNombreEditado] = useState(actividad.nombre);
      const [descripcionEditada, setDescripcionEditada] = useState(actividad.descripcion);
      const [unidadEditada, setUnidadEditada] = useState(actividad.unidad);
  
      const handleSave = async () => {
        const updatedActividad = {
          ...actividad,
          codigo: codigoEditado,
          nombre: nombreEditado,
          descripcion: descripcionEditada,
          unidad: unidadEditada,
        };
  
        try {
          await updateActividad(updatedActividad.id, updatedActividad);
          setIsEditing(false);
          window.location.reload(); // Recargar la página para reflejar los cambios
        } catch (error) {
          console.error("Error al actualizar la actividad:", error);
          alert("Hubo un error al actualizar la actividad");
        }
      };
  
      return (
        <div className="flex gap-2">
          {/* Botón Editar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
  
          {/* Botón Eliminar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(actividad.id.toString())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
  
          {/* Diálogo de edición */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogTitle>Editar Actividad</DialogTitle>
              <div className="space-y-4">
                {/* Campo Código */}
                <div>
                  <label className="block text-sm font-medium mb-1">Código</label>
                  <Input
                    value={codigoEditado}
                    onChange={(e) => setCodigoEditado(e.target.value)}
                    placeholder="Código"
                  />
                </div>
  
                {/* Campo Nombre */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    placeholder="Nombre"
                  />
                </div>
  
                {/* Campo Descripción */}
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <Input
                    value={descripcionEditada}
                    onChange={(e) => setDescripcionEditada(e.target.value)}
                    placeholder="Descripción"
                  />
                </div>
  
                {/* Campo Unidad (Select) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <Select
                    value={unidadEditada}
                    onValueChange={(value) => setUnidadEditada(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES.map((unidad) => (
                        <SelectItem key={unidad} value={unidad}>
                          {unidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
  
                {/* Botones de acción */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Guardar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
