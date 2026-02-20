export const createDowntownChunk = (cx, cz, size, buildingGenerator, physicsManager) => {
    // Generate building transforms using the global building generator
    const buildingTransforms = buildingGenerator.generate('downtown', cx, cz, size);

    // (Here we could add physics bodies for the buildings, but we skip it for performance 
    // for non-interactive buildings, or we add generic box colliders)
    const bodies = [];

    return {
        type: 'downtown',
        buildingTransforms,
        meshes: [], // Dynamic meshes handled by BuildingGenerator
        bodies
    };
};
