"use client"

import { Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "./data-table-view-options"


//import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}
React.useEffect(() => {
  if (searchTerm) {
    table.setGlobalFilter(searchTerm);
  } else {
    table.resetGlobalFilter();
  }
}, [searchTerm, table]);

const exportToExcel = () => {
  // Convert the data to a format suitable for Excel
  const exportData = table.getRowModel().rows.map((row) => {
    const rowData: any = {};
    row.getVisibleCells().forEach((cell) => {
      const column = cell.column.columnDef;
      rowData[column.header as string] = cell.getValue();
    });
    return rowData;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "listado");

  // Save file
  XLSX.writeFile(workbook, "tabla.xlsx");
};

return (
  <div className="space-y-4">
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="max-w-sm"
      />

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-1" />
          Exportar Excel
        </Button>
        <Button variant="outline" size="sm" onClick={toggleSimplifiedView}>
          {simplifiedView ? (
            <EyeOff className="w-4 h-4 mr-1" />
          ) : (
            <Eye className="w-4 h-4 mr-1" />
          )}
          {simplifiedView ? "Vista completa" : "Vista simplificada"}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-rigth justify-between">
      <div className="flex flex-1 items-center space-x-2">
        
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}