# Excel App State Management with Zustand

## Overview

The Excel app has been refactored to use **Zustand** for state management, replacing the previous `useState` approach. This provides better performance, maintainability, and developer experience.

## Architecture

### Core Store (`lib/excel-store.ts`)

The main Zustand store contains all the Excel app state and actions:

```typescript
interface ExcelState {
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
  
  // Actions
  setCellValue: (cellId: string, value: string) => void;
  selectCell: (cellId: string) => void;
  // ... more actions
}
```

### Optimized Hooks (`lib/excel-hooks.ts`)

Custom hooks that select only specific parts of the store to prevent unnecessary re-renders:

- `useCellData(cellId)` - Cell value and styling
- `useSelection()` - Selection state
- `useFormatting()` - Text formatting controls
- `useClipboard()` - Copy/paste operations
- `useNavigation()` - Cell navigation
- `useEditing()` - Editing state
- `useGridConfig()` - Grid configuration

### Cell Component (`components/excel-cell.tsx`)

A separate component that demonstrates how to use the optimized hooks for better performance.

## Key Benefits

### 1. **Performance**
- Only components that use specific state will re-render
- Shallow comparison prevents unnecessary updates
- Optimized cell rendering with individual subscriptions

### 2. **Developer Experience**
- Redux DevTools integration for debugging
- TypeScript-first with full type safety
- No provider wrapping required
- Simple, intuitive API

### 3. **Maintainability**
- Centralized state logic
- Clear separation of concerns
- Easy to test individual actions
- Predictable state updates

### 4. **Scalability**
- Easy to add new features (undo/redo, persistence, etc.)
- Middleware support for complex operations
- Can handle large datasets efficiently

## Usage Examples

### Basic Store Usage

```typescript
import { useExcelStore } from '@/lib/excel-store';

function MyComponent() {
  const { cellData, selectedCell, selectCell } = useExcelStore();
  
  return (
    <div onClick={() => selectCell('A1')}>
      Selected: {selectedCell}
      Value: {cellData[selectedCell]}
    </div>
  );
}
```

### Optimized Hook Usage

```typescript
import { useCellData, useSelection } from '@/lib/excel-hooks';

function Cell({ cellId }: { cellId: string }) {
  const { value, style } = useCellData(cellId);
  const { selectedCell, isEditing } = useSelection();
  
  // This component only re-renders when this specific cell's data changes
  // or when selection/editing state changes
}
```

### Adding New Actions

```typescript
// In excel-store.ts
export const useExcelStore = create<ExcelState>()(
  devtools(
    (set, get) => ({
      // ... existing state and actions
      
      // New action
      addRow: (afterRow: number) => {
        const state = get();
        // Implementation
        set({ /* new state */ });
      },
    })
  )
);
```

## Migration from useState

The migration involved:

1. **Extracting state logic** from the component into the store
2. **Creating actions** for all state mutations
3. **Replacing useState calls** with store selectors
4. **Adding performance optimizations** with custom hooks
5. **Maintaining the same API** for seamless transition

## Future Enhancements

### Planned Features

1. **Undo/Redo System**
   ```typescript
   import { subscribeWithSelector } from 'zustand/middleware';
   
   // Add to store
   history: HistoryState[];
   undo: () => void;
   redo: () => void;
   ```

2. **Persistence**
   ```typescript
   import { persist } from 'zustand/middleware';
   
   // Add to store creation
   persist(
     (set, get) => ({ /* store */ }),
     { name: 'excel-storage' }
   )
   ```

3. **Multiple Sheets**
   ```typescript
   interface ExcelState {
     sheets: Record<string, SheetState>;
     activeSheet: string;
     // ... existing state
   }
   ```

4. **Formula Support**
   ```typescript
   interface CellData {
     value: string;
     formula?: string;
     computedValue: string;
   }
   ```

## Best Practices

### 1. Use Optimized Hooks
Always use the custom hooks from `excel-hooks.ts` instead of directly accessing the store:

```typescript
// ✅ Good
const { value, style } = useCellData(cellId);

// ❌ Avoid
const { cellData, cellStyles } = useExcelStore();
```

### 2. Keep Actions Pure
Actions should be pure functions that only depend on the current state:

```typescript
// ✅ Good
setCellValue: (cellId: string, value: string) => {
  set((state) => ({
    cellData: { ...state.cellData, [cellId]: value }
  }));
};

// ❌ Avoid
setCellValue: (cellId: string, value: string) => {
  // Don't access external state or make API calls here
};
```

### 3. Use Shallow Comparison
Always use `shallow` comparison for object selections:

```typescript
// ✅ Good
useExcelStore(
  (state) => ({ selectedCell: state.selectedCell }),
  shallow
);

// ❌ Avoid
useExcelStore((state) => ({ selectedCell: state.selectedCell }));
```

### 4. Test Actions
Test individual actions in isolation:

```typescript
import { useExcelStore } from './excel-store';

test('setCellValue updates cell data', () => {
  const store = useExcelStore.getState();
  store.setCellValue('A1', 'test');
  expect(store.cellData['A1']).toBe('test');
});
```

## Troubleshooting

### Common Issues

1. **Component not re-rendering**
   - Check if you're using the correct selector
   - Ensure you're using `shallow` comparison for objects

2. **Performance issues**
   - Use the optimized hooks instead of full store access
   - Break down large components into smaller ones

3. **TypeScript errors**
   - Ensure all actions are properly typed
   - Check that selectors return the expected types

### Debugging

Use Redux DevTools to inspect state changes:

1. Install Redux DevTools browser extension
2. Open DevTools and go to Redux tab
3. Look for "excel-store" in the store list
4. Monitor state changes and action dispatches

## Conclusion

The Zustand implementation provides a solid foundation for the Excel app's state management needs. It offers excellent performance, developer experience, and scalability while maintaining a simple and intuitive API.
