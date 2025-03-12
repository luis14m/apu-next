"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight, Pencil, Trash2, CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Actividad } from "@/types/actividad";

import { deleteActividad, updateActividad } from "@/services/actividadService";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { memo } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actividad: Actividad;
}




const EditableCell = memo(({ value, onSave }: { value: string; onSave: (newValue: string) => void }) => {
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
});

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
  },
  {
    id: "nombre",
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const actividad = row.original;
  
      const handleSave = async (newValue: string) => {
        const updatedActividad = { ...actividad, nombre: newValue };
        try {
          await updateActividad(updatedActividad.id, updatedActividad);
          setIsEditing(false);
          window.location.reload();
        } catch (error) {
          console.error("Error al actualizar la actividad:", error);
          alert("Hubo un error al actualizar la actividad");
        }
      };
  
      return isEditing ? (
        <EditableCell value={actividad.nombre} onSave={handleSave} />
      ) : (
        <span onClick={() => setIsEditing(true)}>{actividad.nombre}</span>
      );
    },
  },
  {
    id: "descripcion",
    accessorKey: "descripcion",
    header: "Descripción",
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
  
      const handleSave = async (updatedActividad: Actividad) => {
        try {
          await updateActividad(updatedActividad.id.toString(), updatedActividad);
          setIsEditing(false);
          window.location.reload();
        } catch (error) {
          console.error("Error al actualizar la actividad:", error);
          alert("Hubo un error al actualizar la actividad");
        }
      };
  
      return (
        <div className="flex gap-2">
          {/* Botón Nuevo con Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form /> {/* Formulario para crear una nueva actividad */}
            </DialogContent>
          </Dialog>
  
          {/* Botón Editar */}
          {isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSave(actividad)}
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
  
          {/* Botón Eliminar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(actividad.id.toString())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];