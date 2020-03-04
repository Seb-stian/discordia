[TO-DO]
- player classes and races have an effect

- implement logging
- better help (show only possible)
- turn of command cooldown for admins
- possibility to assign admin to a role

- check if bot has rights to write to a channel, read messages, add/remove reactions
- 'find' command that gives you a reference to your controller and deletes the message after cooldown
- cooldown types: 'user' and 'all' (help is 'all', others will be 'user')

[WIKI]
DIALOGS:
    conditions:
        quest:<phase>:<tag>
        player:<level|strength|endurance|wisdom|agility|sex|race|type|health|mana|xp>:value
        inventory:<item name>:<amount>
    commands:
        quest:<tag> - starts or finishes a quest with tag
        back:<number> - jumps back in dialog by a number
        travel:<location name> - moves player to the location
        exit - exits the dialog immediately
        give:<item name|health|mana|xp>:<amount>
        take:<item name|health|mana|xp>:<amount>

(for numerical values, write '=n' or '<n' or '>n')
(split multiple conditions/commands with ; like for example "take:gold:10;give:Grilled cheese:1")

[PLAN] (screens)

Every player has his own "controller" which is going to be a message embed controlled with reactions.

!join -> CHARACTER CREATION SCREEN
*name* is automatically the username
choose *sex*: :male_sign: male :female_sign: female
choose *race*: :man_elf: :woman_elf:  elves :man_pouting: :woman_pouting: men :man_zombie: :woman_zombie: undead :man_vampire: :woman_vampire: vampires :bearded_person: dwarves
choose *class* (type): :dagger:  warrior :sparkles: mage :bow_and_arrow: archer

-> LOCATION SCREEN
-----------------------------------
| Location name             image |
| Location description            |
|                                 |
|                                 |
|                                 |
| You can go to:                  |
| ...                             |
-----------------------------------
[C] [G]
character, go to

-> GO TO SCREEN
-----------------------------------
| [1] x                           |
| [2] y                           |
| ...                             |
|                                 |
|                                 |
|                                 |
| [arrow_left] back               |
| [arrow_down] next               |
-----------------------------------
[1] [2] [3] [...] [arrow_left] [arrow_down]

-> CHARACTER SCREEN
-----------------------------------
| race+class                image |
| stats                           |
| equipment                       |
|                                 |
|                                 |
|                                 |
|                                 |
|                                 |
-----------------------------------
[B] [I]
back, inventory

-> INVENTORY SCREEN

list of: item (x2) [1] ... [B] back
[1] -> ITEM SCREEN -> name, stats, count, [D] drop, [E] equip, [B] back

-> DIALOG SCREEN
-> SHOPING SCREEN
-> FIGHT SCREEN