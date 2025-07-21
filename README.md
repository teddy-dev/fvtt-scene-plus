# Scene+ for FoundryVTT
A simple module that uses Tagger and Portal to keep track of player's movements through self-navigating scene changes.

When you have scenes that are setup so that players can move themselves between them, such as with multi-stories, teleporters, etc. It can be a challenge to "return" the player to that scene if they have to reload or during another play session. This module solves that by tracking the scene a character has loaded in to.

### Required Plugins 
[Tagger](https://foundryvtt.com/packages/tagger)  
[Portal Lib](https://foundryvtt.com/packages/portal-lib)

### How it works
1. Create a tile on a scene and with Tagger, add the tag `Spawner` (this can be changed in settings)
2. When a player loads on this scene, the module will save the scene to their **active character**. A macro can then fetch this for later use with: 
```JavaScript
   game.user.character.getFlag("scene-plus", "lastScene")
```
4. You can use a Macro like this to restore the player to the scene:
```JavaScript
  game.socket.emit("pullToScene", game.user.character.getFlag("scene-plus", "lastScene"), game.user.id);
```
When a token moves onto a new scene with a spawner, if their token isn't already on the scene, they will be spawned near the `Spawner` tile. This should be the entrance to your scene. You will still need to setup how the players move between scenes. You can do this with Foundry's reigons executing a macro/script, [Monk's Active Tiles](https://foundryvtt.com/packages/monks-active-tiles), or [Stairways (Teleporter)](https://foundryvtt.com/packages/stairways).

For the best results, you will want to delete the player token when they are moving off a scene and onto another. MAT can handle this easily (and I believe Stairways does too, but don't quote me on that!), however, with reigons you will need a macro like this:
```JavaScript
const tokens = await canvas.tokens;
const token = tokens.objects.children.find(c => c.document.name === game.user.character.name);
if (token) await token.document.delete();
game.socket.emit("pullToScene", "(YOUR SCENE ID HERE)", game.user.id);
```
You can easily grab a scene's ID by opening its configuration, and clicking the "Copy Document UUID." Be sure to remove the `Scene.` from the ID or it will not work correctly. For the power user: typing `canvas.scene.id` into your browser's console will also return only the ID needed.

---

# Install
While still testing, you can install via the manifest url:  
```
https://raw.githubusercontent.com/teddy-dev/fvtt-scene-plus/refs/heads/main/module.json
```

---

This is my first module for FoundryVTT, I hope its decent. ♥
