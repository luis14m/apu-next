"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight, Pencil, Trash2, CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Elemento } from "@/types/elemento";

import { deleteElemento, updateElemento } from "@/services/elementoService";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { memo } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ArrowUpDown } from "lucide-react"
 

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import NewElementForm from "./NewElementForm";


interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elemento: Elemento;
}

interface EditableCellProps {
  value: number;
  onSave: (newValue: number) => void;
}

const EditableCell = memo(({ value, onSave }: EditableCellProps) => {
  const [editingValue, setEditingValue] = useState(value.toString());

  const handleSave = () => {
    const numericValue = parseFloat(editingValue);
    if (!isNaN(numericValue)) {
      onSave(numericValue);
    } else {
      alert("Por favor, ingresa un valor numérico válido.");
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
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

EditableCell.displayName = "EditableCell"; // Para evitar problemas con React.memo


const handleDelete = async (id:number) => {
  if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;

  try {
    await deleteElemento(id);
    window.location.reload();
  } catch (error) {
    console.error("Error al eliminar el elemento:", error);
    alert("Hubo un error al eliminar el elemento");
  }
};

export const columns: ColumnDef<Elemento>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
   /*  cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const elemento = row.original;
  
      const handleSave = async (newValue: string) => {
        const updatedElemento = { ...elemento, nombre: newValue };
        try {
          await updateElemento(updatedElemento.id, updatedElemento);
          setIsEditing(false);
          window.location.reload();
        } catch (error) {
          console.error("Error al actualizar el elemento:", error);
          alert("Hubo un error al actualizar el elemento");
        }
      };
  
      return isEditing ? (
        <EditableCell value={elemento.nombre} onSave={handleSave} />
      ) : (
        <span onClick={() => setIsEditing(true)}>{elemento.nombre}</span>
      );
    }, */
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    header:"Tipo",
  },
  {
    id: "unidad",
    accessorKey: "unidad",
    header: "Unidad",
  },
  {
    id: "precio_unitario",
    accessorKey: "precio_unitario",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio Unitario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const elemento = row.original;
  
      const handleSave = async (newValue: number) => {
        const updatedElemento = { 
          ...elemento, 
          precio_unitario: newValue,
          fecha: new Date(), // Actualizar la fecha al momento de guardar
        };
  
        try {
          await updateElemento(updatedElemento.id, updatedElemento);
          setIsEditing(false);
          window.location.reload(); // Recargar la página para reflejar los cambios
        } catch (error) {
          console.error("Error al actualizar el elemento:", error);
          alert("Hubo un error al actualizar el elemento");
        }
      };
  
      return isEditing ? (
        <EditableCell value={elemento.precio_unitario} onSave={handleSave} />
      ) : (
        <span onClick={() => setIsEditing(true)}>{elemento.precio_unitario}</span>
      );
    },
  },
  {
    id: "fecha",
    accessorKey: "fecha",
    header: "Fecha",
   /*  cell: ({ row }) => {
      const fecha = row.original.fecha;
      return <span>{fecha.toDateString}</span>; // Formatear la fecha
    }, */
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const [isEditing, setIsEditing] = useState(false);
      const elemento = row.original;
  
      const handleSave = async (updatedElemento: Elemento) => {
        try {
          await updateElemento(updatedElemento.id, updatedElemento);
          setIsEditing(false);
          window.location.reload();
        } catch (error) {
          console.error("Error al actualizar el elemento:", error);
          alert("Hubo un error al actualizar el elemento");
        }
      };
  
      return (
        <div className="flex gap-2">
         
  
          {/* Botón Editar */}
          {isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSave(elemento)}
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
            onClick={() => handleDelete(elemento.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }
];