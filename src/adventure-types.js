exports.unused = {};

/**
 * @namespace adventure_types
 */

/**
 * @typedef Adventure
 * @property {string} name
 * @property {Array<Location>} locations
 * @property {Array<Enemy>} enemies
 * @property {Array<NPC>} npcs
 * @property {Array<Quest>} quests
 * @property {Array<Item>} items
 * @property {Array<string|ItemCollection>} startingItems
 * @property {string} startingLocation
 */

/**
 * @typedef Location
 * @property {string} name
 * @property {string} description
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
 * @property {number} xp
 */

/**
 * @typedef NPC
 * @property {string} name
 * @property {Array<string|DialogOption>} dialog
 * @property {Array<string>} buy
 * @property {Array<string>} sell
 */

/**
 * @typedef DialogOption
 * @property {'default'|'quest'} type
 * @property {string} quest
 * @property {'start'|'progress'|'finished'} phase
 * @property {string} text
 * @property {Array<string|DialogOption>} dialog
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
 * @property {'kill'|'gather'} type
 * @property {Array<string>} targets
 * @property {number} amount
 */

/**
 * @typedef Item
 * @property {string} name
 * @property {'weapon'|'helmet'|'chestplate'|'gloves'|'shoes'|'usable'|'ingredient'|'accesory'} type
 * @property {string} description
 * @property {number} strength
 * @property {number} value
 * @property {'health'|'mana'|'xp'} stat
 */

/**
 * @typedef Player
 * @property {string} name
 * @property {number} level
 * @property {number} xp
 * @property {number} health
 * @property {number} maxHealth
 * @property {number} mana
 * @property {number} maxMana
 * @property {Item} equipedWeapon
 * @property {Array<Item>} equipedArmor 
 * @property {Array<ItemCollection>} inventory
 * @property {string} currentLocation
 */