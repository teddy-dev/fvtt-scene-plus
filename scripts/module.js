let scenePlusSpawnerReady = false;

let socket;

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerModule("scene-plus");
    socket.register("restorePlayerToScene", restorePlayerToScene);
});

Hooks.once('init', async function() {
    game.settings.register("scene-plus", "sceneSpawnerTag", {
        name: "Spawner Tag",
        hint: "The name of the Tag used for Spawner tiles.",
        scope: "world",
        config: true,
        type: String,
        default: "Spawner"
    });
    game.settings.register("scene-plus", "sceneRecenterOnLoad", {
        name: "Recenter On Load",
        hint: "Pan the canvas to your token after loading.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });
    window.scenePlus = {
    restorePlayerToScene: function(userid) {
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
    if (spawner) {
        const character = game.user.character.name;
        const all = await canvas.tokens;
        const token = await all.objects.children.find(c => c.document.name === character);
        if (!token) {
            const portal = new Portal();
            portal.addCreature(character, { count: 1 });
            portal.setLocation({ x: spawner.x, y: spawner.y });
            await portal.spawn();
        }
        game.user.character.setFlag("scene-plus", "lastScene", canvas.scene.id);
        if (game.settings.get("scene-plus", "sceneRecenterOnLoad")) {
            await canvas.recenter();
        }
    }
    return;
});