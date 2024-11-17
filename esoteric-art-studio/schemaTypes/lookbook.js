// schemas/lookbook.js
export default {
    name: 'lookbook',
    title: 'Lookbook Archive',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'albums',
        title: 'Albums',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'album' }] }],
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 3,
        description: 'Optional short description for the lookbook.',
      },
    ],
  };
  