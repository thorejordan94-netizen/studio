"use server";

import { semanticMarkerGrouping } from '@/ai/flows/semantic-marker-grouping';
import type { SemanticMarkerGroupingInput } from '@/ai/flows/semantic-marker-grouping';

type MarkerForAI = SemanticMarkerGroupingInput['markers'][0];

export async function getGroupedMarkers(markers: MarkerForAI[]) {
  if (!markers || markers.length === 0) {
    return [];
  }
  
  try {
    const grouped = await semanticMarkerGrouping({ markers });
    return grouped;
  } catch (error) {
    console.error("AI grouping failed:", error);
    // In case of an AI error, return a single group with all markers
    // to ensure the UI doesn't break.
    return [{ groupName: "All Markers", markers }];
  }
}
