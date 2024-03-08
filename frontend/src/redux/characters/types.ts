
export type State = {
  current: Character | undefined,
  currentCharacterId: string | undefined,
  hasUnsavedChanges: boolean,
  list: {
    [key: string]: Character
  }
}

export type CharacterDoc = {
  id: string,
  owner: string,
  data: Character,
  created: Date,
  updated: Date
}

export type Character = {
  name: string,
  image: string,
  features: {
    additionalFeatures: string,
    age: string,
    alignment: string,
    background: string,
    backstory: string,
    bonds: string,
    class: string,
    eyes: string,
    flaws: string,
    hair: string,
    height: string,
    ideals: string,
    image: string,
    race: string,
    skin: string,
    weight: string
  },
  savingThrows: {
    charisma: number,
    constitution: number,
    dexterity: number,
    intelligence: number,
    strength: number,
    wisdom: number
  },
  spells: {
    ability: string,
    attackBonus: string,
    class: string,
    saveDC: string
  },
  stats: {
    acrobatics: number,
    animalHandling: number,
    arcana: number,
    athletics: number,
    charisma: number,
    charismaAdd: number,
    constitution:  number,
    constitutionAdd: number,
    deception: number,
    dexterity:  number,
    dexterityAdd: number,
    history: number,
    insight: number,
    inspiration: number,
    intelligence: number,
    intelligenceAdd: number,
    intimidation: number,
    investigation: number,
    medicine: number,
    nature: number,
    passiveWisdom: number,
    perception: number,
    performance: number,
    persuasion: number,
    proficienyBonus: number,
    religion: number,
    sleightOfHand: number,
    stealth: number,
    strength: number,
    strengthAdd: number,
    survival: number,
    wisdom: number,
    wisdomAdd: number
  },
}
