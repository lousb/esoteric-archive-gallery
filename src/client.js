import sanityClient from "@sanity/client";

const client = sanityClient({
    projectId: '3xolddto',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-11-16'
    
});

// Export the initialized client along with projectId and dataset values
export const projectId = client.config().projectId;
export const dataset = client.config().dataset;
export default client;
