import acorn from 'images/icons/chooseable/acorn.svg'
import applecore from 'images/icons/chooseable/apple-core.svg'
import applewhole from 'images/icons/chooseable/apple-whole.svg'
import award from 'images/icons/chooseable/award.svg'
import axebattle from 'images/icons/chooseable/axe-battle.svg'
import axe from 'images/icons/chooseable/axe.svg'
import baby from 'images/icons/chooseable/baby.svg'
import bandage from 'images/icons/chooseable/bandage.svg'
import bee from 'images/icons/chooseable/bee.svg'
import beermugempty from 'images/icons/chooseable/beer-mug-empty.svg'
import beermug from 'images/icons/chooseable/beer-mug.svg'
import bells from 'images/icons/chooseable/bells.svg'
import biohazard from 'images/icons/chooseable/biohazard.svg'
import blanket from 'images/icons/chooseable/blanket.svg'
import bomb from 'images/icons/chooseable/bomb.svg'
import bonebreak from 'images/icons/chooseable/bone-break.svg'
import bone from 'images/icons/chooseable/bone.svg'
import bong from 'images/icons/chooseable/bong.svg'
import bookbible from 'images/icons/chooseable/book-bible.svg'
import bookblank from 'images/icons/chooseable/book-blank.svg'
import bookmedical from 'images/icons/chooseable/book-medical.svg'
import bookskull from 'images/icons/chooseable/book-skull.svg'
import bowarrow from 'images/icons/chooseable/bow-arrow.svg'
import brain from 'images/icons/chooseable/brain.svg'
import breadloaf from 'images/icons/chooseable/bread-loaf.svg'
import briefcase from 'images/icons/chooseable/briefcase.svg'
import broom from 'images/icons/chooseable/broom.svg'
import bullhorn from 'images/icons/chooseable/bullhorn.svg'
import campfire from 'images/icons/chooseable/campfire.svg'
import capsules from 'images/icons/chooseable/capsules.svg'
import cat from 'images/icons/chooseable/cat.svg'
import cookiebite from 'images/icons/chooseable/cookie-bite.svg'
import corn from 'images/icons/chooseable/corn.svg'
import crown from 'images/icons/chooseable/crown.svg'
import cube from 'images/icons/chooseable/cube.svg'
import duck from 'images/icons/chooseable/duck.svg'
import dumpsterfire from 'images/icons/chooseable/dumpster-fire.svg'
import eggfried from 'images/icons/chooseable/egg-fried.svg'
import envelopes from 'images/icons/chooseable/envelopes.svg'
import featherpointed from 'images/icons/chooseable/feather-pointed.svg'
import flaskroundpoison from 'images/icons/chooseable/flask-round-poison.svg'
import flaskroundpotion from 'images/icons/chooseable/flask-round-potion.svg'
import flask from 'images/icons/chooseable/flask.svg'
import glassesround from 'images/icons/chooseable/glasses-round.svg'
import guitar from 'images/icons/chooseable/guitar.svg'
import gun from 'images/icons/chooseable/gun.svg'
import hammer from 'images/icons/chooseable/hammer.svg'
import helmetbattle from 'images/icons/chooseable/helmet-battle.svg'
import raindrops from 'images/icons/chooseable/raindrops.svg'
import ringswedding from 'images/icons/chooseable/rings-wedding.svg'
import sackdollar from 'images/icons/chooseable/sack-dollar.svg'
import shield from 'images/icons/chooseable/shield.svg'
import skull from 'images/icons/chooseable/skull.svg'
import spider from 'images/icons/chooseable/spider.svg'
import spoon from 'images/icons/chooseable/spoon.svg'
import swords from 'images/icons/chooseable/swords.svg'
import treasurechest from 'images/icons/chooseable/treasure-chest.svg'
import tree from 'images/icons/chooseable/tree.svg'
import trumpet from 'images/icons/chooseable/trumpet.svg'
import tshirt from 'images/icons/chooseable/tshirt.svg'
import turtle from 'images/icons/chooseable/turtle.svg'
import umbrella from 'images/icons/chooseable/umbrella.svg'
import unlock from 'images/icons/chooseable/unlock.svg'
import usbdrive from 'images/icons/chooseable/usb-drive.svg'
import utensils from 'images/icons/chooseable/utensils.svg'
import vault from 'images/icons/chooseable/vault.svg'
import vest from 'images/icons/chooseable/vest.svg'
import vial from 'images/icons/chooseable/vial.svg'
import violin from 'images/icons/chooseable/violin.svg'
import virus from 'images/icons/chooseable/virus.svg'
import wallet from 'images/icons/chooseable/wallet.svg'
import wandsparkles from 'images/icons/chooseable/wand-sparkles.svg'
import watch from 'images/icons/chooseable/watch.svg'
import whale from 'images/icons/chooseable/whale.svg'
import wheat from 'images/icons/chooseable/wheat.svg'
import winebottle from 'images/icons/chooseable/wine-bottle.svg'
import wineglass from 'images/icons/chooseable/wine-glass.svg'
import wreath from 'images/icons/chooseable/wreath.svg'
import wrench from 'images/icons/chooseable/wrench.svg'

type Icon = {
    element: string
    name: string
}

const Icons: Record<string, Icon> = {
    'acorn.svg':               { element: acorn,             name: 'Acorn',              },
    'applecore.svg':           { element: applecore,         name: 'Applecore',          },
    'applewhole.svg':          { element: applewhole,        name: 'Applewhole',         },
    'award.svg':               { element: award,             name: 'Award',              },
    'axebattle.svg':           { element: axebattle,         name: 'Axebattle',          },
    'axe.svg':                 { element: axe,               name: 'Axe',                },
    'baby.svg':                { element: baby,              name: 'Baby',               },
    'bandage.svg':             { element: bandage,           name: 'Bandage',            },
    'bee.svg':                 { element: bee,               name: 'Bee',                },
    'beermugempty.svg':        { element: beermugempty,      name: 'Beermug Empty',       },
    'beermug.svg':             { element: beermug,           name: 'Beermug',            },
    'bells.svg':               { element: bells,             name: 'Bells',              },
    'biohazard.svg':           { element: biohazard,         name: 'Biohazard',          },
    'blanket.svg':             { element: blanket,           name: 'Blanket',            },
    'bomb.svg':                { element: bomb,              name: 'Bomb',               },
    'bonebreak.svg':           { element: bonebreak,         name: 'Bonebreak',          },
    'bone.svg':                { element: bone,              name: 'Bone',               },
    'bong.svg':                { element: bong,              name: 'Bong',               },
    'bookbible.svg':           { element: bookbible,         name: 'Bookbible',          },
    'bookblank.svg':           { element: bookblank,         name: 'Bookblank',          },
    'book-medical.svg':        { element: bookmedical,       name: 'Book Medical',       },
    'book-skull.svg':          { element: bookskull,         name: 'Book Skull',         },
    'bow-arrow.svg':           { element: bowarrow,          name: 'Bow Arrow',          },
    'brain.svg':               { element: brain,             name: 'Brain',              },
    'bread-loaf.svg':          { element: breadloaf,         name: 'Bread Loaf',         },
    'briefcase.svg':           { element: briefcase,         name: 'Briefcase',          },
    'broom.svg':               { element: broom,             name: 'Broom',              },
    'bullhorn.svg':            { element: bullhorn,          name: 'Bullhorn',           },
    'campfire.svg':            { element: campfire,          name: 'Campfire',           },
    'capsules.svg':            { element: capsules,          name: 'Capsules',           },
    'cat.svg':                 { element: cat,               name: 'Cat',                },
    'cookiebite.svg':          { element: cookiebite,        name: 'Cookiebite',         },
    'corn.svg':                { element: corn,              name: 'Corn',               },
    'crown.svg':               { element: crown,             name: 'Crown',              },
    'cube.svg':                { element: cube,              name: 'Cube',               },
    'duck.svg':                { element: duck,              name: 'Duck',               },
    'dumpsterfire.svg':        { element: dumpsterfire,      name: 'Dumpsterfire',       },
    'egg-fried.svg':           { element: eggfried,          name: 'Egg Fried',          },
    'envelopes.svg':           { element: envelopes,         name: 'Envelopes',          },
    'featherpointed.svg':      { element: featherpointed,    name: 'Featherpointed',     },
    'flask-round- poison.svg': { element: flaskroundpoison,  name: 'Flask Poison', },
    'flask-round- potion.svg': { element: flaskroundpotion,  name: 'Flask Potion', },
    'flask.svg':               { element: flask,             name: 'Flask',              },
    'glasses-round.svg':       { element: glassesround,      name: 'Glasses Round',      },
    'guitar.svg':              { element: guitar,            name: 'Guitar',             },
    'gun.svg':                 { element: gun,               name: 'Gun',                },
    'hammer.svg':              { element: hammer,            name: 'Hammer',             },
    'helmetbattle.svg':        { element: helmetbattle,      name: 'Helmetbattle',       },
    'raindrops.svg':           { element: raindrops,         name: 'Raindrops',          },
    'rings-wedding.svg':       { element: ringswedding,      name: 'Rings Wedding',      },
    'sack-dollar.svg':         { element: sackdollar,        name: 'Sack Dollar',        },
    'shield.svg':              { element: shield,            name: 'Shield',             },
    'skull.svg':               { element: skull,             name: 'Skull',              },
    'spider.svg':              { element: spider,            name: 'Spider',             },
    'spoon.svg':               { element: spoon,             name: 'Spoon',              },
    'swords.svg':              { element: swords,            name: 'Swords',             },
    'treasure-chest.svg':      { element: treasurechest,     name: 'Treasure Chest',     },
    'tree.svg':                { element: tree,              name: 'Tree',               },
    'trumpet.svg':             { element: trumpet,           name: 'Trumpet',            },
    'tshirt.svg':              { element: tshirt,            name: 'Tshirt',             },
    'turtle.svg':              { element: turtle,            name: 'Turtle',             },
    'umbrella.svg':            { element: umbrella,          name: 'Umbrella',           },
    'unlock.svg':              { element: unlock,            name: 'Unlock',             },
    'usb-drive.svg':           { element: usbdrive,          name: 'Usb Drive',          },
    'utensils.svg':            { element: utensils,          name: 'Utensils',           },
    'vault.svg':               { element: vault,             name: 'Vault',              },
    'vest.svg':                { element: vest,              name: 'Vest',               },
    'vial.svg':                { element: vial,              name: 'Vial',               },
    'violin.svg':              { element: violin,            name: 'Violin',             },
    'virus.svg':               { element: virus,             name: 'Virus',              },
    'wallet.svg':              { element: wallet,            name: 'Wallet',             },
    'wand-sparkles.svg':       { element: wandsparkles,      name: 'Wand Sparkles',      },
    'watch.svg':               { element: watch,             name: 'Watch',              },
    'whale.svg':               { element: whale,             name: 'Whale',              },
    'wheat.svg':               { element: wheat,             name: 'Wheat',              },
    'winebottle.svg':          { element: winebottle,        name: 'Winebottle',         },
    'wine-glass.svg':          { element: wineglass,         name: 'Wine Glass',         },
    'wreath.svg':              { element: wreath,            name: 'Wreath',             },
    'wrench.svg':              { element: wrench,            name: 'Wrench',             },
}
export default Icons
