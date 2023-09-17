var firstLoad = true
var swup

var content = document.querySelector('#content')
var moth = document.querySelector('.mothmsg')


// LOADING STUFF //
document.addEventListener('DOMContentLoaded', function () {
    swup = new Swup({
        containers: ["#content"],
        animationSelector: '#content',
    });

    // you will realize this uses basically the same system as corru's page events. i can't do it any better
    // this is because i'm used to the system and i like it... Sorry Corru ....
    swup.on('contentReplaced', function () {
        oldPage = page // i need that
        setTimeout(() => {
            eval(document.querySelector('#PageData').innerHTML) //overrides old page obj
            console.log('overrode previous page, calling onload')
            page.onLoaded()
        }, 100)
    });

    swup.on('transitionStart', function () {
        page.onLeaving()
        console.log('calling onleave')
    });

    page.onLoaded()
    console.log('first load, calling onload')
})

function load(dest) {
    if (dest) {
        console.log(`loading ${dest}`)
        swup.loadPage({ url: dest })
    }
}

// INFORMATIONAL STUFF //

let infoTree = {
    "graphic": {base: "here you can add and animate graphics", more: "more graphics info here blablablabla"},
    "entity": {base: "this lets you create new entities, like characters"},
    "dialogue": {base: "you see how my words are styled? here you can write like that"},
    "combat": {base: "this is the place where you can conjure a battlefield"},
    "map": {base: "you can plot places you can go here, <em>but i would do this last</em>"}
}

function getInfo(where, what) {
    if(where == "moth") {
        let moth = document.querySelector('.mothmsg')
        moth.innerHTML = infoTree[what].base
    }
}

// CENU OPTIONS //

window.addEventListener('mousedown', ev => {
    if (ev.target.id == "cenu-icon") {
        // crack ui... NOT mindspike ui.. trust...
        CUI("toggle")
    }
})

// GLOBAL VARIABLES //

var env = {
    data: {
        // page is page-dependent, changes to current page
        // useful to see if data is transferred across pages... which it should be
        page: null,
        maps: [],
        fights: [],
        entities: [],
    },
    savedData: {
        // saved data, on save this is modified and exported to localStorage
        // if you're looking for the option to save in text (render()), look in cenu!
        page: null,
        maps: [],
        fights: [],
        entities: [],
    }
}

// WARNINGS //
// because the site deals with DATA, i try to implement as many barriers as i can

function deepEqual(obj1, obj2) {
    // if they're just referencing, then yeah ofc it's equal
    if (obj1 === obj2) return true;

    // get keys of each obj
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    // if their length isn't the same they aren't the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // check every single key. every last one of them
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    // ok ya
    return true;
}

// if leaving page, check if data has been modified
window.addEventListener("beforeunload", function (event) {
    if (deepEqual(env.data, env.savedData)) {
        console.log('saved, leaving forever')
        return;
    } else {
        // display a confirmation dialog
        console.log('unsaved, throwing The Message')
        event.preventDefault();
        event.returnValue = "gwaaaaa gwaaaaa";
    }
});

// window TINY warning
setTimeout(() => {
    if (window.innerWidth < 1026) {
        moth.textContent = "hey, your resolution's a bit low. consider switching to 1026px or wider"
    }
}, 100)

// DEBUG //
// debug stuff. most of this is being written before i even write the actual site


/*

MISSION STATEMENT AND DATA STRUCTURE DOCUMENTATION ---

my whole goal with this thing is to make modding more accessible and free to everyone!
often i see a lot of really creative-minded people in this community who don't have any
experience in javascript, and wish that they could just do something more with their chars
i believe that creating a tool that allows for easy and quick mod creation will further
boost the capabilities of da corruheads and i'm excited to see what comes out of it :)

anyway:
all properties are arrays of other things, and are all kind of just... jumbled...
nothing is terribly structured until you hit the export button! or call export()

export() turns it from a weird object tree into runnable stuff, though i guess you
could also just manually compile each object into a js file... it's objects like this
for a reason tho ("small" data files)

obj examples using ep3:
(THESE ARE NOT STRUCTURED THE SAME AS REAL CORRU ELEMENTS. DO NOT USE AS REFERENCE!!!!)

graphic, entity, dialogue, combat, and map
all interconnect. order is in order of dependbility (i.e. graphic doesn't need anything, map needs Everything)

graphic (array) ---

an array of possible graphics. doesn't actually define ANYTHING in the exported file,
just used as variables really for editor use. this section also lets you modify how they
show up on stage and animations, so really it's a bit more complicated

crack is NOT A FILE STORAGE WEBSITE, it will ask you to provide links to your own files!!!
don't run up to me begging me to store your files. i Will Not (i am poor)

[
    'geli': {
        backfaceVisibility: true,
            -- if you're fucking insane, this can be false
        multipart: true,
            -- multipart can either be true or false, determines the requirements
            -- true, so the interpositioning tool is available
            -- also means we need the SOURCES array and not the SOURCE string
        sources: [
            {part: 'head', src: 'https://corru.observer/img/sprites/obesk/geli/stage/active_head.gif', position: 'middle', animation: "TINYHOVER 10s ease infinite alternate"},
            {part: 'body', src: 'https://corru.observer/img/sprites/obesk/geli/stage/active_body.gif', position: 'middle',}
                -- position is which layer it's on, like how cavik's hair is behind his head. default is middle
        ]
    }

    'darktile: {
        multipart: false,
        source: '/img/textures/blackstaticSTILL.gif',
    }
]

entity (array) ---

everything verbally character related, like dialogueActors and examineEntities
these are all condensed into one big object, because it's simple

[
    'peter': {
        name: 'peter',
        description: ::RESPONSIVE THOUGHTFORM
            ::EXPLICIT PURPOSE::'foreign entertainment medium'
            <span style='color: var(--obesk-color)'>::RECONSTRUCTED SIGNATURE CONTEXT</span>
            <span style='color: var(--obesk-color)'>+</span>'large, obesk-like cousin'
            <span style='color: var(--obesk-color)'>+</span>'or maybe a large, cousin-like obesk?'
            <span style='color: var(--obesk-color)'>+</span>'might be a "family guy"'`,
        actions: [["dialogue", "greet", "peter_greetin"], ["battle", "fight", "peterfight"]],
        portrait: "https://file.garden/YogLtoCqGHPlp7r5/peter.gif"
    }
]

dialogue (array?) ---

imo the vanilla corru generateDialogueObject() is simple enough, so really this
part of the editor is just a big text editor with a short tutorial LMAO
no need to really give an example here.. it's just stored like:

[
    'geli_silly': {
        data: generateDialogueObject(`stuff`)
        textData: "base64 string of file"
    }
]

yes. we literally have the exact generateDialogueObject() in this js file and
it IS executed when you hit save on the text field. your text is also saved in base64
into textData for easier editing :)

tldr; data for executing, textData for editing

combat (array) ---

possibly the most elaborate part of the editor!
completely simplifies the battle system, condensing it down into three things:
-- combat actors (i.e. peter)
-- combat moves (i.e. peter's fortnite move, or just a plain fight)
-- combat augments
-- combat settings (i.e. peter griffin song, and formation (like containers AND peter))

THE SYSTEM ASSUMES READOUTACTOR IS THE SAME AS YOUR DIALOGUEACTOR.

[
    actors: [
        "peter": {
            entity: 'peter',
            self: false,
                -- self can either be true or false, determines if addAuto and portrait should exist
            hp: "200",
            maxhp: "300",
            statusEffects: ["incoherent"],
            actions: ["attack", "mend", "fortnite"],
            graphic: 'peter',
            reactions: [catchall: ["aahhhh"]]
        },
        "peter": {
            entity: 'peter',
            self: true,
                -- self is true, so we need addAuto and portrait
            addAuto: true,
                -- if false, you will require an event that adds him to the party
            portrait: "https://file.garden/YogLtoCqGHPlp7r5/peterhead.gif"
                -- portrait is like https://uh.fyi/resources/ziya/facetransparent.gif (soz this is all i have atm)
            hp: "15",
            maxhp: "15",
            statusEffects: [],
            actions: ["attack", "mend", "fortnite"],
            graphic: 'peter',
            reactions: [catchall: ["aahhhh"]],
        },
    ],

    moves: [
        "fortnite": {
            name: "Fort Nite",
            type: "target",
            desc: "'play radio';'fortnites the hell up'",
                -- everything below this is taken from ziya's claw, since fortnite is originally a move with no effect
            help: "100% -1HP, 30%C x2",
            accuracy: 1.0,
            crit: 0.3,
            amt: 1,
        }
    ],

    augments: [
        "apexlegend": {
            name: "Apex Legend",
            image: "https://corru.observer/img/sprites/obesk/larval/larval7.gif",
            description: "'apex legend'",
            alterations: [["fortnite", "apexlegend"]],
                -- pretend there's apexlegend attack too (lazy)
            cost: 2,
        }
    ],

    settings: [
        big_peter: {
            enemies: ["peter", "container", "container"],
            rewards: ["disabler"]
            advanceRate: 1000,
            bgm: "https://file.garden/YogLtoCqGHPlp7r5/peter-griffin.mp3",
            bgmRate: 0.85,
        }
    ]
]

maps (array) ---

really, just either a prop (people are props, soz) or a door. there's nothing else in this world

[
'g_lobby': {
    entities: {
        'geli': {
            door: false,
                -- door can either be true or false, determines other property requirements
                -- false, so we need a graphic and entity
            graphic: 'geli',
            entity: 'geli',
                -- both graphics and entities are created in the entity creator!
                -- editor will throw an error if they do not exist
        },
        'door': {
            door: true,
                -- true, so we need a graphic, direction, destination, and teleportSpot
            direction: 'up',
            graphic: 'basic_door',
            destination: 'g_personnel_tunnel',
            teleportSpot: 67,
                -- destination is what room it goes to, and 67 is the index of the room's array
                -- teleportSpot CAN be inserted manually, however if the room exists suggestions
                    will be provided where other doors are
        },
    }
}

floorTypes: {
    -- NEW THING, since usually these are in stageEntities (and really, they are)
    -- except this is just for floor tiles! crack stores them separately for easier access
    -- def not because i don't wanna use js to split stageEntities into tiles and non-tiles.. def...

    -- these are compressed into a .gridpiece.whatever{} and a stageEntities object:
        .gridpiece.walkroad {background: url(/img/textures/blackstaticSTILL.gif);}
        env.stageEntities['w'] = {class:"walkroad",}

    'darktile': {
        graphic: 'darktile',
            -- graphic's whatever idk LOL
    }
}

globalTiles: {
    -- global tiles, so basically stageEntities. these are things that are reused a lot
    -- hopefully it is clear not to put ALL your entities into this.. you don't really need to
    'dog: {
        door: false,
        graphic: 'dog',
        entity: 'dog',
    },
}
]

*/