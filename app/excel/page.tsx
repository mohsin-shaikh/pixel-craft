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

export default function Excel() {
  const [selectedCell, setSelectedCell] = useState('A1');
  const [cellData, setCellData] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState('');

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
        <div className="flex space-x-6 text-sm">
          <Button variant="ghost" size="sm">File</Button>
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">Insert</Button>
          <Button variant="ghost" size="sm">Format</Button>
          <Button variant="ghost" size="sm">Data</Button>
          <Button variant="ghost" size="sm">Help</Button>
        </div>
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
          <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded px-2 py-1">
            <span className="text-sm">12</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          
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
