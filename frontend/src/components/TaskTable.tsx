import React, { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Edit, Trash2 } from "lucide-react";

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  status: string;
  totalPoints: number;
  dailyPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  sorting: any;
  setSorting: (sorting: any) => void;
  getProjectTitle: (projectId: string) => string;
  getStatusInfo: (status: string) => {
    color: string;
    bgColor: string;
    icon: React.FC<any>;
    animation?: string;
  };
  handleEditTask: (taskId: string) => void;
  handleViewTask: (taskId: string) => void;
  tableError?: string;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  sorting,
  setSorting,
  getProjectTitle,
  getStatusInfo,
  handleEditTask,
  handleViewTask,
  tableError,
}) => {
  const columnHelper = createColumnHelper<Task>();

  const columns = useMemo(() => [
    columnHelper.accessor("title", {
      header: () => <div className="flex items-center">Task</div>,
      cell: (info) => (
        <div>
          <div className="text-base font-medium text-gray-900">{info.getValue()}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{info.row.original.description}</div>
        </div>
      ),
    }),
    columnHelper.accessor("project", {
      header: "Project",
      cell: (info) => getProjectTitle(info.getValue()),
    }),
    columnHelper.accessor("status", {
      header: () => <div className="flex items-center">Status</div>,
      cell: (info) => {
        const status = info.getValue();
        const statusInfo = getStatusInfo(status);
        const StatusIcon = statusInfo.icon;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusInfo.bgColor}`}>
            <StatusIcon className={`w-4 h-4 mr-1 ${statusInfo.animation || ""}`} />
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("totalPoints", {
      header: () => <div className="flex items-center">Points</div>,
      cell: (info) => (
        <div className="flex items-center">
          <span className="text-base text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("updatedAt", {
      header: () => <div className="flex items-center">Updated</div>,
      cell: (info) => new Date(info.getValue()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <div className="flex justify-end space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTask(info.row.original._id);
            }}
            className="text-stone-600 hover:text-stone-900"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Pass the task _id to the parent handler for deletion confirmation
              handleViewTask(info.row.original._id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ], [columnHelper, getProjectTitle, getStatusInfo, handleEditTask, handleViewTask]);

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (tableError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{tableError}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          header.column.getIsSorted() === "desc"
                            ? "transform rotate-180"
                            : header.column.getIsSorted() === "asc"
                            ? ""
                            : "opacity-0"
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
              onClick={() => handleViewTask(row.original._id)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
