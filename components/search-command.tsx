'use client';

import * as React from 'react';
import Image from 'next/image';
import { Building2, User, ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';

// Mock data for companies
const companies = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '2',
    name: 'Global Solutions Inc',
    domain: 'globalsolutions.com',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '3',
    name: 'TechStart Ventures',
    domain: 'techstart.com',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '4',
    name: 'Manufacturing Co',
    domain: 'manufacturing.com',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '5',
    name: 'Digital Agency',
    domain: 'digitalagency.com',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center',
  },
];

// Mock data for people
const people = [
  {
    id: '1',
    name: 'John Smith',
    domain: 'johnsmith.com',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    domain: 'sarahjohnson.com',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Mike Chen',
    domain: 'mikechen.com',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Emily Davis',
    domain: 'emilydavis.com',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'David Wilson',
    domain: 'davidwilson.com',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
];

interface SearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Component for square image with icon at bottom right
interface SquareImageWithIconProps {
  src: string;
  alt: string;
  icon: LucideIcon;
  iconColor?: 'blue' | 'purple';
  className?: string;
}

function SquareImageWithIcon({
  src,
  alt,
  icon,
  iconColor = 'blue',
  className,
}: SquareImageWithIconProps) {
  return (
    <div className={cn('relative w-10 h-10 flex-shrink-0 ', className)}>
      <div className='overflow-hidden rounded-md border border-gray-200'>
        <Image
          src={src}
          alt={alt}
          width={40}
          height={40}
          className='w-full h-full object-cover'
        />
      </div>
      <div
        className={cn(
          'absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center shadow-lg border border-gray-200',
          iconColor && `bg-${iconColor}-100`
        )}
      >
        {React.createElement(icon, {
          className: cn('h-3 w-3', iconColor && `text-${iconColor}-600`),
        })}
      </div>
    </div>
  );
}

// Footer component with help information
function SearchCommandFooter() {
  return (
    <div className='border-t bg-muted/30 px-3 py-2'>
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <ArrowUp className='h-4 w-4 border border-gray-200 rounded p-0.5' />
            <ArrowDown className='h-4 w-4 border border-gray-200 rounded p-0.5' />
            <span>Navigate</span>
          </div>
          <Separator orientation='vertical' className='!h-4' />
          <div className='flex items-center bg-gray-100 px-2 py-1 rounded-md'>
            <span>Esc (close)</span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {/* placeholder for more commands */}
        </div>
      </div>
    </div>
  );
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      company.domain.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      person.domain.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (value: string) => {
    console.log('Selected:', value);
    // You can add custom logic here for handling selection
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Search'
      description='Search for companies, people and deals...'
      className='border-4 w-full !max-w-[600px]'
    >
      <CommandInput
        placeholder='Search companies and people...'
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredCompanies.length > 0 && (
          <CommandGroup heading='Companies'>
            {filteredCompanies.map((company) => (
              <CommandItem
                key={company.id}
                value={`company-${company.id}`}
                onSelect={handleSelect}
                className='flex items-center gap-3'
              >
                <SquareImageWithIcon
                  src={company.image}
                  alt={company.name}
                  icon={Building2}
                  iconColor='blue'
                />
                <div className='flex flex-col'>
                  <span className='font-medium'>{company.name}</span>
                  <span className='text-sm text-muted-foreground'>
                    {company.domain}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredCompanies.length > 0 && filteredPeople.length > 0 && (
          <CommandSeparator />
        )}

        {filteredPeople.length > 0 && (
          <CommandGroup heading='People'>
            {filteredPeople.map((person) => (
              <CommandItem
                key={person.id}
                value={`person-${person.id}`}
                onSelect={handleSelect}
                className='flex items-center gap-3'
              >
                <SquareImageWithIcon
                  src={person.image}
                  alt={person.name}
                  icon={User}
                  iconColor='purple'
                />
                <div className='flex flex-col'>
                  <span className='font-medium'>{person.name}</span>
                  <span className='text-sm text-muted-foreground'>
                    {person.domain}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      <SearchCommandFooter />
    </CommandDialog>
  );
}
