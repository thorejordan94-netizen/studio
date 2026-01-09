'use server';

/**
 * @fileOverview Organizes markers contextually using GenAI.
 *
 * - organizeMarkers - A function that takes a list of markers and organizes them contextually.
 * - Marker - The input type for the organizeMarkers function.
 * - OrganizedMarkers - The return type for the organizeMarkers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarkerSchema = z.object({
  url: z.string().describe('The URL of the webpage the marker is on.'),
  text: z.string().describe('The text content of the marker.'),
});

export type Marker = z.infer<typeof MarkerSchema>;

const OrganizedMarkersSchema = z.array(
  z.object({
    category: z.string().describe('The category the markers belong to.'),
    markers: z.array(MarkerSchema).describe('The markers in this category.'),
  })
);

export type OrganizedMarkers = z.infer<typeof OrganizedMarkersSchema>;

export async function organizeMarkers(
  markers: Marker[]
): Promise<OrganizedMarkers> {
  return organizeMarkersFlow(markers);
}

const prompt = ai.definePrompt({
  name: 'contextualMarkerOrganizationPrompt',
  input: {schema: z.array(MarkerSchema).describe('A list of markers to organize.')},
  output: {schema: OrganizedMarkersSchema},
  prompt: `You are an expert in organizing information. Given the following list of markers, group them into categories based on their context and meaning.

Markers:
{{#each this}}
- URL: {{{url}}}, Text: {{{text}}}
{{/each}}

Return a JSON array of objects, where each object has a "category" field and a "markers" field. The "markers" field should be an array of the original markers that belong to that category. The category descriptions should be high level, and not describe the markers in extreme detail.

Example:
[
  {
    "category": "Shopping",
    "markers": [
      {
        "url": "https://www.example.com/products/123",
        "text": "Add to cart"
      },
      {
        "url": "https://www.example.com/products/456",
        "text": "Buy now"
      }
    ]
  },
  {
    "category": "Recipes",
    "markers": [
      {
        "url": "https://www.example.com/recipes/pasta",
        "text": "Ingredients list"
      },
      {
        "url": "https://www.example.com/recipes/pizza",
        "text": "Instructions"
      }
    ]
  }
]
`,
});

const organizeMarkersFlow = ai.defineFlow(
  {
    name: 'organizeMarkersFlow',
    inputSchema: z.array(MarkerSchema),
    outputSchema: OrganizedMarkersSchema,
  },
  async markers => {
    const {output} = await prompt(markers);
    return output!;
  }
);

