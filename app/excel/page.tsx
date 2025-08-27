'use client';

import { useEffect } from 'react';
import { 
  Grid, 
  Edit, 
  Copy, 
  Scissors, 
  Type, 
  ChevronDown,
  Pencil,
  Clipboard,
  Trash2,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExcelStore } from '@/lib/excel-store';

export default function Excel() {
  const {
    // State
    cellData,
    cellStyles,
    selection,
    selectedCell,
    isEditing,
    currentValue,
    textFormatting,
    fontSize,
    clipboard,
    columns,
    rows,
    
    // Actions
    setCellValue,
    selectCell,
    selectRow,
    selectColumn,
    selectSheet,
    setEditing,
    setCurrentValue,
    setTextFormatting,
    setFontSize,
    applyFormattingToSelection,
    copySelection,
    cutSelection,
    pasteSelection,
    deleteSelection,
    moveSelection,
    getCellId,
  } = useExcelStore();

  // Ensure container is focused for keyboard navigation
  useEffect(() => {
    const container = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (container) {
      container.focus();
    }
  }, []);

  const handleCellClick = (cellId: string) => {
    selectCell(cellId);
    setEditing(false);
    // Refocus the container for keyboard navigation
    const container = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (container) {
      container.focus();
    }
  };

  const handleCellDoubleClick = (cellId: string) => {
    selectCell(cellId);
    setEditing(true);
  };

  const handleCellChange = (value: string) => {
    setCurrentValue(value);
    setCellValue(selectedCell, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Meta:', e.metaKey);
    
    // Handle clipboard shortcuts first
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          copySelection();
          return;
        case 'x':
          e.preventDefault();
          cutSelection();
          return;
        case 'v':
          e.preventDefault();
          pasteSelection();
          return;
        case 'a':
          e.preventDefault();
          selectSheet();
          return;
      }
    }

    // Handle delete key
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteSelection();
      return;
    }

    // If we're editing a cell, don't handle navigation keys
    if (isEditing) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setEditing(false);
        moveSelection('down');
        // Automatically start editing the new cell
        setTimeout(() => {
          setEditing(true);
          setCurrentValue('');
        }, 0);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setEditing(false);
        setCurrentValue(cellData[selectedCell] || '');
        return;
      }
      return;
    }

    // Handle direct typing for alphanumeric keys
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setEditing(true);
      setCurrentValue('');
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveSelection('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveSelection('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveSelection('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveSelection('right');
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          moveSelection('left');
        } else {
          moveSelection('right');
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (e.shiftKey) {
          moveSelection('up');
        } else {
          moveSelection('down');
        }
        // Automatically start editing the new cell
        setTimeout(() => {
          setEditing(true);
          setCurrentValue('');
        }, 0);
        break;
      case 'F2':
        e.preventDefault();
        setEditing(true);
        break;
    }
  };

  return (
    <div 
      className="h-screen bg-gray-50 flex flex-col" 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
      onFocus={() => console.log('Container focused')}
      onBlur={() => console.log('Container blurred')}
      onClick={() => {
        const container = document.querySelector('[tabindex="0"]') as HTMLElement;
        if (container) {
          container.focus();
        }
      }}
      autoFocus
    >
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-lg flex items-center space-x-2">
            <Grid className="w-4 h-4" />
            <span className="font-medium">Sales Report Q2</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Edit className="w-4 h-4" />
            <span>last edited 2m ago</span>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1">
        <Menubar className="border-none bg-transparent p-0 h-auto">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Open <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Exit</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Insert</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Row</MenubarItem>
              <MenubarItem>Column</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Chart</MenubarItem>
              <MenubarItem>Image</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Format</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Cells</MenubarItem>
              <MenubarItem>Row</MenubarItem>
              <MenubarItem>Column</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Conditional Formatting</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Data</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Sort</MenubarItem>
              <MenubarItem>Filter</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Validation</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Documentation</MenubarItem>
              <MenubarItem>About</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <Button variant="ghost" size="icon">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Clipboard Operations */}
          <Button variant="ghost" size="icon" onClick={copySelection} title="Copy (Ctrl+C)">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={cutSelection} title="Cut (Ctrl+X)">
            <Scissors className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => pasteSelection()} title="Paste (Ctrl+V)">
            <Clipboard className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Delete */}
          <Button variant="ghost" size="icon" onClick={deleteSelection} title="Delete (Del)">
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Font Size */}
          <Select value={fontSize} onValueChange={(value) => {
            setFontSize(value);
            applyFormattingToSelection();
          }}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="11">11</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="28">28</SelectItem>
              <SelectItem value="32">32</SelectItem>
              <SelectItem value="36">36</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Text Formatting */}
          <Toggle
            size="sm"
            pressed={textFormatting.bold}
            onPressedChange={(pressed) => {
              setTextFormatting({ bold: pressed });
              applyFormattingToSelection();
            }}
            className="font-bold w-8 h-8"
          >
            B
          </Toggle>
          <Toggle
            size="sm"
            pressed={textFormatting.italic}
            onPressedChange={(pressed) => {
              setTextFormatting({ italic: pressed });
              applyFormattingToSelection();
            }}
            className="italic w-8 h-8"
          >
            I
          </Toggle>
          <Toggle
            size="sm"
            pressed={textFormatting.underline}
            onPressedChange={(pressed) => {
              setTextFormatting({ underline: pressed });
              applyFormattingToSelection();
            }}
            className="underline w-8 h-8"
          >
            U
          </Toggle>
          <Toggle
            size="sm"
            pressed={textFormatting.strikethrough}
            onPressedChange={(pressed) => {
              setTextFormatting({ strikethrough: pressed });
              applyFormattingToSelection();
            }}
            className="line-through w-8 h-8"
          >
            S
          </Toggle>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Other Formatting */}
          <Button variant="ghost" size="icon">
            <Type className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-2">
        <div className="bg-gray-100 px-2 py-1 rounded text-sm font-mono min-w-[60px] text-center">
          {selectedCell}
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded text-sm font-mono flex items-center space-x-1 flex-1">
          <span className="text-gray-500">fx</span>
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleCellChange(e.target.value)}
            className="bg-transparent outline-none flex-1"
            placeholder="Enter a value"
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
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
                onClick={() => selectColumn(col)}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.slice(0, 20).map((row) => (
            <div key={row} className="flex">
              {/* Row Header */}
              <div 
                className="w-12 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-gray-300"
                onClick={() => selectRow(row)}
              >
                {row}
              </div>
              
              {/* Cells */}
              {columns.slice(0, 10).map((col) => {
                const cellId = getCellId(col, row);
                const isSelected = selectedCell === cellId;
                const cellStyle = cellStyles[cellId] || { fontSize: '12', bold: false, italic: false, underline: false, strikethrough: false };
                
                return (
                  <div
                    key={cellId}
                    className={`w-20 h-8 border border-gray-300 flex items-center px-1 text-sm cursor-pointer ${
                      selection.selectedCells.has(cellId) 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleCellClick(cellId)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
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
                          fontSize: `${cellStyle.fontSize}px`,
                          fontWeight: cellStyle.bold ? 'bold' : 'normal',
                          fontStyle: cellStyle.italic ? 'italic' : 'normal',
                          textDecoration: cellStyle.underline 
                            ? (cellStyle.strikethrough ? 'underline line-through' : 'underline')
                            : (cellStyle.strikethrough ? 'line-through' : 'none')
                        }}
                      >
                        {cellData[cellId] || ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
