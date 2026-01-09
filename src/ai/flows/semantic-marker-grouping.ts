'use server';
/**
 * @fileOverview This file defines a Genkit flow for semantically grouping markers.
 *
 * - semanticMarkerGrouping - A function that groups markers based on semantic similarity.
 * - SemanticMarkerGroupingInput - The input type for the semanticMarkerGrouping function.
 * - SemanticMarkerGroupingOutput - The return type for the semanticMarkerGrouping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticMarkerGroupingInputSchema = z.object({
  markers: z.array(
    z.object({
      url: z.string().describe('The URL of the webpage the marker is on.'),
      text: z.string().describe('The text content of the marker.'),
    })
  ).describe('An array of markers to group semantically.')
});
export type SemanticMarkerGroupingInput = z.infer<typeof SemanticMarkerGroupingInputSchema>;

const SemanticMarkerGroupingOutputSchema = z.array(
  z.object({
    groupName: z.string().describe('The name of the semantic group.'),
    markers: z.array(
      z.object({
        url: z.string().describe('The URL of the webpage the marker is on.'),
        text: z.string().describe('The text content of the marker.'),
      })
    ).describe('The markers belonging to this group.'),
  })
).describe('An array of semantic groups, each containing a group name and its associated markers.');
export type SemanticMarkerGroupingOutput = z.infer<typeof SemanticMarkerGroupingOutputSchema>;

export async function semanticMarkerGrouping(input: SemanticMarkerGroupingInput): Promise<SemanticMarkerGroupingOutput> {
  return semanticMarkerGroupingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticMarkerGroupingPrompt',
  input: {schema: SemanticMarkerGroupingInputSchema},
  output: {schema: SemanticMarkerGroupingOutputSchema},
  prompt: `You are an expert in semantic analysis and information organization. Given a list of markers from different webpages, your task is to group them based on their semantic similarity and context.

Markers:
{{#each markers}}
- URL: {{{url}}}, Text: {{{text}}}
{{/each}}

Consider the content and context of each marker to identify common themes and relationships. Provide a concise name for each group that accurately reflects the group's semantic meaning. Return the groups with name and the corresponding markers.

Output should be in JSON format.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const semanticMarkerGroupingFlow = ai.defineFlow(
  {
    name: 'semanticMarkerGroupingFlow',
    inputSchema: SemanticMarkerGroupingInputSchema,
    outputSchema: SemanticMarkerGroupingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
