const PROMPT_TEXT_BASE = `
======================================================
Round 1:
======================================================
Input: 
<Input>
<Blueprint>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
    <block block_type="yellow", pos=(0, 2, 2)/>
    <block block_type="yellow", pos=(1, 2, 2)/>
    <block block_type="red", pos=(0, 2, 3)/>
    <block block_type="yellow", pos=(1, 2, 3)/>
</Blueprint>

<World>
</World>

<Inventory>
     <block block_type="yellow", count=5/>
</Inventory>

<Dialogue>
    <chat sender="ChatGPT", message="Hello!"/>
    <chat sender="Partner", message="Hi, I am your partner to help you. I have 5 red blocks"/>
</Dialogue>
</Input>

Expected Output:
# I need to ask for your partner's help because I do not have any red block to build the first layer;
send_message(message="Thanks, can you build a 2x2 rectangle from (0, 1, 2) to (1, 1, 3)")
======================================================

======================================================
Round 2:
======================================================
Input: 
<Input>
<Blueprint>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
    <block block_type="yellow", pos=(0, 2, 2)/>
    <block block_type="yellow", pos=(1, 2, 2)/>
    <block block_type="red", pos=(0, 2, 3)/>
    <block block_type="yellow", pos=(1, 2, 3)/>
</Blueprint>

<World>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
</World>

<Inventory>
     <block block_type="yellow", count=5/>
</Inventory>

<Dialogue>
    <chat sender="ChatGPT", message="Hello!"/>
    <chat sender="Partner", message="Hi, I am your partner to help you. I have 5 red blocks"/>
    <chat sender="ChatGPT", message="Thanks, can you build a 2x2 rectangle from (0, 1, 2) to (1, 1, 3)"/>
    <chat sender="Partner", message="Done!"/> 
</Dialogue>
</Input>

Expected Output:
# Based on the world information, I can find your partner has build the red layer on the ground as I requested. Now I can build the red layer upon it because I have the yellow blocks.
place_block(block_type="yellow", pos=(0, 2, 2))
place_block(block_type="yellow", pos=(1, 2, 2))
place_block(block_type="yellow", pos=(1, 2, 3))

# There should be a red block on the second layer based on the motive. So after building other yellow blocks, I need to ask your partner for help.
send_message(message="Thanks! now can you place a red block on the missing corner of the second layer")

======================================================
Round 3:
======================================================
Input: 
<Input>
<Blueprint>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
    <block block_type="yellow", pos=(0, 2, 2)/>
    <block block_type="yellow", pos=(1, 2, 2)/>
    <block block_type="red", pos=(0, 2, 3)/>
    <block block_type="yellow", pos=(1, 2, 3)/>
</Blueprint>

<World>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
    <block block_type="yellow", pos=(0, 2, 2)/>
    <block block_type="yellow", pos=(1, 2, 2)/>
    <block block_type="red", pos=(0, 2, 3)/>
    <block block_type="yellow", pos=(1, 2, 3)/>
</World>

<Inventory>
     <block block_type="yellow", count=2/>
</Inventory>

<Dialogue>
    <chat sender="ChatGPT", message="Hello!"/>
    <chat sender="Partner", message="Hi, I am your partner to help you. I have 5 red blocks"/>
    <chat sender="ChatGPT", message="Thanks, can you build a 2x2 rectangle from (0, 1, 2) to (1, 1, 3)"/>
    <chat sender="Partner", message="Done!"/> 
    <chat sender="ChatGPT", message="Thanks! now can you place a red block on the missing corner of the second layer"/>
    <chat sender="Partner", message="Finished!"/>
</Dialogue>
</Input>


Expected Output:
# Comparing the world and blueprint, you realize you and your partner have finished the target structure. So you can tell your partner that you twohave finished the task.
send_message(message="Awesome! We have completed the structure!")
`

export {PROMPT_TEXT_BASE}