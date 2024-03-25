import { MinecraftBlock, MinecraftBlueprint } from "../../types/minecraft";


function checkBlockExists(block: MinecraftBlock, blocks: MinecraftBlock[]){
    let sameBlock = blocks.filter(
        (b) => b.pos.x === block.pos.x && b.pos.y === block.pos.y && b.pos.z === block.pos.z && b.blockType === block.blockType
    );
    if (sameBlock.length === 0){
        return false;
    }else{
        return true
    }
}


function validCurrentStructure(currentBlocks: MinecraftBlock[], blueprint: MinecraftBlueprint){
    for (let block of blueprint.spec.blocks){
        if(!checkBlockExists(block, currentBlocks)){
            return false;
        }
    }
    return true;
}

function computeStructureProgress (currentBlocks: MinecraftBlock[], blueprint: MinecraftBlueprint){
    let validBlocks = currentBlocks.filter(
        (b) => checkBlockExists(b, blueprint.spec.blocks)
    )
    
    let adjustedTotalBlocks = blueprint.spec.blocks.length;
    if(blueprint.spec.blocks.length < currentBlocks.length){
        adjustedTotalBlocks = currentBlocks.length;
    }

    return validBlocks.length / adjustedTotalBlocks;
}

export {validCurrentStructure, computeStructureProgress};