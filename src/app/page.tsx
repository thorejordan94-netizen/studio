"use client";

import { useState, useRef } from 'react';
import type { ElementRef } from 'react';
import { groupMarkersHybrid } from '@/lib/client-marker-grouping';
import { ContentArea, type ContentAreaHandle } from '@/components/content-area';
import { MarkerOverlay } from '@/components/marker-overlay';

// Types for markers, matching what the AI flow expects and what the UI needs.
export type Marker = {
  id: string;
  url: string;
  text: string;
  elementId: string;
};

export type GroupedMarkers = {
  groupName: string;
  markers: Marker[];
};

export default function Home() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [groupedMarkers, setGroupedMarkers] = useState<GroupedMarkers[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);
  const contentAreaRef = useRef<ContentAreaHandle>(null);

  const handleMarkerAdd = ({ text, elementId }: { text: string; elementId: string }) => {
    setIsGrouping(true);
    
    const newMarker: Marker = {
      id: Date.now().toString(),
      text,
      // In a real extension, this would be the page's actual URL
      url: 'webmarker.app/sample-page',
      elementId,
    };

    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);

    // Use client-side grouping
    const markersForGrouping = updatedMarkers.map(({ url, text }) => ({ url, text }));
    const groupsFromGrouping = groupMarkersHybrid(markersForGrouping);

    // Enrich groups with client-side `id` and `elementId` for navigation
    const enrichedGroups = groupsFromGrouping.map(group => {
      const enrichedMarkers = group.markers
        .map(groupMarker => 
          updatedMarkers.find(m => m.text === groupMarker.text && m.url === groupMarker.url)
        )
        .filter((marker): marker is Marker => !!marker); // Type guard to filter out undefined
      return { ...group, markers: enrichedMarkers };
    });
    
    setGroupedMarkers(enrichedGroups);
    setIsGrouping(false);
  };

  const handleMarkerClick = (elementId: string) => {
    contentAreaRef.current?.highlightElement(elementId);
  };

  return (
    <div className="flex h-full min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <ContentArea ref={contentAreaRef} onMarkerAdd={handleMarkerAdd} />
      </main>
      <MarkerOverlay 
        groupedMarkers={groupedMarkers} 
        onMarkerClick={handleMarkerClick} 
        isLoading={isGrouping}
        totalMarkers={markers.length}
      />
    </div>
  );
}
