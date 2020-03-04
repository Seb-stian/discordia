const fs = require('fs');
const fama = require('fama');

/**
 * 
 * @param {string} adventureName
 * @returns {import('./adventure-types').Adventure}
 */
function loadAdventure(adventureName) {
    const path = `adventures/${adventureName}/adventure.json`;
    if (!fs.existsSync(`./${path}`)) {
        throw new Error(`missing file ${path}`);
    }

    /**
     * @type {import('./adventure-types').Adventure}
     */
    let adventure;
    try {
        adventure = parseFile(`./${path}`);
    }
    catch (e) {
        throw new Error(`${path} couldn't be parsed`);
    }

    /* Adventure name */
    if (typeof adventure['name'] !== 'string') {
        throw new Error(`${path} must contain string "name"`);
    }

    /* Adventure locations */
    if (typeof adventure['locations'] === 'string') {
        const locationsPath = `adventures/${adventureName}/${adventure['locations']}`;
        if (fs.existsSync(`./${locationsPath}`)) {
            let locations;
            try {
                locations = parseFile(`./${locationsPath}`).locations;
            }
            catch (e) {
                throw new Error(`${locationsPath} couldn't be parsed`);
            }
            if (!Array.isArray(locations)) {
                throw new Error(`${locationsPath} must contain an array "locations"`);
            }
            adventure['locations'] = locations;
        }
    }
    else if (!Array.isArray(adventure['locations'])) {
        throw new Error(`${path} must contain an array "locations" or path to separated json file with it`);
    }

    for (let i = 0; i < adventure['locations'].length; i++) {
        if (!validateLocation(adventure['locations'][i])) {
            adventure['locations'].splice(i--, 1);
        }
    }

    if (adventure['locations'].length < 1) {
        throw new Error(`There must be at least one adventure location!`);
    }

    /* if these are in separated files, they will be extracted, when failed returns an empty array */
    /* this is not being done with locations, because there must be at least one location */
    adventure['enemies'] = getPossiblySeparated(adventureName, adventure, 'enemies');
    adventure['npcs'] = getPossiblySeparated(adventureName, adventure, 'npcs');
    adventure['quests'] = getPossiblySeparated(adventureName, adventure, 'quests');
    adventure['items'] = getPossiblySeparated(adventureName, adventure, 'items');

    /* filters out invalid items, if any */
    adventure['enemies'] = adventure['enemies'].filter(enemy => validateEnemy(enemy));
    adventure['npcs'] = adventure['npcs'].filter(npc => validateNpc(npc));
    adventure['quests'] = adventure['quests'].filter(quest => validateQuest(quest));
    adventure['items'] = adventure['items'].filter(item => validateItem(item));

    /* Adventure starting location */
    if (typeof adventure['startingLocation'] !== 'string' || !adventure['locations'].some(location => location.name === adventure['startingLocation'])) {
        if (typeof adventure['startingLocation'] !== 'undefined') {
            fama.warn(`There is no location '${adventure['startingLocation']}'. Defaults to ${adventure['locations'][0].name}.`);
        }
        adventure['startingLocation'] = adventure['locations'][0].name;
    }

    /* Adventure starting items */
    if (!Array.isArray(adventure['startingItems'])) {
        if (typeof adventure['startingItems'] !== 'undefined') {
            fama.warn(`${adventure['startingItems']} is not a valid value for starting items. Defaults to empty.`);
        }
        adventure['startingItems'] = [];
    }
    validateStartingItems(adventure['startingItems']); // filters out invalid items

    return adventure;
}
module.exports = loadAdventure;

function parseFile(path) {
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
}

/**
 * @param {string} adventureName
 * @param {import('./adventure-types').Adventure} adventure 
 * @param {string} name
 * @returns {Array<*>}
 */
function getPossiblySeparated(adventureName, adventure, name) {
    if (Array.isArray(adventure[name])) {
        return adventure[name];
    }
    
    if (typeof adventure[name] !== 'string') {
        fama.warn(`${adventure[name]} is not a valid value for adventure ${name}. Defaults to empty.`);
        return [];
    }

    const path = `./adventures/${adventureName}/${adventure[name]}`;
    if (!fs.existsSync(path)) {
        fama.warn(`${path} doesn't exist. Adventure ${name} defaults to empty.`);
        return [];
    }

    let any;
    try {
        any = parseFile(path);
    }
    catch (e) {
        fama.warn(`${path} couldn't be parsed. Defaults to empty.`);
        return [];
    }

    if (!Array.isArray(any[name])) {
        fama.warn(`${path} doesn't contain an array called ${name}. Defaults to empty.`);
        return [];
    }

    return any[name];
}

/**
 * @param {import('./adventure-types').Location} location
 * @returns {boolean} 
 */
function validateLocation(location) {
    if (typeof location['name'] !== 'string') {
        fama.warn(`${location['name']} is not a valid location name. Location ignored.`);
        return false;
    }

    if (typeof location['description'] !== 'string') {
        fama.warn(`${location['description']} is not a valid location description. Defaulting to empty.`);
        location['description'] = '';
    }

    if (typeof location['friendly'] !== 'boolean') {
        fama.warn(`${location['friendly']} must be a boolean. Location ignored.`);
        return false;
    }

    if (typeof location['condition'] !== 'string') {
        if (typeof location['condition'] !== 'undefined') {
            fama.warn(`${location['condition']} is not a valid condition. It will be ignored.`);
        }
        location['condition'] = null;
    }

    if (!Array.isArray(location['entities'])) {
        if (typeof location['entities'] !== 'undefined') {
            fama.warn(`Location entities must be an array. Entities will be ignored.`);
        }
        location['entities'] = [];
    }

    const expectedEntityType = location['friendly'] ? 'string' : 'object';
    for (let i = 0; i < location['entities'].length; i++) {
        const entity = location['entities'][i];
        if (typeof entity !== expectedEntityType) {
            fama.warn(`When location.friendly is ${location['friendly']}, entities must be of type ${expectedEntityType}. Entity ${entity} ignored.`);
            location['entities'].splice(i--, 1);
        }
        else if (expectedEntityType === 'object' && !validateEntity(entity)) {
            location['entities'].splice(i--, 1);
        }
    }

    if (!Array.isArray(location['leadsTo'])) {
        if (typeof location['leadsTo'] !== 'undefined') {
            fama.warn(`${location['leadsTo']} is not a valid value for location leadsTo. Array of location names was expected. Defaulting to empty.`);
        }
        location['leadsTo'] = [];
    }

    return true;
}

/**
 * @param {import('./adventure-types').Entity} entity
 * @returns {boolean}
 */
function validateEntity(entity) {
    if (typeof entity['name'] !== 'string') {
        fama.warn(`${entity['name']} is not a valid entity name. Entity will be ignored.`);
        return false;
    }

    if (typeof entity['chance'] !== 'number') {
        fama.warn(`${entity['chance']} is not a valid entity chance. Entity will be ignored.`);
        return false;
    }

    if (entity['chance'] <= 0) {
        fama.warn(`${entity['chance']} is too low for entity chance. Expected range is 0.1-100. Entity will be ignored.`);
        return false;
    }
    else if (entity['chance'] > 100) {
        fama.warn(`${entity['chance']} is too high for entity chance. Defaulting to 100.`);
        entity['chance'] = 100;
    }

    return true;
}

/**
 * @param {import('./adventure-types').Enemy} enemy
 * @returns {boolean} 
 */
function validateEnemy(enemy) {
    if (typeof enemy['name'] !== 'string') {
        fama.warn(`${enemy['name']} is not a valid enemy name. Enemy will be ignored.`);
        return false;
    }

    if (typeof enemy['health'] !== 'number') {
        fama.warn(`${enemy['health']} is not a valid enemy health. Enemy will be ignored.`);
        return false;
    }

    if (enemy['health'] <= 0) {
        fama.warn(`${enemy['health']} is too low for enemy health. Enemy will be ignored.`);
        return false;
    }

    if (typeof enemy['attack'] !== 'number') {
        fama.warn(`${enemy['attack']} is not a valid enemy attack. Enemy will be ignored.`);
        return false;
    }

    if (enemy['attack'] <= 0) {
        fama.warn(`${enemy['attack']} is too low for enemy attack. Enemy will be ignored.`);
        return false;
    }

    if (typeof enemy['condition'] !== 'string') {
        if (typeof enemy['condition'] !== 'undefined') {
            fama.warn(`${enemy['condition']} is not valid condition. It will be ignored.`);
        }
        enemy['condition'] = null;
    }

    if (!Array.isArray(enemy['drops'])) {
        if (typeof enemy['drops'] !== 'undefined') {
            fama.warn(`${enemy[drops]} is not a valid value for enemy drops. Defaults to empty.`);
        }
        enemy['drops'] = [];
    }

    for (let i = 0; i < enemy['drops'].length; i++) {
        const drop = enemy['drops'][i];
        if (typeof drop === 'string') {
            enemy['drops'][i] = {
                name: drop,
                amount: 1
            };
        }
        else if (typeof drop === 'object' && !Array.isArray(drop)) {
            if (typeof drop['name'] !== 'string') {
                fama.warn(`${drop['name']} is not a valid enemy drop name. Drop will be ignored.`);
                enemy['drops'].splice(i--, 1);
            }
            else if ((typeof drop['chance'] !== 'string') === (typeof drop['amount'])) {
                fama.warn(`Enemy drop ${drop['name']} cannot be differentiated between Entity and ItemCollection. Drop will be ignored.`);
                enemy['drops'].splice(i--, 1);
            }
        }
        else {
            fama.warn(`${drop} is not a valid enemy drop. Drop will be ignored.`);
            enemy['drops'].splice(i--, 1);
        }
    }

    return true;
}

/**
 * @param {import('./adventure-types').NPC} npc
 * @returns {boolean} 
 */
function validateNpc(npc) {
    if (typeof npc['name'] !== 'string' || npc['name'].length === 0) {
        fama.warn(`'${npc['name']}' is not a valid NPC name. NPC will be ignored.`);
        return false;
    }

    if (typeof npc['dialog'] !== 'object' || Array.isArray(npc['dialog']) || !validateDialog(npc['dialog'])) {
        npc['dialog'] = null;
    }

    if (typeof npc['condition'] !== 'string') {
        if (typeof npc['condition'] !== 'undefined') {
            fama.warn(`${npc['condition']} is not a valid condition. It will be ignored.`);
        }
        npc['condition'] = null;
    }

    if (!Array.isArray(npc['buy'])) {
        npc['buy'] = [];
    }
    else {
        npc['buy'] = npc['buy'].filter(itemName => {
            if (typeof itemName !== 'string') {
                fama.warn(`${itemName} is not a valid item name. It will be ignored.`);
                return false;
            }
            return true;
        });
    }

    if (!Array.isArray(npc['sell'])) {
        npc['sell'] = [];
    }
    else {
        npc['sell'] = npc['sell'].filter(itemName => {
            if (typeof itemName !== 'string') {
                fama.warn(`${itemName} is not a valid item name. It will be ignored.`);
                return false;
            }
            return true;
        });
    }

    if (npc['dialog'] == null && npc['buy'].length === 0 && npc['sell'] === 0) {
        fama.warn(`NPC '${npc['name']}' has no dialog and is not buying/selling anything. NPC will be ignored.`);
        return false;
    }

    return true;
}

/**
 * @param {import('./adventure-types').Dialog} dialog
 * @returns {boolean}
 */
function validateDialog(dialog) {
    if (typeof dialog !== 'object' || Array.isArray(dialog)) {
        return false;
    }

    if (!Array.isArray(dialog['options'])) {
        fama.warn(`${dialog['options']} is not a valid value for dialog options. Dialog will be ignored.`);
        return false;
    }

    if (typeof dialog['text'] !== 'string') {
        if (typeof dialog['text'] !== 'undefined') {
            fama.warn(`${dialog['text']} is not a valid dialog text. Defaults to empty.`);
        }
        dialog['text'] = '';
    }

    if (typeof dialog['condition'] !== 'string') {
        if (typeof dialog['condition'] !== 'undefined') {
            fama.warn(`${dialog['condition']} is not a valid condition. It will be ignored.`);
        }
        dialog['condition'] = null;
    }

    for (let i = 0; i < dialog['options'].length; i++) {
        if (!validateDialogOption(dialog['options'][i])) {
            dialog['options'].splice(i--, 1);
        }
    }

    if (dialog['options'].length < 1) {
        fama.warn(`Dialog options must contain at least one option. Dialog will be ignored.`);
        return false;
    }

    return true;
}

/**
 * @param {import('./adventure-types').DialogOption} option
 * @returns {boolean} 
 */
function validateDialogOption(option) {
    if (typeof option !== 'object' || Array.isArray(option)) {
        fama.warn();
        return false;
    }
    
    if (typeof option['text'] !== 'string') {
        fama.warn(`${option['text']} is not a valid dialog option text. Option will be ignored.`);
        return false;
    }

    if (typeof option['condition'] !== 'string') {
        if (typeof option['condition'] !== 'undefined') {
            fama.warn(`${option['condition']} is not a valid condition. It will be ignored.`);
        }
        option['condition'] = null;
    }

    if (typeof option['command'] !== 'string') {
        if (typeof option['command'] !== 'undefined') {
            fama.warn(`${option['command']} is not a valid command. It will be ignored.`);
        }
        option['command'] = null;
    }

    if (!validateDialog(option['dialog'])) {
        option['dialog'] = null;
    }
    
    return true;
}

/**
 * @param {import('./adventure-types').Quest} quest
 * @returns {boolean} 
 */
function validateQuest(quest) {
    if (typeof quest !== 'object' || Array.isArray(quest)) {
        fama.warn(`${quest} is not a valid quest value. It will be ignored.`);
        return false;
    }

    if (typeof quest['name'] !== 'string') {
        fama.warn(`${quest['name']} is not a valid quest name. Quest will be ignored.`);
        return false;
    }

    if (typeof quest['tag'] !== 'string') {
        fama.warn(`${quest['tag']} is not a valid quest tag. Quest will be ignored.`);
        return false;
    }

    if (typeof quest['type'] !== 'string') {
        fama.warn(`${quest['type']} is not a valid quest type. Quest will be ignored.`);
        return false;
    }

    switch (quest['type']) {
        case 'kill':
        case 'gather':
            if (!validateQuestObjective(quest['targets'], quest['amount'], quest)) {
                return false;
            }
            break;

        default:
            fama.warn(`Invalid quest type ${quest['type']}. Quest will be ignored.`);
            return false;
    }

    if (typeof quest['description'] !== 'string') {
        if (typeof quest['description'] !== 'undefined') {
            fama.warn(`${quest['description']} is not a valid quest description. Defaults to empty.`);
        }
        quest['description'] = '';
    }

    if (typeof quest['repeatable'] !== 'boolean') {
        if (typeof quest['repeatable'] !== 'undefined') {
            fama.warn(`${quest['repeatable']} is not a valid value for quest repeatable. Defaults to false.`);
        }
        quest['repeatable'] = false;
    }

    if (typeof quest['autocomplete'] !== 'boolean') {
        if (typeof quest['autocomplete'] !== 'undefined') {
            fama.warn(`${quest['autocomplete']} is not a valid value for quest autocomplete. Defaults to true.`);
        }
        quest['autocomplete'] = true;
    }

    if (!Array.isArray(quest['rewards'])) {
        fama.warn(`${quest['rewards']} is not a valid value for quest rewards. Defaults to empty.`);
        quest['rewards'] = [];
    }

    for (let i = 0; i < quest['rewards'].length; i++) {
        const reward = quest['rewards'][i];
        if (typeof reward === 'object' && !Array.isArray(reward)) {
            if (typeof reward['name'] !== 'string') {
                fama.warn(`${reward['name']} is not a valid reward name. Reward will be ignored.`);
                quest['rewards'].splice(i--, 1);
            }
            else if (typeof reward['amount'] !== 'number') {
                if (typeof reward['amount'] !== 'undefined') {
                    fama.warn(`${reward['amount']} is not a valid reward amount. Defaults to 1.`);
                }
                reward['amount'] = 1;
            }
            else if (reward['amount'] < 0) {
                fama.warn(`${reward['amount']} is too low for reward amount. Defaults to 0.`);
                reward['amount'] = 0;
            }
        }
        else if (typeof reward !== 'string') {
            fama.warn(`${reward} is not a valid value for quest reward. It will be ignored.`);
            quest['rewards'].splice(i--, 1);
        }
    }

    return true;
}

/**
 * @param {Array<string>} targets 
 * @param {number} amount
 * @returns {boolean}
 */
function validateQuestObjective(targets, amount, quest) {
    if (!Array.isArray(targets)) {
        fama.warn(`${targets} is not a valid value for quest targets. Quest will be ignored.`);
        return false;
    }

    for (let i = 0; i < targets.length; i++) {
        if (typeof targets[i] !== 'string') {
            fama.warn(`${targets[i]} is not a valid quest target. Target will be ignored.`);
            targets.splice(i--, 1);
        }
    }

    if (targets.length < 1) {
        fama.warn('There must be at least one valid quest target. Quest will be ignored.');
        return false;
    }

    if (typeof amount !== 'number') {
        if (typeof amount !== 'undefined') {
            fama.warn(`${amount} is not a valid quest target amount. Defaults to 1.`);
        }
        quest['amount'] = 1;
    }

    return true;
}

/**
 * @param {import('./adventure-types').Item} item
 * @returns {boolean} 
 */
function validateItem(item) {
    if (typeof item !== 'object' || Array.isArray(item)) {
        fama.warn(`${item} is not a valid item. It will be ignored.`);
        return false;
    }

    if (typeof item['name'] !== 'string') {
        fama.warn(`${item['name']} is not a valid item name. Item will be ignored.`);
        return false;
    }

    if (typeof item['type'] !== 'string') {
        fama.warn(`${item['type']} is not a valid item type. Item will be ignored.`);
        return false;
    }

    switch (item['type']) {
        case 'weapon':
        case 'helmet':
        case 'chestplate':
        case 'gloves':
        case 'shoes':
        case 'accesory':
            if (!Array.isArray(item['bonuses'])) {
                if (typeof item['bonuses'] !== 'undefined') {
                    fama.warn(`${item['bonuses']} is not a valid value for item bonuses. Defaults to empty.`);
                }
                item['bonuses'] = [];
            }
            else {
                validateBonuses(item['bonuses']);
            }
        
        case 'usable':

            if (typeof item['strength'] !== 'number') {
                fama.warn(`${item['strength']} is not a valid value for item strength. Item will be ignored.`);
                return false;
            }

            if (typeof item['minLevel'] !== 'number') {
                if (typeof item['minLevel'] !== 'undefined') {
                    fama.warn(`${item['minLevel']} is not a valid value for item minLevel. Defaults to 0.`);
                }
                item['minLevel'] = 0;
            }

        case 'ingredient':

            if (typeof item['value'] !== 'number') {
                fama.warn(`${item['value']} is not a valid item value. Item will be ignored.`);
                return false;
            }

            if (item['value'] < 0) {
                fama.warn('Item value cannot be lower than 0. Defaults to 0.');
                item['value'] = 0;
            }

            break;

        default:
            fama.warn(`${item['type']} is not a valid item type. Item will be ignored.`);
            return false;

    }

    if (typeof item['description'] !== 'string') {
        if (typeof item['description'] !== 'undefined') {
            fama.warn(`${item['description']} is not a valid item description. Defaults to empty.`);
            item['description'] = '';
        }
    }

    if (item['type'] === 'usable') {
        if (typeof item['stat'] !== 'string') {
            fama.warn(`${item['stat']} is not a valid item stat. Item will be ignored.`);
            return false;
        }
        if (item['stat'] === 'health' || item['stat'] === 'mana') {
            if (typeof item['fightCooldown'] !== 'number') {
                if (typeof item['fightCooldown'] !== 'undefined') {
                    fama.warn(`${item['fightCooldown']} is not a valid item fightCooldown. Defaults to 0.`);
                }
                item['fightCooldown'] = 0;
            }
            else if (item['fightCooldown'] < 0) {
                item['fightCooldown'] = 0;
            }
        }
        else if (item['stat'] !== 'xp') {
            fama.warn(`${item['stat']} is not a valid item stat. Item will be ignored.`);
            return false;
        }

        if (typeof item['strength'] !== 'number') {
            fama.warn(`${item['strength']} is not a valid value for item strength. Item will be ignored.`);
            return false;
        }
    }

    return true;
}

/**
 * @param {Array<import('./adventure-types').Bonus>} bonuses
 */
function validateBonuses(bonuses) {
    for (let i = 0; i < bonuses.length; i++) {
        const bonus = bonuses[i];
        if (typeof bonus !== 'object' || Array.isArray(bonus)) {
            fama.warn(`${bonus} is not a valid item bonus. It will be ignored.`);
            bonuses.splice(i--, 1);
            continue;
        }

        switch (bonus['stat']) {
            case 'agility':
            case 'endurance':
            case 'strength':
            case 'wisdom':
                break;

            default:
                fama.warn(`${bonus['stat']} is not a valid bonus type. Bonus will be ignored.`);
                bonuses.splice(i--, 1);
                continue;
        }

        if (typeof bonus['strength'] !== 'number') {
            if (typeof bonus['strength'] !== 'undefined') {
                fama.warn(`${bonus['strength']} is not a valid value for bonus strength. Defaults to 1.`);
            }
            bonus['strength'] = 1;
        }
    }
}

/**
 * @param {Array<string|import('./adventure-types').ItemCollection>} items 
 */
function validateStartingItems(items) {
    for (let i = 0; i < items.length; i++) {
        if (typeof items[i] === 'object' && !Array.isArray(items[i])) {
            if (typeof items[i]['name'] !== 'string') {
                fama.warn(`${items[i]['name']} is not a valid starting item name. Item will be ignored.`);
                items.splice(i--, 1);
            }
            else if (typeof items[i]['amount'] !== 'number') {
                if (typeof items[i]['amount'] !== 'undefined') {
                    fama.warn(`${items[i]['amount']} is not a valid item amount. Defaults to 1.`);
                }
                items[i]['amount'] = 1;
            }
        }
        else if (typeof items[i] !== 'string') {
            fama.warn(`${items[i]} is not a valid starting item. It will be ignored.`);
            items.splice(i--, 1);
        }
    }
}