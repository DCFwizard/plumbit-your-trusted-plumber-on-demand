import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
// A type helper to get nested property value
type GetValue<T, K> = K extends `${infer P}.${infer R}`
  ? P extends keyof T
    ? GetValue<T[P], R>
    : never
  : K extends keyof T
  ? T[K]
  : never;
export interface DataTableColumn<T> {
  accessorKey: string; // Can be nested like 'profile.name'
  header: string;
  cell: (value: GetValue<T, this['accessorKey']>, row: T) => React.ReactNode;
}
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  loadingRows?: number;
}
// Helper to get a nested value from an object based on a string path
function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((o, k) => (o && o[k] !== 'undefined' ? o[k] : undefined), obj as any);
}
export function DataTable<T>({ columns, data, isLoading, loadingRows = 5 }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(loadingRows)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {column.cell(getNestedValue(row, column.accessorKey), row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}