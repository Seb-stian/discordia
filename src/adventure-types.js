exports.unused = {};

/**
 * @namespace adventure_types
 */

/**
 * @typedef Adventure
 * @property {string} name
 * @property {string|Array<Location>} locations
 * @property {string|Array<Enemy>} enemies
 * @property {string|Array<NPC>} npcs
 * @property {string|Array<Quest>} quests
 * @property {string|Array<Item>} items
 * @property {Array<string|ItemCollection>} startingItems
 * @property {string} startingLocation
 */

/**
 * @typedef Location
 * @property {string} name
 * @property {string} image
 * @property {string} description
 * @property {string} condition
 * @property {boolean} friendly
 * @property {Array<string|Entity>} entities
 * @property {Array<string>} leadsTo
 */

/**
 * @typedef Entity
 * @property {string} name
 * @property {number} chance
 */

/**
 * @typedef Enemy
 * @property {string} name
 * @property {number} health
 * @property {number} attack
 * @property {string} image
 * @property {string} condition
 * @property {Array<string|ItemCollection|Entity>} drops
 */

/**
 * @typedef NPC
 * @property {string} name
 * @property {string} image
 * @property {string} condition
 * @property {Dialog} dialog
 * @property {Array<string>} buy
 * @property {Array<string>} sell
 */

/**
 * @typedef Dialog
 * @property {string} text
 * @property {string} condition
 * @property {Array<DialogOption>} options
 */

/**
 * @typedef DialogOption
 * @property {string} condition
 * @property {string} text
 * @property {Dialog} dialog
 * @property {string} command
 */

/**
 * @typedef ItemCollection
 * @property {string} name
 * @property {number} amount
 */

/**
 * @typedef Quest
 * @property {string} name
 * @property {string} description
 * @property {string} tag
 * @property {boolean} repeatable
 * @property {boolean} autocomplete
 * @property {Array<string|ItemCollection>} rewards
 * @property {'kill'|'gather'|'talk'} type
 * @property {Array<string>} targets
 * @property {number} amount
 */

/**
 * @typedef Item
 * @property {string} name
 * @property {string} image
 * @property {'weapon'|'helmet'|'chestplate'|'gloves'|'shoes'|'usable'|'ingredient'|'accesory'} type
 * @property {string} description
 * @property {number} strength
 * @property {number} value
 * @property {number} minLevel
 * For equipment
 * @property {Array<Bonus>} bonuses
 * For potions
 * @property {'health'|'mana'|'xp'} stat
 * @property {number} fightCooldown
 */

/**
 * @typedef Bonus
 * @property {'strength'|'endurance'|'wisdom'|'agility'} stat
 * @property {number} strength
 */

/**
 * @typedef Player
 * @property {string} userID
 * identity
 * @property {string} name
 * @property {'male'|'female'} sex
 * @property {'human'|'undead'|'vampire'|'elf'|'dwarf'} race
 * @property {'warrior'|'mage'|'archer'} type
 * progression
 * @property {number} level
 * @property {number} xp
 * stats
 * @property {number} health
 * @property {number} maxHealth
 * @property {number} mana
 * @property {number} maxMana
 * @property {number} strength
 * @property {number} endurance
 * @property {number} wisdom
 * @property {number} agility
 * inventory
 * @property {Item} equipedWeapon
 * @property {Array<Item>} equipedArmor
 * @property {Array<ItemCollection>} equipedUsables
 * @property {Array<ItemCollection>} inventory
 * other
 * @property {string} currentLocation
 */