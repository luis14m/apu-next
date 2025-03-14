"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, PlusCircle } from "lucide-react";
import * as XLSX from "xlsx";

import React from "react";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAddClick?: () => void; // Prop opcional para manejar el clic en "Agregar"
}

export function DataTableToolbar<TData>({
  table,
  
}: DataTableToolbarProps<TData>) {


  

  const exportToExcel = () => {
    const exportData = table.getRowModel().rows.map((row) => {
      const rowData: any = {};
      row.getVisibleCells().forEach((cell) => {
        const column = cell.column.columnDef;
        rowData[column.header as string] = cell.getValue();
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "listado");
    XLSX.writeFile(workbook, "tabla.xlsx");
  };

  return (
    <div className="flex items-center justify-between py-4">

         {/* Botones a la derecha */}
         <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-1" />
          Exportar Excel
        </Button>
    
      </div>
    </div>
  );
}
