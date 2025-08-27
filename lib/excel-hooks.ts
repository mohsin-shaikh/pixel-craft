import { useExcelStore } from './excel-store';

// Hook for cell data and styles
export const useCellData = (cellId: string) => {
  return useExcelStore((state) => ({
    value: state.cellData[cellId] || '',
    style: state.cellStyles[cellId] || {
      fontSize: '12',
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    },
  }));
};

// Hook for selection state
export const useSelection = () => {
  return useExcelStore((state) => ({
    selectedCell: state.selectedCell,
    selection: state.selection,
    isEditing: state.isEditing,
  }));
};

// Hook for formatting controls
export const useFormatting = () => {
  return useExcelStore((state) => ({
    textFormatting: state.textFormatting,
    fontSize: state.fontSize,
    setTextFormatting: state.setTextFormatting,
    setFontSize: state.setFontSize,
    applyFormattingToSelection: state.applyFormattingToSelection,
  }));
};

// Hook for clipboard operations
export const useClipboard = () => {
  return useExcelStore((state) => ({
    clipboard: state.clipboard,
    copySelection: state.copySelection,
    cutSelection: state.cutSelection,
    pasteSelection: state.pasteSelection,
    deleteSelection: state.deleteSelection,
  }));
};

// Hook for navigation
export const useNavigation = () => {
  return useExcelStore((state) => ({
    selectCell: state.selectCell,
    selectRow: state.selectRow,
    selectColumn: state.selectColumn,
    selectSheet: state.selectSheet,
    moveSelection: state.moveSelection,
  }));
};

// Hook for editing
export const useEditing = () => {
  return useExcelStore((state) => ({
    currentValue: state.currentValue,
    isEditing: state.isEditing,
    setCurrentValue: state.setCurrentValue,
    setEditing: state.setEditing,
    setCellValue: state.setCellValue,
  }));
};

// Hook for grid configuration
export const useGridConfig = () => {
  return useExcelStore((state) => ({
    columns: state.columns,
    rows: state.rows,
    getCellId: state.getCellId,
  }));
};
