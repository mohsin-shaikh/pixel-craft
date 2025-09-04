'use client';

import { useSearchCommand } from '@/components/search-command-context';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Cmd() {
  const { openCommand } = useSearchCommand();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Command Search</h1>
        <p className="text-muted-foreground text-lg">
          Search for companies and people using the command palette
        </p>
      </div>

      <div className="space-y-6">
        {/* Dialog Version */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dialog Version</h2>
          <p className="text-muted-foreground">
            Click the button or press <kbd className="inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd> to open the search dialog
          </p>
          <Button 
            onClick={openCommand}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Open Search Dialog
            <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

      </div>
    </div>
  );
}