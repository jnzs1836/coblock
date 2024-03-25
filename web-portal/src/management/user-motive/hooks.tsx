import { useState } from "react";
import { StructureMotiveInstance, MotiveDetailLevel } from "../../types/task";

const createInitialMotive: ()=>StructureMotiveInstance = () => {
    return {
        name: "Default Name",
        config: {
            blockIndices: [],
            detailLevel: MotiveDetailLevel.VISUAL,
        },
        description: {
            descriptionType: 'VISUAL',
            blocks: [],
            views: []
        },
    }
}
const useUserMotives= (motives: StructureMotiveInstance[], setMotives: (fn: (prev: StructureMotiveInstance[]) => StructureMotiveInstance[]) => void) => {
    // const [motives, setMotives] = useState<StructureMotiveInstance[]>([]);
    const response = {
        onAdd: () => {
           setMotives(prev => [...prev, createInitialMotive()]);
         },
        onEdit: (index: number, updatedMotive: StructureMotiveInstance) => {
            setMotives(
                prev => [
                    ...prev.slice(0, index),
                    updatedMotive,
                    ...prev.slice(index + 1)
                ]
            ); 
         },
        onDelete: (index: number) => {
            setMotives(
                prev => [
                    ...prev.slice(0, index),
                    ...prev.slice(index + 1)
                ]
            ); 
         },
        motives: motives,
    }
    return response;
}

export { useUserMotives};