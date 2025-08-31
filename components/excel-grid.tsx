'use client';

import { Cell } from './excel-cell';
import { useGridConfig } from '@/lib/excel-hooks';

export function ExcelGrid() {
  const { columns, rows, getCellId } = useGridConfig();

  return (
    <div className="flex-1 overflow-auto">
      <div 
        className="inline-block"
        style={{
          display: 'grid',
          gridTemplateColumns: '48px repeat(10, 80px)',
          gridTemplateRows: '32px repeat(20, 32px)',
          position: 'relative'
        }}
      >
        {/* Corner cell - sticky top and left */}
        <div 
          className="bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 20,
            gridColumn: '1',
            gridRow: '1'
          }}
        >
          {/* Empty corner cell */}
        </div>

        {/* Column Headers - sticky top */}
        {columns.slice(0, 10).map((col, index) => (
          <div
            key={col}
            className="bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-300"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              gridColumn: `${index + 2}`,
              gridRow: '1'
            }}
          >
            {col}
          </div>
        ))}

        {/* Row Headers - sticky left */}
        {rows.slice(0, 20).map((row, rowIndex) => (
          <div
            key={`row-${row}`}
            className="bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-300"
            style={{
              position: 'sticky',
              left: 0,
              zIndex: 10,
              gridColumn: '1',
              gridRow: `${rowIndex + 2}`
            }}
          >
            {row}
          </div>
        ))}

        {/* Data Cells */}
        {rows.slice(0, 20).map((row, rowIndex) =>
          columns.slice(0, 10).map((col, colIndex) => {
            const cellId = getCellId(col, row);
            return (
              <div
                key={cellId}
                style={{
                  gridColumn: `${colIndex + 2}`,
                  gridRow: `${rowIndex + 2}`
                }}
              >
                <Cell cellId={cellId} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
