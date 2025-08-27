'use client';

import { Cell } from './excel-cell';
import { useGridConfig } from '@/lib/excel-hooks';

export function ExcelGrid() {
  const { columns, rows, getCellId } = useGridConfig();

  return (
    <div className="flex-1 overflow-auto">
      <div className="inline-block">
        {/* Column Headers */}
        <div className="flex">
          <div className="w-12 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium">
            {/* Empty corner cell */}
          </div>
          {columns.slice(0, 10).map((col) => (
            <div
              key={col}
              className="w-20 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-300"
            >
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.slice(0, 20).map((row) => (
          <div key={row} className="flex">
            {/* Row Header */}
            <div className="w-12 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-300">
              {row}
            </div>
            
            {/* Cells */}
            {columns.slice(0, 10).map((col) => {
              const cellId = getCellId(col, row);
              return <Cell key={cellId} cellId={cellId} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
