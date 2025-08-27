'use client';

import { useCellData } from '@/lib/excel-hooks';
import { useSelection } from '@/lib/excel-hooks';
import { useEditing } from '@/lib/excel-hooks';
import { useNavigation } from '@/lib/excel-hooks';

interface CellProps {
  cellId: string;
}

export function Cell({ cellId }: CellProps) {
  const { value, style } = useCellData(cellId);
  const { selectedCell, selection, isEditing } = useSelection();
  const { currentValue, setCurrentValue, setEditing, setCellValue } = useEditing();
  const { selectCell } = useNavigation();

  const isSelected = selectedCell === cellId;
  const isInSelection = selection.selectedCells.has(cellId);

  const handleCellClick = () => {
    selectCell(cellId);
    setEditing(false);
    // Refocus the container for keyboard navigation
    const container = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (container) {
      container.focus();
    }
  };

  const handleCellDoubleClick = () => {
    selectCell(cellId);
    setEditing(true);
  };

  const handleCellChange = (newValue: string) => {
    setCurrentValue(newValue);
    setCellValue(cellId, newValue);
  };

  return (
    <div
      className={`w-20 h-8 border border-gray-300 flex items-center px-1 text-sm cursor-pointer ${
        isInSelection 
          ? 'bg-blue-100 border-blue-500' 
          : 'bg-white hover:bg-gray-50'
      }`}
      onClick={handleCellClick}
      onDoubleClick={handleCellDoubleClick}
    >
      {isSelected && isEditing ? (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleCellChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="w-full h-full bg-transparent outline-none text-sm"
          autoFocus
        />
      ) : (
        <span 
          className="truncate"
          style={{
            fontSize: `${style.fontSize}px`,
            fontWeight: style.bold ? 'bold' : 'normal',
            fontStyle: style.italic ? 'italic' : 'normal',
            textDecoration: style.underline 
              ? (style.strikethrough ? 'underline line-through' : 'underline')
              : (style.strikethrough ? 'line-through' : 'none')
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
