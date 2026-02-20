export const createCommercialChunk = (cx, cz, size, buildingGenerator, physicsManager) => {
    const buildingTransforms = buildingGenerator.generate('commercial', cx, cz, size);

    const bodies = [];

    return {
        type: 'commercial',
        buildingTransforms,
        meshes: [],
        bodies
    };
};
