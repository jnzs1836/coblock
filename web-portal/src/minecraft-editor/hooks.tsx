import { useEffect, useState } from 'react';
import { MinecraftBlock } from '../types/minecraft';
import { generateUId } from '../types/utils';

interface MinecraftEditorState {
  blocks: MinecraftBlock[];
  selectedBlockIndex: number | null;
  newBlockType: string;
  newBlockPos: { x: number; y: number; z: number };
}

interface MinecraftEditorActions {
  addBlock: () => void;
  deleteBlock: (index: number) => void;
  saveBlock: () => void;
  cancelEdit: () => void;
  editBlock: (index: number) => void;
  handleNewBlockTypeChange: (blockType: string) => void;
  handleNewBlockPosChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setBlocks: (blocks: MinecraftBlock[]) => void;
}

const useMinecraftEditor = (initialBlocks: MinecraftBlock[],
        syncBlocks: (blocks: MinecraftBlock[]) => void,
        initialReady: boolean = false
    ): [MinecraftEditorState, MinecraftEditorActions] => {
  const [state, setState] = useState<MinecraftEditorState>({
    blocks: [],
    selectedBlockIndex: null,
    newBlockType: '',
    newBlockPos: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    if(initialReady){
        setState({
          ...state,
          blocks: initialBlocks,
      });
    }
  }, [initialReady]);

  const handleAddBlock = () => {
    const newBlock: MinecraftBlock = {
      blockType: state.newBlockType,
      pos: state.newBlockPos,
      uid: generateUId(),
    };
    setState({
      ...state,
      blocks: [...state.blocks, newBlock],
      newBlockType: '',
      newBlockPos: { x: 0, y: 0, z: 0 },
    });
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = [...state.blocks];
    newBlocks.splice(index, 1);
    setState({
      ...state,
      blocks: newBlocks,
      selectedBlockIndex: null,
    });
  };

  const handleSaveBlock = () => {
    if (state.selectedBlockIndex !== null) {
      const newBlocks = [...state.blocks];
      newBlocks[state.selectedBlockIndex] = {
        uid: newBlocks[state.selectedBlockIndex].uid,
        blockType: state.newBlockType,
        pos: state.newBlockPos,
      };
      setState({
        ...state,
        blocks: newBlocks,
        selectedBlockIndex: null,
      });
    }
  };

  const handleCancelEdit = () => {
    setState({
      ...state,
      selectedBlockIndex: null,
    });
  };

  const handleEditBlock = (index: number) => {
    setState({
      ...state,
      selectedBlockIndex: index,
      newBlockType: state.blocks[index].blockType,
      newBlockPos: state.blocks[index].pos,
    });
  };

  const handleNewBlockTypeChange = (blockType: string) => {
    setState({
      ...state,
      newBlockType: blockType,
    });
  };

  const handleNewBlockPosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pos = { ...state.newBlockPos };
    // @ts-ignore
    pos[event.target.name] = parseInt(event.target.value);
    setState({
      ...state,
      newBlockPos: pos,
    });
  };

  const setBlocks = (blocks: MinecraftBlock[]) => {
    setState({
      ...state,
      blocks,
    });
  };

 

  const actions: MinecraftEditorActions = {
    addBlock: handleAddBlock,
    deleteBlock: handleDeleteBlock,
    saveBlock: handleSaveBlock,
    cancelEdit: handleCancelEdit,
    editBlock: handleEditBlock,
    handleNewBlockTypeChange,
    handleNewBlockPosChange,
    setBlocks,
    };
    
    useEffect(() => {
      syncBlocks(state.blocks);
    }
    , [state.blocks]);

    return [state, actions];
};

export {useMinecraftEditor};

