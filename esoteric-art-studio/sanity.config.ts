import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemaTypes/schema'; // Correct import for schema types

export default defineConfig({
  name: 'default',
  title: 'Esoteric Art Studio',

  projectId: '3xolddto',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes, // Use the array of schemas directly
  },
});
