const MODULE_ID = "scene-plus";

export function registerSettings() {
    game.settings.register(MODULE_ID, "sceneSaveTag", {
        name: "Save Scene Tag",
        hint: "Tag used to designate a save-only tile.\nNote: This will not spawn tokens. Use this for teleporters.",
        scope: "world",
        config: true,
        type: String,
        default: "SaveScene"
    });
    game.settings.register(MODULE_ID, "saveAllScenes", {
        name: "Save on Every Scene",
        hint: "Save on every scene regardless if a tag is set or not.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register(MODULE_ID, "autoReturnUser", {
        name: "Automatically Return to Scene",
        hint: "Automatically return to the last scene when they login.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register(MODULE_ID, "sceneTokenFocus", {
        name: "Focus Token",
        hint: "Focus on my token after returned to a scene.\nNote: Only works on savable scenes configured by the GM!",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
}