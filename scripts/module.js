
const MODULE_ID = "scene-plus";

import { registerSettings } from './settings.js';

let scenePlusSpawnerReady = false;
let socket;

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerModule(MODULE_ID);

    socket.register("restorePlayerToScene", restorePlayerToScene);

    return;
});

Hooks.once('init', async function() {

    registerSettings();

    const ScenePlusAPI = {
        restorePlayerToScene: async (userid) => {
            socket.executeAsGM("restorePlayerToScene", userid);
        }
    };

    window.scenePlus = ScenePlusAPI;
    game.modules.get(MODULE_ID).api = ScenePlusAPI;

    return;
});

Hooks.once('ready', async function() {
    scenePlusSpawnerReady = true;
    return;
});

Hooks.on('canvasReady', async function() {
    if (!scenePlusSpawnerReady) return;
    const saveScene = await Tagger.getByTag(game.settings.get(MODULE_ID, "sceneSaveTag"))[0];

    if (!game.user.character) return;

    if (game.user.getFlag(MODULE_ID, "returning") === true && game.settings.get(MODULE_ID, "sceneTokenFocus") === true) {
        const actor = game.actors.get(game.user.character.id);
        const token = actor.getActiveTokens()[0].document;

        if (token) {

            canvas.animatePan({x: token.x, y: token.y, scale: 1, duration: 1_000});
            canvas.tokens.releaseAll();
            token.control();
        }

        await game.user.unsetFlag(MODULE_ID, "returning");
        return;
    }

    if (saveScene || game.settings.get(MODULE_ID, "saveAllScenes")) {
        if (!canvas.scene.active) {
            game.user.character.setFlag(MODULE_ID, "lastScene", canvas.scene.id);
            if (game.user.viewedLevel) {
                game.user.character.setFlag(MODULE_ID, "lastLevel", game.user.viewedLevel);
            }
        }
    }
    return;
});

Hooks.on('userConnected', async function(user, connected) {
    if (connected && game.settings.get(MODULE_ID, "autoReturnUser")) socket.executeAsGM("restorePlayerToScene", user.id);
    return;
});

function restorePlayerToScene(userid) {
    const user = game.users.get(userid);
    user.setFlag(MODULE_ID, "returning", true);
    game.socket.emit("pullToScene", user.character.getFlag(MODULE_ID, "lastScene"), user.id, { level: user.character.getFlag("scene-plus", "lastLevel") || 0 });
    return;
}