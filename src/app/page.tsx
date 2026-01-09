"use client";

import { useState, useRef, useTransition } from 'react';
import type { ElementRef } from 'react';
import { getGroupedMarkers } from './actions';
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
  const [isPending, startTransition] = useTransition();
  const contentAreaRef = useRef<ContentAreaHandle>(null);

  const handleMarkerAdd = ({ text, elementId }: { text: string; elementId: string }) => {
    startTransition(async () => {
      const newMarker: Marker = {
        id: Date.now().toString(),
        text,
        // In a real extension, this would be the page's actual URL
        url: 'webmarker.app/sample-page',
        elementId,
      };

      const updatedMarkers = [...markers, newMarker];
      setMarkers(updatedMarkers);

      // We only send the necessary data to the AI flow
      const markersForAI = updatedMarkers.map(({ url, text }) => ({ url, text }));
      const groupsFromAI = await getGroupedMarkers(markersForAI);

      // The AI returns groups with markers that only have `url` and `text`.
      // We need to enrich them with our client-side `id` and `elementId` for navigation.
      const enrichedGroups = groupsFromAI.map(group => {
        const enrichedMarkers = group.markers
          .map(aiMarker => 
            updatedMarkers.find(m => m.text === aiMarker.text && m.url === aiMarker.url)
          )
          .filter((marker): marker is Marker => !!marker); // Type guard to filter out undefined
        return { ...group, markers: enrichedMarkers };
      });
      
      setGroupedMarkers(enrichedGroups);
    });
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
        isLoading={isPending}
        totalMarkers={markers.length}
      />
    </div>
  );
}
