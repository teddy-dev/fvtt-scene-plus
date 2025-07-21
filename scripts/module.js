let scenePlusSpawnerReady = false;
let socket;

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerModule("scene-plus");
    socket.register("restorePlayerToScene", restorePlayerToScene);
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
    game.settings.register("scene-plus", "sceneTokenFocus", {
        name: "Focus Token",
        hint: "Focus on my token after restored or teleported.\nNote: May not work on all scenes!",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
    window.scenePlus = {
    restorePlayerToScene: async (userid) => {
            socket.executeAsGM("restorePlayerToScene", userid);
        }
    }
    return;
});

function restorePlayerToScene(userid) {
    const user = game.users.get(userid);
    game.socket.emit("pullToScene", user.character.getFlag("scene-plus", "lastScene"), user.id);
}

Hooks.once('ready', async function() {
    scenePlusSpawnerReady = true;
    return;
});

Hooks.on('canvasReady', async function() {
    if (!scenePlusSpawnerReady) return;
    const spawner = await Tagger.getByTag(game.settings.get("scene-plus", "sceneSpawnerTag"))[0];
    const saveScene = await Tagger.getByTag(game.settings.get("scene-plus", "sceneSaveTag"))[0];
    const character = game.user.character.name;
        const all = await canvas.tokens;
        const token = await all.objects.children.find(c => c.document.name === character);
    if (spawner) {
        if (!token) {
            const portal = new Portal();
            portal.addCreature(character, { count: 1 });
            portal.setLocation({ x: spawner.x, y: spawner.y });
            await portal.spawn();
        }
        focusOnToken(token);
        game.user.character.setFlag("scene-plus", "lastScene", canvas.scene.id);
    } else if (saveScene) {
        if (token) focusOnToken(token);
        game.user.character.setFlag("scene-plus", "lastScene", canvas.scene.id);
    }
    return;
});

function focusOnToken(token) {
    if (game.settings.get("scene-plus", "sceneTokenFocus")) {
        canvas.animatePan({ x: token.center.x, y: token.center.y, scale: canvas.stage.scale.x });
    }
}