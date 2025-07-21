# Scene+ for FoundryVTT
A fairly simple module used to keep track of player movement through self-navigating scenes.

When you have multiple scenes that are designed so your players can freely move themselves between them, such as multistory maps, teleporters, or regional maps it can be a challenge for the player to return to the scene they were on after a reload or another play session. This module solves that challenge by tracking the scene a character has loaded into and exposing a Macro-usable function to return a player to that scene.

### Required Plugins 
[Tagger](https://foundryvtt.com/packages/tagger)  
[Portal Lib](https://foundryvtt.com/packages/portal-lib)  
[Socketlib](https://foundryvtt.com/packages/socketlib)

### How it works
1. Create a tile on a scene and with Tagger, add the tag `Spawner` or `SaveScene` (this can be changed in settings)
- `Spawner` will create a new token if a character's token does not already exist in this scene and save the scene to the character. Use this when you have something like MATT simply changing the scene.
- `SaveScene` will only save the scene to the character. Use this when you are using Foundry's Scene Regions to teleport the player to another scene.
2. When a player loads on this scene, the module will save the scene to their **active character**.
3. The following client macro can be used to restore the user to their last scene. (Be sure to give your players `Observer` permissions!)
  
   ```JavaScript
     window.scenePlus.restorePlayerToScene(game.user.id);
   ```

You will still need to setup transitioning players/tokens between your scenes. You can do this with [Foundry's Scene Regions](https://foundryvtt.com/article/scene-regions), [Monk's Active Tiles](https://foundryvtt.com/packages/monks-active-tiles), or [Stairways (Teleporter)](https://foundryvtt.com/packages/stairways).

---

# Install
While still testing, you can install via the manifest url:  
```
https://raw.githubusercontent.com/teddy-dev/fvtt-scene-plus/refs/heads/main/module.json
```

---

This is my first module for FoundryVTT, I hope its decent. ♥
