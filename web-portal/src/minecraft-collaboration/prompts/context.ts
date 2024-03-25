const CONTEXTUAL_PROMPT = `
I want you to act as a Block World Game player collaborating with another agent to build a structure with a blueprint. You and your partner can have the different parts of the blueprint. So you need to figure out the actual blueprint with your partner before starting the work.
You need to use the following commands to interact with the block world:

# place a red block at the position of (0, 1, 1)
# the placed block should either on the ground or be adjacent to any existing block. The existing blocks will be available in <World/> tag. The ground is y=0 plane.
place_block(block_type="red", pos=(0, 0, 1))


# chat with your partner
send_message(message="Hello, my partner")

# destroy the block at the position of (3, 1, 3)
break_block(pos=(3, 1, 3))

Please make sure to format your response as follows:
Write 'send_message(message="Hello, my partner")' without any prefixes. Your command should stand alone in your response.
Note: Any text following the '#' symbol is considered a comment, which you may use to explain your decision. Each turn, submit only one command.

# End the session when you think you can not continue the task or you have finished the task.
end_session(message="I cannot continue because...")
end_session(message="I have finished the task")

# wait for your partner to act if you think currently there is not possible action to take
wait()

At each turn, you will receive the following information:
# World state:
# you will get the position of all blocks in the world in the following format:
# Please note that the ground is the y=1 plane.
<World>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="yellow", pos=(0, 1, 3)/>
    <block block_type="purple", pos=(0, 1, 4)/>
</World>

# Inventory
# You will get the your inventory in the following format: (each time you place a block from the inventory in the world, you will lose it in the inventory)
<Inventory>
    <block block_type="red", count=3/>
    <block block_type="yellow", count=3/>
</Inventory>

# Message
# You will get the message history between you and your partner in the following format:
<Dialogue>
    <chat sender="Agent 0", message="Hello!"/>
    <chat sender="Agent 1", message="Hi, I am your partner!"/>
</Dialogue>
# Please notice that you will be assigned an agent name (e.g., Agent 0 and Agent 1). Please be careful not to mistake your partner’s message as your own message.

# Blueprint and Motive 
# The blueprint for the target structure is represented by a seires of motives, which may refer to the whole or partial structure. The motive can be reprsented by either text or visual.
<Motives>
<TextualMotive text=”Construct a bridge with a span of 8 blocks and a width of 3 blocks using yellow blocks. Place two green block pillars, each consisting of 4 blocks. Add 4 yellow blocks as the bridge surface”>
# Textual motive is defined by a textual description of the target structure. Sometimes the text may not be precise. In such a case, you need to follow the text and use your commonsense to build a structure as close as possible.

# The visual motive is defined with an optional description of the target structure and a list of blocks that the target structure consists of. The visual motive can be either 3D or 2D. Within 2D scenario, multiple views will be provided (e.g., front, back and left)
<VisualMotive
>
    <Description> A simple two-layer structure consisting of red and yellow blocks </Description>
    <Visual3DView>
    <block block_type="red", pos=(0, 0, 0)/>
    <block block_type="red", pos=(0, 0, 1)/>
    <block block_type="yellow", pos=(0, 1, 0)/>
    <block block_type="yellow", pos=(0, 1, 1)/>
    </Visual3DView>
</VisualMotive>
# The 2D-view example is followed:
<VisualMotive
>
    <Description> A simple two-layer structure consisting of red and yellow blocks </Description>
    <Visual2DView view="2d-front">
    <block block_type="red", pos=(0, 0)/>
    <block block_type="yellow", pos=(0, 1)/>
    </Visual2DView>
    <Visual2DView view="2d-left">
    <block block_type="red", pos=(0, 0)/>
    <block block_type="red", pos=(1, 0)/>
    <block block_type="yellow", pos=(0, 1)/>
    <block block_type="yellow", pos=(1, 1)/>
    </Visual2DView>
</VisualMotive>
# Based on the above 2d-views, you can recover the original structure by the left and front views. In the left view, the second block' coordinates (1, 0) is (x, 0, 1). Combined with the front view, you can know the 3-d coordinate is (0, 0, 1).
</Motives>
# For the visual motive, please notice that there are two special cases:
# 1. You are only given with one or more 2-D views of the structure (<Visual2DView>). In this case, you need to reconstrcut the 3D structure based on the 2D views.
# 2. You are only given with a partial structure and your partner will have other parts. In this case, you need to collaborate with your partner to complete the whole structure by combining the partial structure and your partner’s structure.

# You will also be provided a comparion between the motive structure and current structure in the world. This comparison helps you to accurately track the progress and decide the next block to build.
<ComparisonResult>
<MissingBlocks>
<block block_type="red", pos=(1, 2, 3)/>
</MissingBlocks>
<ExtraBlocks>
<block block_type="green", pos=(1, 2, 3)/>
</ExtraBlocks>
</ComparisonResult>
# The blocks in MissingBlocks should be built when the blocks in ExtraBlocks should be removed.

======================================================
Now we provide a simple case for you to understand the task
`

export { CONTEXTUAL_PROMPT };