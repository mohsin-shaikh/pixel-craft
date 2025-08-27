'use client';

import { useState } from 'react';
import { 
  Grid, 
  Edit, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Scissors, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  ChevronDown,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function Excel() {
  const [selectedCell, setSelectedCell] = useState('A1');
  const [cellData, setCellData] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState('');
  const [fontSize, setFontSize] = useState('12');

  const columns = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setCurrentValue(cellData[cellId] || '');
  };

  const handleCellChange = (value: string) => {
    setCurrentValue(value);
    setCellData(prev => ({
      ...prev,
      [selectedCell]: value
    }));
  };

  const getCellId = (col: string, row: number) => `${col}${row}`;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
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
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Clipboard Operations */}
          <Button variant="ghost" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Scissors className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Font Size */}
          <Select value={fontSize} onValueChange={setFontSize}>
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
          <Button variant="ghost" size="icon" className="font-bold">B</Button>
          <Button variant="ghost" size="icon" className="italic">I</Button>
          <Button variant="ghost" size="icon" className="underline">U</Button>
          <Button variant="ghost" size="icon" className="line-through">S</Button>
          
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
                className="w-20 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.slice(0, 20).map((row) => (
            <div key={row} className="flex">
              {/* Row Header */}
              <div className="w-12 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium">
                {row}
              </div>
              
              {/* Cells */}
              {columns.slice(0, 10).map((col) => {
                const cellId = getCellId(col, row);
                const isSelected = selectedCell === cellId;
                
                return (
                  <div
                    key={cellId}
                    className={`w-20 h-8 border border-gray-300 flex items-center px-1 text-sm cursor-pointer ${
                      isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleCellClick(cellId)}
                  >
                    <span className="truncate">{cellData[cellId] || ''}</span>
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
