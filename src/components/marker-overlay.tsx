"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Group, Pin, ChevronsRight, ChevronsLeft, LoaderCircle } from 'lucide-react';
import { Logo } from './icons';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GroupedMarkers, Marker } from '@/app/page';

interface MarkerOverlayProps {
  groupedMarkers: GroupedMarkers[];
  onMarkerClick: (elementId: string) => void;
  isLoading: boolean;
  totalMarkers: number;
}

export function MarkerOverlay({ groupedMarkers, onMarkerClick, isLoading, totalMarkers }: MarkerOverlayProps) {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 rounded-full shadow-lg bg-card text-foreground hover:bg-secondary"
        aria-label={isOpen ? "Close overlay" : "Open overlay"}
      >
        {isOpen ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-full max-w-md z-40"
          >
            <div className="h-full bg-card/80 backdrop-blur-lg border-l border-border/80 flex flex-col shadow-2xl">
              <header className="p-4 border-b flex items-center gap-3">
                <Logo className="h-8 w-8 text-primary" />
                <h2 className="font-headline text-2xl font-bold text-foreground">Webmarker</h2>
              </header>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {isLoading && totalMarkers > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 px-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      <span>Grouping markers...</span>
                    </div>
                  )}

                  {totalMarkers === 0 ? (
                    <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4">
                        <Pin className="h-12 w-12 text-foreground/10" strokeWidth={1} />
                        <p className="font-headline text-lg">No markers yet!</p>
                        <p className="text-sm">Hold <kbd className="px-2 py-1.5 text-xs font-semibold text-foreground bg-background border rounded-md">CTRL</kbd> and click on text to create your first marker.</p>
                    </div>
                  ) : isLoading && groupedMarkers.length === 0 ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <Accordion type="multiple" defaultValue={groupedMarkers.map(g => g.groupName)} className="w-full">
                      {groupedMarkers.map((group) => (
                        <AccordionItem value={group.groupName} key={group.groupName}>
                          <AccordionTrigger className="font-headline text-lg hover:no-underline">
                            <div className="flex items-center gap-2">
                               <Group className="h-5 w-5 text-primary" />
                               {group.groupName}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-2 pt-2">
                              {group.markers.map((marker) => (
                                <Button
                                  key={marker.id}
                                  variant="ghost"
                                  className="h-auto w-full text-left justify-start gap-3 py-2"
                                  onClick={() => onMarkerClick(marker.elementId)}
                                >
                                  <Pin className="h-4 w-4 shrink-0 text-accent" />
                                  <span className="leading-snug">{marker.text}</span>
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </ScrollArea>

              <footer className="p-4 border-t text-xs text-center text-muted-foreground">
                <p>{totalMarkers} marker{totalMarkers !== 1 ? 's' : ''} created.</p>
              </footer>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
