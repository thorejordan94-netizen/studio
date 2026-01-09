/**
 * Client-side marker grouping utilities
 * This provides a simplified grouping mechanism that works without server-side AI
 */

type MarkerForGrouping = {
  url: string;
  text: string;
};

type GroupedMarkers = {
  groupName: string;
  markers: MarkerForGrouping[];
};

/**
 * Groups markers by their URL domain
 * This is a simple client-side alternative to AI-based semantic grouping
 */
export function groupMarkersByDomain(markers: MarkerForGrouping[]): GroupedMarkers[] {
  if (!markers || markers.length === 0) {
    return [];
  }

  const groupMap = new Map<string, MarkerForGrouping[]>();

  markers.forEach(marker => {
    try {
      // Extract domain from URL
      const url = new URL(marker.url.startsWith('http') ? marker.url : `https://${marker.url}`);
      const domain = url.hostname.replace('www.', '');
      
      if (!groupMap.has(domain)) {
        groupMap.set(domain, []);
      }
      groupMap.get(domain)!.push(marker);
    } catch (error) {
      // If URL parsing fails, put in "Other" group
      if (!groupMap.has('Other')) {
        groupMap.set('Other', []);
      }
      groupMap.get('Other')!.push(marker);
    }
  });

  // Convert map to array of groups
  const groups: GroupedMarkers[] = Array.from(groupMap.entries()).map(([domain, markers]) => ({
    groupName: domain,
    markers,
  }));

  // Sort groups by number of markers (descending)
  groups.sort((a, b) => b.markers.length - a.markers.length);

  return groups;
}

/**
 * Groups markers using simple keyword extraction
 * Looks for common keywords in marker text
 */
export function groupMarkersByKeywords(markers: MarkerForGrouping[]): GroupedMarkers[] {
  if (!markers || markers.length === 0) {
    return [];
  }

  // Simple keyword-based grouping
  const keywords = ['documentation', 'tutorial', 'guide', 'reference', 'api', 'example', 
                    'article', 'blog', 'news', 'product', 'pricing', 'feature'];
  
  const groupMap = new Map<string, MarkerForGrouping[]>();
  const ungrouped: MarkerForGrouping[] = [];

  markers.forEach(marker => {
    const lowerText = marker.text.toLowerCase();
    let grouped = false;

    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        const groupName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }
        groupMap.get(groupName)!.push(marker);
        grouped = true;
        break; // Only put in first matching group
      }
    }

    if (!grouped) {
      ungrouped.push(marker);
    }
  });

  // Add ungrouped markers to "Other" category
  if (ungrouped.length > 0) {
    groupMap.set('Other', ungrouped);
  }

  const groups: GroupedMarkers[] = Array.from(groupMap.entries()).map(([groupName, markers]) => ({
    groupName,
    markers,
  }));

  // Sort groups by number of markers (descending)
  groups.sort((a, b) => b.markers.length - a.markers.length);

  return groups;
}

/**
 * Groups markers with a hybrid approach: first by domain, then by keywords within each domain
 */
export function groupMarkersHybrid(markers: MarkerForGrouping[]): GroupedMarkers[] {
  if (!markers || markers.length === 0) {
    return [];
  }

  // For small number of markers, just group by domain
  if (markers.length <= 5) {
    return groupMarkersByDomain(markers);
  }

  // For larger collections, use keyword-based grouping
  return groupMarkersByKeywords(markers);
}
