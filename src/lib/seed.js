// Thematic pools used to nudge Claude toward varied output.
// These are HINTS, not requirements — the model is told it can adapt or ignore.

const POOLS = {
  material: [
    'blackened iron', 'ancient bone', 'stormglass', 'witchwood', 'dragonbone',
    'weathered brass', 'tarnished silver', 'moonsilver', 'runed obsidian',
    'ember-forged steel', 'frostbitten oak', 'bog iron', 'mummified hide',
    'crystalline shard', 'charred stone', 'gilded copper', 'cracked vellum',
    'woven shadow', 'hardened leather', 'petrified wood',
  ],
  motif: [
    "a fallen king's sigil", 'the eye of a forgotten god', 'a coiled serpent',
    "a wolf's head", 'a broken crown', 'runes of binding', 'a single tear',
    'a closed fist', 'a rising sun', 'a setting moon', 'three crossed daggers',
    'a screaming face', 'a quiet flame', 'an open hand', 'a chained beast',
    'spilled wine', 'a withered tree', 'crossed bones', 'an unblinking eye',
    'a heart pierced',
  ],
  era: [
    'forged before the Witch Lord wars', 'recovered from the Drowned Kingdoms',
    'a relic of the Mage College of Mirror',
    'carried by a hero who never returned from Kellar\'s Keep',
    'looted from an Ogre warlord', 'gifted by an exiled chaos wizard',
    'pulled from the rubble of a fallen tower',
    'inherited from a guildmaster long dead', 'found beneath the Dread Moon',
    'offered up at a forgotten shrine', 'abandoned in a crypt',
    "claimed from the Witch Lord's hoard", 'given by a halfling diplomat',
    'wielded once by a Telorian knight',
    'traded from a Delthrak jungle tribe',
  ],
  foe: [
    'effective against Orcs', 'effective against Goblins',
    'effective against the undead', 'effective against Chaos Warriors',
    'effective against Ogres', 'effective against Fimir',
    'effective against beasts and wolves', 'effective against spellcasters',
    "effective against the Witch Lord's servants", 'bane of dragonkind',
  ],
  element: [
    'ash', 'frost', 'lightning', 'shadow', 'holy light', 'deep earth',
    'blood', 'mist', 'thunder', 'starlight',
  ],
  twist: [
    'triggers when the wielder is below half Body Points',
    'only works on the first attack of combat',
    'requires line of sight to function',
    'costs a Mind Point to activate',
    'glows when monsters are near',
    'breaks after a single use',
    'recharges between quests',
    'effect resolved by a die roll',
    'weakens after multiple activations',
    'works only when an ally is adjacent',
  ],
}

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function generateVarietySeed() {
  const axes = Object.keys(POOLS)
  const shuffled = [...axes].sort(() => Math.random() - 0.5)
  const count = 2 + Math.floor(Math.random() * 2) // 2 or 3
  const picked = shuffled.slice(0, count)
  return picked.map(axis => `${axis}: ${pickOne(POOLS[axis])}`).join('; ')
}
