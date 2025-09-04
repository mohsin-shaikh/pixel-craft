'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchCommand } from '@/components/search-command';

interface SearchCommandContextType {
  openCommand: () => void;
  closeCommand: () => void;
  isOpen: boolean;
}

const SearchCommandContext = createContext<SearchCommandContextType | undefined>(undefined);

export function useSearchCommand() {
  const context = useContext(SearchCommandContext);
  if (context === undefined) {
    throw new Error('useSearchCommand must be used within a SearchCommandProvider');
  }
  return context;
}

interface SearchCommandProviderProps {
  children: ReactNode;
}

export function SearchCommandProvider({ children }: SearchCommandProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openCommand = () => setIsOpen(true);
  const closeCommand = () => setIsOpen(false);

  // Add global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openCommand();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value = {
    openCommand,
    closeCommand,
    isOpen,
  };

  return (
    <SearchCommandContext.Provider value={value}>
      {children}
      <SearchCommand open={isOpen} onOpenChange={setIsOpen} />
    </SearchCommandContext.Provider>
  );
}
