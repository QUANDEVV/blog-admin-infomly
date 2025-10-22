import React from 'react';
import Link from 'next/link';
import { ChevronRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transform transition-all duration-500 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'bg-gradient-to-br from-background to-background/95 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Search Bar */}
      {/* <div className="p-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search news, topics and more"
            className="w-full pl-4 pr-10 font-medium"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div> */}

      {/* Buttons */}
      {/* <div className="flex gap-2 px-4 mb-4">
        <Button variant="secondary" className="flex-1 font-semibold">
          Register
        </Button>
        <Button variant="outline" className="flex-1 font-semibold">
          Sign In
        </Button>
      </div> */}

      {/* Mobile Navigation */}
      <nav className="border-t">
        {[
          { href: '/', label: 'Home' },
          { href: '/News', label: 'News' },
          { href: '/Tech', label: 'Tech' },
          { href: '/AI', label: 'AI' },
          { href: '/Health', label: 'Health' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            passHref /* Ensure proper Link behavior */
            onClick={() => onClose()} /* Wrap in arrow function for safe execution */
            className={cn(
              'flex items-center justify-between p-4',
              'hover:bg-accent/50 transition-colors',
              'border-b border-border',
              'group'
            )}
          >
            <span className="text-lg font-semibold tracking-tight">
              {item.label}
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileMenu;
