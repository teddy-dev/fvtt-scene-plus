# Scene+ for FoundryVTT
A simple module used to keep track of player movement through self-navigating scenes.

When players are allowed to move independently between scenes, Foundry doesn't track that movement, so players won't be able to return to their last active scene upon reload or between sessions. This is a common problem for campaigns that use multistory maps, teleporters, or regional maps. This module tracks scenes for characters and creates a macro-usable function to easily return a player to their last active scene.

### Required Plugins 
[Tagger](https://foundryvtt.com/packages/tagger)  
[Portal Lib](https://foundryvtt.com/packages/portal-lib)  
[Socketlib](https://foundryvtt.com/packages/socketlib)

### Systems

Should work with all game systems...probably.

### How it works
1. Create a tile on a scene and with Tagger, add the tag `Spawner` or `SaveScene` (these can be changed in settings!)
- `Spawner` will create a new token if a character's token does not already exist in this scene and save the scene to the character. Use this when you have something like MATT simply changing the scene.
- `SaveScene` will only save the scene to the character. Use this when you are using Foundry's Scene Regions to teleport the player to another scene.
- You may also enable the "Save all Scenes" setting to default to save every scene a player loads onto.
2. When a player loads on this scene, the module will save the scene to their **active character**.
3. The following client macro can be used to restore the user to their last scene. (Be sure to give your players `Observer` permissions!)
  
   ```JavaScript
     window.scenePlus.restorePlayerToScene(game.user.id);
   ```
   Optionally, the client setting "Automatically Return to Scene" can be enabled to return the client when they login.

This module only handles the tracking and the returning a player to a scene. You still need to setup transitioning players/tokens between your scenes. You can do this with [Foundry's Scene Regions](https://foundryvtt.com/article/scene-regions), [Monk's Active Tiles](https://foundryvtt.com/packages/monks-active-tiles), or [Stairways (Teleporter)](https://foundryvtt.com/packages/stairways).

---

# Install
While still testing, you can install via the manifest url:  
```
https://raw.githubusercontent.com/teddy-dev/fvtt-scene-plus/refs/heads/main/module.json
```

---

This is my first module for FoundryVTT, I hope its decent. ♥
