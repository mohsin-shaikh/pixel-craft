import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface CellStyle {
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export interface SelectionState {
  type: 'cell' | 'row' | 'column' | 'sheet';
  startCell: string;
  endCell?: string;
  selectedCells: Set<string>;
}

export interface ClipboardState {
  type: 'cut' | 'copy';
  data: Record<string, string>;
  range: string;
}

export interface ExcelState {
  // Core data
  cellData: Record<string, string>;
  cellStyles: Record<string, CellStyle>;
  
  // Selection & UI
  selection: SelectionState;
  selectedCell: string;
  isEditing: boolean;
  currentValue: string;
  
  // Formatting
  textFormatting: TextFormatting;
  fontSize: string;
  
  // Operations
  clipboard: ClipboardState | null;
  
  // Grid configuration
  columns: string[];
  rows: number[];
  
  // UI feedback
  lastAddedColumn: string | null;
  lastAddedRow: number | null;
  
  // Actions
  setCellValue: (cellId: string, value: string) => void;
  setCellStyle: (cellId: string, style: Partial<CellStyle>) => void;
  selectCell: (cellId: string) => void;
  selectRange: (startCell: string, endCell: string) => void;
  selectRow: (rowNumber: number) => void;
  selectColumn: (colLetter: string) => void;
  selectSheet: () => void;
  setEditing: (editing: boolean) => void;
  setCurrentValue: (value: string) => void;
  setTextFormatting: (formatting: Partial<TextFormatting>) => void;
  setFontSize: (size: string) => void;
  applyFormattingToSelection: () => void;
  copySelection: () => void;
  cutSelection: () => void;
  pasteSelection: (targetCell?: string) => void;
  deleteSelection: () => void;
  moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => void;
  clearClipboard: () => void;
  getAdjacentCell: (cellId: string, colOffset: number, rowOffset: number) => string | null;
  getCellId: (col: string, row: number) => string;
  addNewColumn: () => void;
  addNewRow: () => void;
  clearLastAdded: () => void;
}

// Helper functions
const getCellId = (col: string, row: number) => `${col}${row}`;

const getAdjacentCell = (cellId: string, colOffset: number, rowOffset: number, columns: string[], rows: number[]): string | null => {
  const col = cellId.match(/[A-Z]+/)?.[0] || 'A';
  const row = parseInt(cellId.match(/\d+/)?.[0] || '1');
  
  const colIndex = columns.indexOf(col);
  const newColIndex = colIndex + colOffset;
  const newRow = row + rowOffset;
  
  if (newColIndex < 0 || newColIndex >= columns.length || newRow < 1 || newRow > rows.length) {
    return null;
  }
  
  return getCellId(columns[newColIndex], newRow);
};

// Helper function to generate column letters beyond Z (AA, AB, etc.)
const generateColumnLetter = (index: number): string => {
  let result = '';
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

// Initial state
const initialCellData: Record<string, string> = {
  'A1': 'Sales Report Q2',
  'A2': 'Product',
  'B2': 'Q1 Sales',
  'C2': 'Q2 Sales',
  'D2': 'Growth %',
  'A3': 'Widget A',
  'B3': '1250',
  'C3': '1450',
  'D3': '16%',
  'A4': 'Widget B',
  'B4': '890',
  'C4': '1020',
  'D4': '14.6%',
  'A5': 'Widget C',
  'B5': '2100',
  'C5': '1950',
  'D5': '-7.1%',
};

const initialCellStyles: Record<string, CellStyle> = {
  'A1': { fontSize: '16', bold: true, italic: false, underline: false, strikethrough: false },
  'A2': { fontSize: '12', bold: true, italic: false, underline: false, strikethrough: false },
  'B2': { fontSize: '12', bold: true, italic: false, underline: false, strikethrough: false },
  'C2': { fontSize: '12', bold: true, italic: false, underline: false, strikethrough: false },
  'D2': { fontSize: '12', bold: true, italic: false, underline: false, strikethrough: false },
};

const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const rows = Array.from({ length: 50 }, (_, i) => i + 1);

export const useExcelStore = create<ExcelState>()(
  devtools(
    (set, get) => ({
      // Initial state
      cellData: initialCellData,
      cellStyles: initialCellStyles,
      selection: {
        type: 'cell',
        startCell: 'A1',
        selectedCells: new Set(['A1'])
      },
      selectedCell: 'A1',
      isEditing: false,
      currentValue: '',
      textFormatting: {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
      },
      fontSize: '12',
      clipboard: null,
      columns,
      rows,
      lastAddedColumn: null,
      lastAddedRow: null,

      // Actions
      setCellValue: (cellId: string, value: string) => {
        set((state) => ({
          cellData: {
            ...state.cellData,
            [cellId]: value
          }
        }));
      },

      setCellStyle: (cellId: string, style: Partial<CellStyle>) => {
        set((state) => ({
          cellStyles: {
            ...state.cellStyles,
            [cellId]: {
              ...state.cellStyles[cellId],
              ...style
            }
          }
        }));
      },

      selectCell: (cellId: string) => {
        const state = get();
        const cellStyle = state.cellStyles[cellId] || { 
          fontSize: '12', 
          bold: false, 
          italic: false, 
          underline: false, 
          strikethrough: false 
        };

        set({
          selection: {
            type: 'cell',
            startCell: cellId,
            selectedCells: new Set([cellId])
          },
          selectedCell: cellId,
          currentValue: state.cellData[cellId] || '',
          fontSize: cellStyle.fontSize,
          textFormatting: {
            bold: cellStyle.bold,
            italic: cellStyle.italic,
            underline: cellStyle.underline,
            strikethrough: cellStyle.strikethrough,
          }
        });
      },

      selectRange: (startCell: string, endCell: string) => {
        const state = get();
        const selectedCells = new Set<string>();
        
        // Parse cell coordinates
        const startCol = startCell.match(/[A-Z]+/)?.[0] || 'A';
        const startRow = parseInt(startCell.match(/\d+/)?.[0] || '1');
        const endCol = endCell.match(/[A-Z]+/)?.[0] || 'A';
        const endRow = parseInt(endCell.match(/\d+/)?.[0] || '1');
        
        const startColIndex = state.columns.indexOf(startCol);
        const endColIndex = state.columns.indexOf(endCol);
        const minColIndex = Math.min(startColIndex, endColIndex);
        const maxColIndex = Math.max(startColIndex, endColIndex);
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        
        // Add all cells in range
        for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
          for (let row = minRow; row <= maxRow; row++) {
            const cellId = getCellId(state.columns[colIndex], row);
            selectedCells.add(cellId);
          }
        }
        
        set({
          selection: {
            type: 'cell',
            startCell,
            endCell,
            selectedCells
          },
          selectedCell: startCell
        });
      },

      selectRow: (rowNumber: number) => {
        const state = get();
        const selectedCells = new Set<string>();
        state.columns.forEach(col => {
          selectedCells.add(getCellId(col, rowNumber));
        });
        
        set({
          selection: {
            type: 'row',
            startCell: getCellId('A', rowNumber),
            endCell: getCellId(state.columns[state.columns.length - 1], rowNumber),
            selectedCells
          }
        });
      },

      selectColumn: (colLetter: string) => {
        const state = get();
        const selectedCells = new Set<string>();
        state.rows.forEach(row => {
          selectedCells.add(getCellId(colLetter, row));
        });
        
        set({
          selection: {
            type: 'column',
            startCell: getCellId(colLetter, 1),
            endCell: getCellId(colLetter, state.rows.length),
            selectedCells
          }
        });
      },

      selectSheet: () => {
        const state = get();
        const selectedCells = new Set<string>();
        state.columns.forEach(col => {
          state.rows.forEach(row => {
            selectedCells.add(getCellId(col, row));
          });
        });
        
        set({
          selection: {
            type: 'sheet',
            startCell: 'A1',
            endCell: getCellId(state.columns[state.columns.length - 1], state.rows.length),
            selectedCells
          }
        });
      },

      setEditing: (editing: boolean) => {
        set({ isEditing: editing });
      },

      setCurrentValue: (value: string) => {
        set({ currentValue: value });
      },

      setTextFormatting: (formatting: Partial<TextFormatting>) => {
        set((state) => ({
          textFormatting: {
            ...state.textFormatting,
            ...formatting
          }
        }));
      },

      setFontSize: (size: string) => {
        set({ fontSize: size });
      },

      applyFormattingToSelection: () => {
        const state = get();
        const newStyles = { ...state.cellStyles };
        
        state.selection.selectedCells.forEach(cellId => {
          newStyles[cellId] = {
            fontSize: state.fontSize,
            bold: state.textFormatting.bold,
            italic: state.textFormatting.italic,
            underline: state.textFormatting.underline,
            strikethrough: state.textFormatting.strikethrough,
          };
        });
        
        set({ cellStyles: newStyles });
      },

      copySelection: () => {
        const state = get();
        const selectedData: Record<string, string> = {};
        state.selection.selectedCells.forEach(cellId => {
          selectedData[cellId] = state.cellData[cellId] || '';
        });
        
        const range = state.selection.type === 'cell' 
          ? state.selectedCell 
          : `${state.selection.startCell}:${state.selection.endCell || state.selection.startCell}`;
        
        set({
          clipboard: { 
            type: 'copy', 
            data: selectedData, 
            range 
          }
        });
        
        // Also copy to system clipboard
        const clipboardText = Array.from(state.selection.selectedCells)
          .map(cellId => state.cellData[cellId] || '')
          .join('\t');
        navigator.clipboard.writeText(clipboardText).catch(() => {
          console.log('Clipboard API not available');
        });
      },

      cutSelection: () => {
        const state = get();
        const selectedData: Record<string, string> = {};
        state.selection.selectedCells.forEach(cellId => {
          selectedData[cellId] = state.cellData[cellId] || '';
        });
        
        const range = state.selection.type === 'cell' 
          ? state.selectedCell 
          : `${state.selection.startCell}:${state.selection.endCell || state.selection.startCell}`;
        
        // Clear the selected cells
        const newCellData = { ...state.cellData };
        state.selection.selectedCells.forEach(cellId => {
          delete newCellData[cellId];
        });
        
        set({
          cellData: newCellData,
          currentValue: '',
          clipboard: { 
            type: 'cut', 
            data: selectedData, 
            range 
          }
        });
        
        // Also copy to system clipboard
        const clipboardText = Array.from(state.selection.selectedCells)
          .map(cellId => state.cellData[cellId] || '')
          .join('\t');
        navigator.clipboard.writeText(clipboardText).catch(() => {
          console.log('Clipboard API not available');
        });
      },

      pasteSelection: (targetCell?: string) => {
        const state = get();
        const pasteTarget = targetCell || state.selectedCell;
        
        if (state.clipboard) {
          // Paste from internal clipboard
          const newCellData = { ...state.cellData };
          Object.entries(state.clipboard.data).forEach(([cellId, value]) => {
            newCellData[cellId] = value;
          });
          
          set({ cellData: newCellData });
          
          // If it was a cut operation, clear the clipboard
          if (state.clipboard.type === 'cut') {
            set({ clipboard: null });
          }
        } else {
          // Try to paste from system clipboard
          navigator.clipboard.readText().then(text => {
            const lines = text.split('\n');
            const cells = lines[0].split('\t');
            
            const newCellData = { ...state.cellData };
            cells.forEach((cellValue, index) => {
              const targetCellId = state.getAdjacentCell(pasteTarget, index, 0);
              if (targetCellId) {
                newCellData[targetCellId] = cellValue;
              }
            });
            
            set({ cellData: newCellData });
          }).catch(() => {
            console.log('Clipboard API not available');
          });
        }
      },

      deleteSelection: () => {
        const state = get();
        const newCellData = { ...state.cellData };
        state.selection.selectedCells.forEach(cellId => {
          delete newCellData[cellId];
        });
        
        set({ 
          cellData: newCellData,
          currentValue: ''
        });
      },

      moveSelection: (direction: 'up' | 'down' | 'left' | 'right') => {
        const state = get();
        const currentCol = state.selectedCell.match(/[A-Z]+/)?.[0] || 'A';
        const currentRow = parseInt(state.selectedCell.match(/\d+/)?.[0] || '1');
        
        let newCol = currentCol;
        let newRow = currentRow;
        let shouldAddColumn = false;
        let shouldAddRow = false;
        
        switch (direction) {
          case 'up':
            newRow = Math.max(1, currentRow - 1);
            break;
          case 'down':
            if (currentRow >= state.rows.length) {
              // We're at the last row, add a new one
              shouldAddRow = true;
              newRow = currentRow + 1;
            } else {
              newRow = currentRow + 1;
            }
            break;
          case 'left':
            const colIndex = state.columns.indexOf(currentCol);
            if (colIndex > 0) {
              newCol = state.columns[colIndex - 1];
            }
            break;
          case 'right':
            const colIndexRight = state.columns.indexOf(currentCol);
            if (colIndexRight >= state.columns.length - 1) {
              // We're at the last column, add a new one
              shouldAddColumn = true;
              newCol = generateColumnLetter(state.columns.length);
            } else {
              newCol = state.columns[colIndexRight + 1];
            }
            break;
        }
        
        // Add new column/row if needed
        if (shouldAddColumn) {
          get().addNewColumn();
        }
        if (shouldAddRow) {
          get().addNewRow();
        }
        
        const newCellId = getCellId(newCol, newRow);
        get().selectCell(newCellId);
      },

      clearClipboard: () => {
        set({ clipboard: null });
      },

      getAdjacentCell: (cellId: string, colOffset: number, rowOffset: number) => {
        const state = get();
        return getAdjacentCell(cellId, colOffset, rowOffset, state.columns, state.rows);
      },

      getCellId,

      addNewColumn: () => {
        const state = get();
        const newColumns = [...state.columns];
        const newColumn = generateColumnLetter(newColumns.length);
        newColumns.push(newColumn);
        console.log(`Added new column: ${newColumn}`);
        set({ 
          columns: newColumns,
          lastAddedColumn: newColumn
        });
        
        // Clear the highlight after 2 seconds
        setTimeout(() => {
          get().clearLastAdded();
        }, 2000);
      },

      addNewRow: () => {
        const state = get();
        const newRows = [...state.rows];
        const newRow = newRows.length + 1;
        newRows.push(newRow);
        console.log(`Added new row: ${newRow}`);
        set({ 
          rows: newRows,
          lastAddedRow: newRow
        });
        
        // Clear the highlight after 2 seconds
        setTimeout(() => {
          get().clearLastAdded();
        }, 2000);
      },

      clearLastAdded: () => {
        set({
          lastAddedColumn: null,
          lastAddedRow: null
        });
      },
    }),
    {
      name: 'excel-store',
    }
  )
);
