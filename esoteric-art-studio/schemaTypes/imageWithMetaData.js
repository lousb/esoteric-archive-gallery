// schemas/imageWithMetadata.js
export default {
    name: 'imageWithMetadata',
    title: 'Image with Metadata',
    type: 'object',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 3,
        description: 'Optional short description for the image.',
      },
    ],
    preview: {
      select: {
        title: 'description',
        media: 'image',
      },
    },
  };
  