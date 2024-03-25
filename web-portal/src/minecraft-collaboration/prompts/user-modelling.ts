const PROMPT_TEXT_USER_MODELLING = 
`
======================================================
Round 1:
======================================================
Input: 
<Input>
<Motive>

<TextualMotive 
text=”Construct a bridge with a span of 12 blocks using green blocks. Place two green block pillars, each consisting of 4 blocks. Add 4 yellow blocks as the bridge surface. ”
/>
</Motive>
<World>
</World>

<Inventory>
     <block block_type="yellow", count=20/>
     <block block_type="green", count=20/>
     <block block_type="purple", count=20/>
</Inventory>

<Dialogue>

</Dialogue>
</Input>

Expected Output:

# Thoughts: To create the partner modelling, we first review the dialogue history and current world status. Since the world is empty and there is no dialogue history, there is no way to know the partner’s inventory and goals.

# Partner Modelling
# Long-term goal: Unknown
# Short-term goal: Unknown
# Partner inventory: Unknown

# Thoughts: Since my long-term goal is to build the bridge, i need to decompose it into different small parts. The first part I can build is the pillars. .
# Self Modelling
# Long-term goal: creating the target structure
# Short-term goal:Build the green pillars
# My inventory: [yellow: 20, green: 20, purple: 20]


# Thoughts: Since I do not have any access to the partner’s information, I need to let him know my intention and inventory when asking for its. 
send_message(message="Hi, I need to build a bridge with the yellow deck and green pillars. I have green, yellow and purple. How about you?")

======================================================

======================================================
Round 2:
======================================================
Input: 
<Input>
<Motives>
<TextualMotive 
text=”Construct a bridge with a span of 8 blocks and a width of 3 blocks using yellow blocks. Place two green block pillars, each consisting of 4 blocks. Add 4 yellow blocks as the bridge surface. ”
/>
</Motives>
<World>
    <block block_type="red", pos=(0, 1, 2)/>
    <block block_type="red", pos=(1, 1, 2)/>
    <block block_type="red", pos=(0, 1, 3)/>
    <block block_type="red", pos=(1, 1, 3)/>
</World>

<Inventory>
     <block block_type="yellow", count=20/>
     <block block_type="green", count=17/>
     <block block_type="purple", count=20/>
</Inventory>

<Dialogue>
    <chat sender="Agent 1", message="Hi, I need to build a bridge with the yellow deck and green pillars. I have green, yellow and purple. How about you?"/>
    <chat sender="Agent 2", message="Hi, I have red, green and black. I need to build the black fence upon your deck "/>
</Dialogue>
</Input>

Expected Output:
# Thoughts:I have extracted the partner information from the partner’s response. The partner said “I have green, yellow and purple” so I can know the partner has red, green and black blicks. However, I do not know the number of blocks in the inventory. Since the partner said “I need to build a bridge with the yellow deck and green pillars”, I can know the partner needs to build the fence on the deck. Since the partner cannot build the fence until the deck is built, my partner needs to wait for me to build the deck.

# Partner Modelling
# Long-term goal: Build the fence on the deck
# Short-term goal: Wait until the fence is built
# Partner inventory: [red: unknown, green: unknown, black: unknown]

# Thoughts: Since my long-term goal is to build the bridge, i need to decompose it into different small parts. The first part I can build is the pillars. I can ask for the partner’s help because it has the green block in the inventory.

# Self Modelling
# Long-term goal: creating the target structure
# Short-term goal:Build the green pillars. Ask for the partner’s help for the pillars
# My inventory: [green: 20, red: 20, purple: 20]

# Thoughts: Since the motive does not specify the locations of the pillars, I need to first decide them. Given the fact that the partner is waiting and it can help me build the pillar, it is also reasonable to ask for its help.
send_message(message="Hi, I need to build the two pillars first. My bridge spans 12 and I need to have 2 pillars. So it would be resonable to put the two pillar at (4, 0, 0) and (8, 0, 0). I will start with the (4, 0, 0) one and could you please build the pillar at (8, 0, 0) ?")

# Thoughts: Since I need to build the yellow pillar on on (4, 0, 0), I need to place a series of yellow blocks there.
place_block(block_type="yellow", pos=(4, 0, 0))
place_block(block_type="yellow", pos=(4, 1, 0))
place_block(block_type="yellow", pos=(4, 2, 0))

======================================================
Round 3:
======================================================
Input: 
<Input>
<Motives>
<TextualMotive 
text=”Construct a bridge with a span of 8 blocks and a width of 3 blocks using yellow blocks. Place two green block pillars, each consisting of 4 blocks. Add 4 yellow blocks as the bridge surface. ”
/>
</Motives>
<World>
    <block block_type="yellow", pos=(4, 0, 0)/>
    <block block_type="yellow", pos=(4, 1, 0)/>
    <block block_type="yellow", pos=(4, 2, 0)/>
    <block block_type="yellow", pos=(8, 1, 0)/>
    <block block_type="yellow", pos=(8, 2, 0)/>
    <block block_type="yellow", pos=(8, 3, 0)/>
</World>

<Inventory>
     <block block_type="yellow", count=20/>
     <block block_type="green", count=14/>
     <block block_type="purple", count=20/>
</Inventory>

<Dialogue>
<chat sender="Agent 1", message="Hi, I need to build a bridge with the yellow deck and green pillars. I have green, yellow and purple. How about you?"/>
<chat sender="Agent 2", message="Hi, I have red, green and black. I need to build a black fence upon your deck "/>
<chat sender="Agent 1", message="Sure, I will build the yellow pillar as you requested. "/>
</Dialogue>
</Input>

Expected Output:

# Thoughts: Given the message ”Sure, I will build the yellow pillar as you requested”, I can infer that my partner’s goal was to build the yellow pillar. Based on the world status, I can infer that the partner has not completed the goal and would continue on building the pillar. So the short-term pillar would be building the pillar at (8, 0, 0) as I requested. Since I do not know the number of blocks in the inventory, i am not able to update the inventory information.

# Partner Modelling
# Long-term goal: Build the fence on the deck
# Short-term goal: Building the pillar at (8, 0, 0) as I requested.
# Partner inventory: [red: unknown, green: unknown, black: unknown]:

# Thoughts: Since the yellow pillar has not been finished, I need to continue building it.
# Self Modelling
# Long-term goal: creating the target structure
# Short-term goal: Build the yellow pillar on (4, 0, 0)

# Thoughts: Build the last block of the pillar as it is my short-term goal.
place_block(block_type="yellow", pos=(4, 4, 0))

# Thoughts: Since I have finished the pillar and can assum my partner will finish his assigned pillar. I can start building the green deck
place_block(block_type="yellow", pos=(4, 0, 0))
send_message(message="I have completed my pillar. Then I will start building the green deck.!")
place_block(block_type="green", pos=(4, 5, 0))
place_block(block_type="green", pos=(3, 5, 0))
`

export {PROMPT_TEXT_USER_MODELLING};