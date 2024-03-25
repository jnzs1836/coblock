import { MinecraftBlock , MinecraftBlockPos} from "../../types/minecraft";

function checkPlaceBlockValid(
    blockType: string,
    pos: MinecraftBlockPos,
    existingBlocks: MinecraftBlock[]
): boolean {
    // Check if block is being placed on the ground
    if (pos.y === 0) {
        return true;
    }

    // Check if block is adjacent to any existing block
    for (let block of existingBlocks) {
        if (
            (Math.abs(block.pos.x - pos.x) <= 1 && block.pos.y === pos.y && block.pos.z === pos.z) ||
            (block.pos.x === pos.x && Math.abs(block.pos.y - pos.y) <= 1 && block.pos.z === pos.z) ||
            (block.pos.x === pos.x && block.pos.y === pos.y && Math.abs(block.pos.z - pos.z) <= 1)
        ) {
            return true;
        }
    }

    // If neither condition is met, return false
    return false;
}

export {checkPlaceBlockValid};