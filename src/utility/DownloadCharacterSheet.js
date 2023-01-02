import { PDFDocument } from 'pdf-lib'
import template_path from './CharacterSheet.pdf'

// const reader = new FileReader()

const checkbox_map = {
    // For "saving throws"
    "successes_1":   "Check Box 12",
    "successes_2":   "Check Box 13",
    "successes_3":   "Check Box 14",
    
    "failures_1":    "Check Box 15",
    "failures_2":    "Check Box 16",
    "failures_3":    "Check Box 17",

    "Acrobatics":    "Check Box 23",
    "Animal":        "Check Box 24",
    "Arcana":        "Check Box 25",
    "Athletics":     "Check Box 26",
    "Deception":     "Check Box 27",
    "History":       "Check Box 28",
    "Insight":       "Check Box 29",
    "Intimidation":  "Check Box 30",
    "Investigation": "Check Box 31",
    "Medicine":      "Check Box 32",
    "Nature":        "Check Box 33",
    "Perception":    "Check Box 34",
    "Performance":   "Check Box 35",
    "Persuasion":    "Check Box 36",
    "Religion":      "Check Box 37",
    "SleightofHand": "Check Box 38",
    "Stealth":       "Check Box 39",
    "Survival":      "Check Box 40",

    "Strength":      "Check Box 11",
    "Dexterity":     "Check Box 18",
    "Constitution":  "Check Box 19",
    "Intelligence":  "Check Box 20",
    "Wisdom":        "Check Box 21",
    "Charisma":      "Check Box 22",
}

export async function downloadPDF(player_name='', character={}){
    let template = null

    try {
        let { 
            name='',
            // image='',
            // created='',
            current:{
                health=0,
                maxHealth=0,
                armorClass=0,
                initiative=0,
                speed=30,
                experience=1,
                // gold= 0
            }={},
            savingThrows:{
                strength:strengthST=0,
                dexterity:dexterityST=0,
                constitution:constitutionST=0,
                intelligence:intelligenceST=0,
                wisdom:wisdomST=0,
                charisma:charismaST=0
            }={},
            stats:{
                inspiration=0,
                proficienyBonus=0,
                passiveWisdom=0,
                
                strength=0,
                strengthAdd=0,
                dexterity=0,
                dexterityAdd=0,
                constitution=0,
                constitutionAdd=0,
                intelligence=0,
                intelligenceAdd=0,
                wisdom=0,
                wisdomAdd=0,
                charisma=0,
                charismaAdd=0,

                acrobatics=0,
                animalHandling=0,
                arcana=0,
                athletics=0,
                deception=0,
                history=0,
                insight=0,
                intimidation=0,
                investigation=0,
                medicine=0,
                nature=0,
                perception=0,
                performance=0,
                persuasion=0,
                religion=0,
                sleightOfHand=0,
                stealth=0,
                survival=0
            }={},
            features: {
                class:_class="",
                race="",
                background="",
                alignment="",
                personalityTraits="",
                age="",
                height="",
                weight="",
                eyes="",
                skin="",
                hair="",
                backstory="",
                additionalFeatures="",
                ideals="",
                bonds="",
                flaws="",
                languagesKnown=[]
            }={},
        } = character

        let response = await fetch(template_path)
        if(response.ok){ template = await response.arrayBuffer() }
    
        const PDF = await PDFDocument.load(template)
        const form = PDF.getForm()
    
        // In dev, you can list all the available field names as such:
        // let names = form.getFields()
        // names = names.map(row => {
        //     return row.getName()
        // })
        // console.log({ names })

        // Page 0 Header Fields
        form.getTextField('ClassLevel').setText( String(_class) ) // + ' | Lvl ' + String(Math.floor(experience/1000)+1) 
        form.getTextField('Background').setText( String(background) )
        form.getTextField('PlayerName').setText( String(player_name) )
        form.getTextField('CharacterName').setText( String(name) )
        form.getTextField('Race ').setText( String(race) )
        form.getTextField('Alignment').setText( String(alignment) )
        form.getTextField('XP').setText( String(experience) )

        // page 0 Stats Column
        form.getTextField('STR').setText( String(strengthAdd) )
        form.getTextField('CON').setText( String(constitutionAdd) )
        form.getTextField('DEX').setText( String(dexterityAdd) )
        form.getTextField('WIS').setText( String(wisdomAdd) )
        form.getTextField('CHA').setText( String(charismaAdd) )
        form.getTextField('INT').setText( String(intelligenceAdd) )

        // Page 0 Stats Modifiers Column
        form.getTextField('STRmod').setText(  String(strength) )
        form.getTextField('CONmod').setText(  String(constitution) )
        form.getTextField('DEXmod ').setText( String(dexterity) )
        form.getTextField('WISmod').setText(  String(wisdom) )
        form.getTextField('CHamod').setText(  String(charisma) )
        form.getTextField('INTmod').setText(  String(intelligence) )

        // Page 0 Stats Modifiers Column
        form.getTextField('ST Strength').setText( String(strengthST===0?'':strengthST) )
        form.getTextField('ST Constitution').setText( String(constitutionST===0?'':constitutionST) )
        form.getTextField('ST Dexterity').setText( String(dexterityST===0?'':dexterityST) )
        form.getTextField('ST Wisdom').setText( String(wisdomST===0?'':wisdomST) )
        form.getTextField('ST Charisma').setText( String(charismaST===0?'':charismaST) )
        form.getTextField('ST Intelligence').setText( String(intelligenceST===0?'':intelligenceST) )
        
        // Page 0 Secondary skills column
        if(acrobatics !== 0){
            form.getCheckBox(checkbox_map['Acrobatics']).check()
            form.getTextField('Acrobatics').setText( String(acrobatics) )
        }
        if(animalHandling !== 0){
            form.getCheckBox(checkbox_map['Animal']).check()
            form.getTextField('Animal').setText( String(animalHandling) )
        }
        if(arcana !== 0){
            form.getCheckBox(checkbox_map['Arcana']).check()
            form.getTextField('Arcana').setText( String(arcana) )
        }
        if(athletics !== 0){
            form.getCheckBox(checkbox_map['Athletics']).check()
            form.getTextField('Athletics').setText( String(athletics) )
        }
        if(deception !== 0){
            form.getCheckBox(checkbox_map['Deception']).check()
            form.getTextField('Deception ').setText( String(deception) )
        }
        if(history !== 0){
            form.getCheckBox(checkbox_map['History']).check()
            form.getTextField('History ').setText( String(history) )
        }
        if(insight !== 0){
            form.getCheckBox(checkbox_map['Insight']).check()
            form.getTextField('Insight').setText( String(insight) )
        }
        if(intimidation !== 0){
            form.getCheckBox(checkbox_map['Intimidation']).check()
            form.getTextField('Intimidation').setText( String(intimidation) )
        }
        if(investigation !== 0){
            form.getCheckBox(checkbox_map['Investigation']).check()
            form.getTextField('Investigation ').setText( String(investigation) )
        }
        if(medicine !== 0){
            form.getCheckBox(checkbox_map['Medicine']).check()
            form.getTextField('Medicine').setText( String(medicine) )
        }
        if(nature !== 0){
            form.getCheckBox(checkbox_map['Nature']).check()
            form.getTextField('Nature').setText( String(nature) )
        }
        if(perception !== 0){
            form.getCheckBox(checkbox_map['Perception']).check()
            form.getTextField('Perception ').setText( String(perception) )
        }
        if(performance !== 0){
            form.getCheckBox(checkbox_map['Performance']).check()
            form.getTextField('Performance').setText( String(performance) )
        }
        if(persuasion !== 0){
            form.getCheckBox(checkbox_map['Persuasion']).check()
            form.getTextField('Persuasion').setText( String(persuasion) )
        }
        if(religion !== 0){
            form.getCheckBox(checkbox_map['Religion']).check()
            form.getTextField('Religion').setText( String(religion) )
        }
        if(sleightOfHand !== 0){
            form.getCheckBox(checkbox_map['SleightofHand']).check()
            form.getTextField('SleightofHand').setText( String(sleightOfHand) )
        }
        if(stealth !== 0){
            form.getCheckBox(checkbox_map['Stealth']).check()
            form.getTextField('Stealth ').setText( String(stealth) )
        }
        if(survival !== 0){
            form.getCheckBox(checkbox_map['Survival']).check()
            form.getTextField('Survival').setText( String(survival) )
        }

        form.getTextField('Inspiration').setText( String(inspiration) )
        form.getTextField('ProfBonus').setText( String(proficienyBonus) )
        form.getTextField('Passive').setText( String(passiveWisdom) )

        // Page 0 center column
        form.getTextField('AC').setText( String(armorClass) )
        form.getTextField('Initiative').setText( String(initiative) )
        form.getTextField('Speed').setText( String(speed) )
        form.getTextField('HPMax').setText( String(maxHealth) )
        form.getTextField('HPCurrent').setText( String(health) )
    
        // Page 0 right column for personality (I chose to skip this!)
        form.getTextField('PersonalityTraits ').setText( String(personalityTraits) )
        form.getTextField('Ideals').setText( String(ideals) )
        form.getTextField('Bonds').setText( String(bonds) )
        form.getTextField('Flaws').setText( String(flaws) )

        // Page 0 final fields
        form.getTextField('ProficienciesLang').setText( String(languagesKnown) )
        // form.getTextField('Equipment').setText( `${gold} Gold` )

        // Page 1 header
        form.getTextField('CharacterName 2').setText( String(name) )
        form.getTextField('Age').setText( String(age) )
        form.getTextField('Eyes').setText( String(eyes) )
        form.getTextField('Height').setText( String(height) )
        form.getTextField('Weight').setText( String(weight) )
        form.getTextField('Skin').setText( String(skin) )
        form.getTextField('Hair').setText( String(hair) )

        // Page 1 Main Fields 
        form.getTextField('Backstory').setText( String(backstory) )
        form.getTextField('Feat+Traits').setText( String(additionalFeatures) )

        const bytes = await PDF.save()
    
        // console.log(bytes)
        downloadBlob(bytes, 'character_sheet.pdf', 'application/octet-stream');
    } catch(e){ console.log(e) }
}

export async function importPDF(FileAsArrayBuffer){
    let name='',
        image='',
        health=0,
        maxHealth=0,
        armorClass=0,
        speed=30,
        experience=1,
        strengthST=0,
        dexterityST=0,
        constitutionST=0,
        intelligenceST=0,
        wisdomST=0,
        charismaST=0,
        inspiration=0,
        proficienyBonus=0,
        passiveWisdom=0,

        strength=0,
        strengthAdd=0,
        dexterity=0,
        dexterityAdd=0,
        constitution=0,
        constitutionAdd=0,
        intelligence=0,
        intelligenceAdd=0,
        wisdom=0,
        wisdomAdd=0,
        charisma=0,
        charismaAdd=0,

        acrobatics=0,
        animalHandling=0,
        arcana=0,
        athletics=0,
        deception=0,
        history=0,
        insight=0,
        intimidation=0,
        investigation=0,
        medicine=0,
        nature=0,
        perception=0,
        performance=0,
        persuasion=0,
        religion=0,
        sleightOfHand=0,
        stealth=0,
        survival=0,

        _class="",
        race="",
        background="",
        alignment="",
        personalityTraits="",
        age="",
        height="",
        weight="",
        eyes="",
        skin="",
        hair="",
        backstory="",
        additionalFeatures="",
        ideals="",
        bonds="",
        flaws="",
        languagesKnown=''

    try {
        const PDF = await PDFDocument.load(FileAsArrayBuffer)
        const form = PDF.getForm()

        function importField(field, def=''){
            try{
                let s = (form.getTextField('').getText())||def
                if(typeof def === 'number'){ return parseNumber(s) }
                return s
            } catch(e){
                console.log(`Unable to import '${field}':`, e)
                return def
            }
        }

        // Page 0 Header Fields
        name = importField('CharacterName', '')
        _class = importField('ClassLevel', '')
        background = importField('Background', '')
        race = importField('Race ', '')
        alignment = importField('Alignment', '')
        experience = importField('XP', 0)

        // page 0 Stats Column
        strengthAdd = importField('STR', 0)
        constitutionAdd = importField('CON', 0)
        dexterityAdd = importField('DEX', 0)
        wisdomAdd = importField('WIS', 0)
        charismaAdd = importField('CHA', 0)
        intelligenceAdd = importField('INT', 0)

        // Page 0 Stats Modifiers Column
        strength = importField('STRmod', 0)
        constitution = importField('CONmod', 0)
        dexterity = importField('DEXmod ', 0)
        wisdom = importField('WISmod', 0)
        charisma = importField('CHamod', 0)
        intelligence = importField('INTmod', 0)

        // Page 0 Stats Modifiers Column
        strengthST = importField('ST Strength', 0)
        constitutionST = importField('ST Constitution', 0)
        dexterityST = importField('ST Dexterity', 0)
        wisdomST = importField('ST Wisdom', 0)
        charismaST = importField('ST Charisma', 0)
        intelligenceST = importField('ST Intelligence', 0)
        
        // Page 0 Secondary skills column
        acrobatics = importField('Acrobatics', 0)
        animalHandling = importField('Animal', 0)
        arcana = importField('Arcana', 0)
        athletics = importField('Athletics', 0)
        deception = importField('Deception ', 0)
        history = importField('History ', 0)
        insight = importField('Insight', 0)
        intimidation = importField('Intimidation', 0)
        investigation = importField('Investigation ', 0)
        medicine = importField('Medicine', 0)
        nature = importField('Nature', 0)
        perception = importField('Perception ', 0)
        performance = importField('Performance', 0)
        persuasion = importField('Persuasion', 0)
        religion = importField('Religion', 0)
        sleightOfHand = importField('SleightofHand', 0)
        stealth = importField('Stealth ', 0)
        survival = importField('Survival', 0)

        inspiration = importField('Inspiration', 0)
        proficienyBonus = importField('ProfBonus', 0)
        passiveWisdom = importField('Passive', 0)

        // Page 0 center column
        armorClass = importField('AC', 10)
        speed = importField('Speed', 30)
        maxHealth = importField('HPMax', 30)
        health = importField('HPCurrent', 30)
    
        // Page 0 right column
        personalityTraits = importField('PersonalityTraits ', '')
        ideals = importField('Ideals', '')
        bonds = importField('Bonds', '')
        flaws = importField('Flaws', '')

        // Page 0 final fields
        languagesKnown = importField('ProficienciesLang', '')

        // Page 1 header
        age = importField('Age', '')
        eyes = importField('Eyes', '')
        height = importField('Height', '')
        weight = importField('Weight', '')
        skin = importField('Skin', '')
        hair = importField('Hair', '')

        // Page 1 Main Fields 
        backstory = importField('Backstory', '')
        additionalFeatures = importField('Feat+Traits', '')

        return { 
            name,
            image,
            created: new Date().toISOString(),
            current:{
                health,
                maxHealth,
                armorClass,
                initiative: 0,
                speed,
                experience,
                gold: 0
            },
            savingThrows:{
                strength: strengthST,
                dexterity: dexterityST,
                constitution: constitutionST,
                intelligence: intelligenceST,
                wisdom: wisdomST,
                charisma: charismaST
            },
            stats:{
                inspiration,
                proficienyBonus,
                passiveWisdom,
                
                strength,
                strengthAdd,
                dexterity,
                dexterityAdd,
                constitution,
                constitutionAdd,
                intelligence,
                intelligenceAdd,
                wisdom,
                wisdomAdd,
                charisma,
                charismaAdd,

                acrobatics,
                animalHandling,
                arcana,
                athletics,
                deception,
                history,
                insight,
                intimidation,
                investigation,
                medicine,
                nature,
                perception,
                performance,
                persuasion,
                religion,
                sleightOfHand,
                stealth,
                survival
            },
            features: {
                class:_class,
                race,
                background,
                alignment,
                personalityTraits,
                age,
                height,
                weight,
                eyes,
                skin,
                hair,
                backstory,
                additionalFeatures,
                ideals,
                bonds,
                flaws,
                languagesKnown
            },
        }
    } catch(e){ console.log(e) }
}

function parseNumber(text){
    let n = parseInt(text)
    if(isNaN(n)){ return 0 }
    return text;
}

function downloadBlob(data, fileName, mimeType) {
    var blob, url;
    blob = new Blob([data], {
      type: mimeType
    });
    url = window.URL.createObjectURL(blob);
    function downloadURL(data, fileName) {
        var a;
        a = document.createElement('a');
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
    };
    downloadURL(url, fileName);
    setTimeout(function() {
      return window.URL.revokeObjectURL(url);
    }, 1000);
};