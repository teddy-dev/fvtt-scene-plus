let scenePlusSpawnerReady = false;
let socket;

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerModule("scene-plus");
    socket.register("restorePlayerToScene", restorePlayerToScene);
    socket.register("panToSpot", panToSpot);
    socket.register("spawnCharacter", spawnCharacter);
    return;
});

Hooks.once('init', async function() {
    game.settings.register("scene-plus", "sceneSpawnerTag", {
        name: "Spawner Tag",
        hint: "Tag used to designate where to spawn tokens.",
        scope: "world",
        config: true,
        type: String,
        default: "Spawner"
    });
    game.settings.register("scene-plus", "sceneSaveTag", {
        name: "Save Scene Tag",
        hint: "Tag used to designate a save-only tile.\nNote: This will not spawn tokens. Use this for teleporters.",
        scope: "world",
        config: true,
        type: String,
        default: "SaveScene"
    });
    game.settings.register("scene-plus", "saveAllScenes", {
        name: "Save all Scenes",
        hint: "Save all scenes regardless if a tag is set or not.\nNote: Spawner tag will still take priority if set.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("scene-plus", "autoReturnUser", {
        name: "Automatically Return to Scene",
        hint: "Automatically return to the last scene on game load.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("scene-plus", "sceneTokenFocus", {
        name: "Focus Token",
        hint: "Focus on my token after returned or teleported to a scene.\nNote: Only works on savable scenes configured by the GM!",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
    window.scenePlus = {
    restorePlayerToScene: async (userid) => {
            socket.executeAsGM("restorePlayerToScene", userid);
        }
    };
    return;
});

Hooks.once('ready', async function() {
    scenePlusSpawnerReady = true;
    return;
});

Hooks.on('canvasReady', async function() {
    if (!scenePlusSpawnerReady) return;
    const spawner = await Tagger.getByTag(game.settings.get("scene-plus", "sceneSpawnerTag"))[0];
    const saveScene = await Tagger.getByTag(game.settings.get("scene-plus", "sceneSaveTag"))[0];
    
    if (!game.user.character) return;

    const character = game.user.character.name;
    const all = await canvas.tokens;
    const tokens = await game.scenes.get(game.user.viewedScene).tokens.filter(token => token.actor && token.actor.name === character);

    if (spawner && tokens.length === 0) {
        socket.executeAsGM("spawnCharacter", character, spawner, game.user.id, game.user.character.getFlag("scene-plus", "lastScene"));
    } else if (saveScene || game.settings.get("scene-plus", "saveAllScenes")) {
        if (!canvas.scene.active) {
            game.user.character.setFlag("scene-plus", "lastScene", canvas.scene.id);
            game.user.character.setFlag("scene-plus", "lastLevel", game.user.viewedLevel);
        }
    }
    return;
});

Hooks.on('userConnected', async function(user, connected) {
    if (connected && game.settings.get("scene-plus", "autoReturnUser")) socket.executeAsGM("restorePlayerToScene", user.id);
    return;
});

async function panToSpot(x, y) {
    await canvas.animatePan({ x: Math.round(x), y: Math.round(y), scale: canvas.stage.scale.x });
    return;
}

function restorePlayerToScene(userid, spawner) {
    const user = game.users.get(userid);
    game.socket.emit("pullToScene", user.character.getFlag("scene-plus", "lastScene"), user.id, { level: user.character.getFlag("scene-plus", "lastLevel") || 0 });
    return;
}

async function spawnCharacter(character, spawner, userid, sceneId) {
    const tokens = await game.scenes.get(game.user.viewedScene).tokens.filter(token => token.actor && token.actor.name === character);

    if (tokens.length === 0) {
        const actor = await game.actors.find(actor => actor.name === character);

        if (!actor) return;

        const prototypeToken = await actor.getTokenDocument();
        const rX = (spawner.x + (Math.random() * spawner.width-(canvas.grid.size/2))).toNearest(canvas.grid.size);
        const rY = (spawner.y + (Math.random() * spawner.height-(canvas.grid.size/2))).toNearest(canvas.grid.size);

        const token = await game.scenes.get(sceneId).createEmbeddedDocuments("Token", [{
            ...prototypeToken.toObject(),
            x: Math.round(rX),
            y: Math.round(rY)
        }]);

        socket.executeAsUser("panToSpot", userid, rX, rY);

        const user = game.users.get(userid);
        user.character.setFlag("scene-plus", "lastScene", canvas.scene.id);
        user.character.setFlag("scene-plus", "lastLevel", game.user.viewedLevel);
    }
    return;
}