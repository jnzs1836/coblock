import { useState } from "react";
import { MinecraftStructure, MinecraftBlock } from "../types/minecraft";
import { generateUId } from '../types/utils';

const initialBlocks: MinecraftBlock[] = [
    { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 0, y: 2, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 0, y: 3, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 0, y: 4, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 0, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 1, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 2, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 3, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 4, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 4, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 3, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 2, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 1, y: 5, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 0, y: 0, z: 2 }, uid: generateUId() },
    { blockType: 'red', pos: { x: 5, y: 0, z: 2 }, uid: generateUId() },
    { blockType: 'green', pos: { x: 3, y: 6, z: 2 }, uid: generateUId()  },
    { blockType: 'green', pos: { x: 3, y: 6, z: 3 }, uid: generateUId()  },
    { blockType: 'green', pos: { x: 3, y: 6, z: 4 }, uid: generateUId()  },
    { blockType: 'green', pos: { x: 3, y: 6, z: 1 }, uid: generateUId()  },
    { blockType: 'green', pos: { x: 3, y: 6, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 5, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 4, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 3, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 2, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 1, z: 0 }, uid: generateUId()  },
    { blockType: 'purple', pos: { x: 3, y: 0, z: 0 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 0, z: 4 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 1, z: 4 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 2, z: 4 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 3, z: 4 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 4, z: 4 }, uid: generateUId()  },
    { blockType: 'white', pos: { x: 3, y: 5, z: 4 }, uid: generateUId()  },
    
    // { blockType: 'blue', pos: { x: 3, y: 6, z: 0 }, uid: generateUId()  },
    // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
    ];
  
function useMinecraftBlueprint(){
    const [blueprint, setBlueprint] = useState<MinecraftStructure>({
        blocks: initialBlocks,
    });
    return {blueprint, setBlueprint};

}

export { useMinecraftBlueprint};
