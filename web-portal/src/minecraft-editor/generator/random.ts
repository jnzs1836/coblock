import { MinecraftBlock, MinecraftBlock2D, MinecraftStructure } from "../../types/minecraft";


function createStructure(maxRectangles: number, maxBlocks: number, maxEdges: number): MinecraftStructure {
    // Assumption: blockType colors
    const blockTypes = ["red", "blue", "green", "yellow", "orange", "purple"];

    // Initialize empty structure
    let structure: MinecraftStructure = { blocks: [] };

    // Create random blocks while respecting the constraints
    let uid = 0;
    for (let i = 0; i < maxRectangles; i++) {
        let blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        let rectangleSize = Math.min(1 + Math.floor(Math.random() * maxEdges), maxBlocks - structure.blocks.length);

        // Create a "rectangle" of blocks
        for (let j = 0; j < rectangleSize; j++) {
            // If it's the first block of the structure, position it at the origin. Otherwise, add it adjacent to an existing block
            let posX, posY, posZ;
            if (structure.blocks.length === 0) {
                posX = posY = posZ = 0;
            } else {
                let adjacentBlock = structure.blocks[Math.floor(Math.random() * structure.blocks.length)];
                let direction = Math.floor(Math.random() * 3);  // 0 for x, 1 for y, 2 for z
                posX = adjacentBlock.pos.x + (direction === 0 ? 1 : 0);
                posY = adjacentBlock.pos.y + (direction === 1 ? 1 : 0);
                posZ = adjacentBlock.pos.z + (direction === 2 ? 1 : 0);
            }

            let block: MinecraftBlock = {
                uid: (uid++).toString(),
                blockType: blockType,
                pos: { x: posX, y: posY, z: posZ },
            };
            structure.blocks.push(block);
            if (structure.blocks.length >= maxBlocks) {
                break;
            }
        }
        if (structure.blocks.length >= maxBlocks) {
            break;
        }
    }

    return structure;
}


export { };