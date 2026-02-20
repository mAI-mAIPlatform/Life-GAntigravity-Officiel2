export const createCyberSlumsChunk = (cx, cz, size, buildingGenerator, physicsManager) => {
    const buildingTransforms = buildingGenerator.generate('slums', cx, cz, size);

    const bodies = [];

    return {
        type: 'slums',
        buildingTransforms,
        meshes: [],
        bodies
    };
};
