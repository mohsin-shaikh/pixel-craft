'use client';

import Link from "next/link";
import { useSearchCommand } from "@/components/search-command-context";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  const { openCommand } = useSearchCommand();

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Pixel Craft</h1>
        <p className="text-muted-foreground text-lg">
          Welcome to Pixel Craft! Try the global search command.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Button 
          onClick={openCommand}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Open Global Search
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <div className="flex gap-4">
          <Link href="/excel">
            <Button variant="outline">Go to Excel</Button>
          </Link>
          <Link href="/cmd">
            <Button variant="outline">Go to Command Demo</Button>
          </Link>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Press <kbd className="inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd> anywhere in the app to open the search command!</p>
      </div>
    </div>
  );
}
