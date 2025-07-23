# Scene+ for FoundryVTT
A simple module used to keep track of player movement through self-navigating scenes.

When players are allowed to move independently between scenes, Foundry doesn't track that movement, so players won't be able to return to their last active scene upon reload or between sessions. This is a common problem for campaigns that use multistory maps, teleporters, or regional maps. This module tracks scenes for characters and creates a macro-usable function to easily return a player to their last active scene.

### Required Plugins 
[Tagger](https://foundryvtt.com/packages/tagger)  
[Portal Lib](https://foundryvtt.com/packages/portal-lib)  
[Socketlib](https://foundryvtt.com/packages/socketlib)

## Usage
1. Create a tile on a scene and use Tagger to add either the `Spawner` or `SaveScene` tag (both can be modified in settings).
- The `Spawner` tag will create a new token if a character's token doesn't exist in the scene and save the scene to the character. Use this when you have a situation like MATT simply changing the scene.
- The `SaveScene` tag will only save the scene to the character. Use this option when you're using Foundry's Scene Regions to teleport a player to another scene.
- You may also enable the "Save all Scenes" setting to automatically save every scene a player loads onto.
2. When a player enters this scene, the module will save the scene information to their active character.
3. Use the following client macro to return users to their last scene. (Make sure to grant your players "Observer" permissions!)
  
   ```JavaScript
     window.scenePlus.restorePlayerToScene(game.user.id);
   ```
   Optionally, the client setting "Automatically Return to Scene" can be enabled to return the client when they login.
  
   This module only tracks and returns players to scenes. You still need to set up transitions for players/tokens between scenes. You can accomplish this using [Foundry's Scene Regions](https://foundryvtt.com/article/scene-regions), [Monk's Active Tiles](https://foundryvtt.com/packages/monks-active-tiles), or [Stairways (Teleporter)](https://foundryvtt.com/packages/stairways).

## Installation
While still testing, you can install via the manifest url:  
```
https://raw.githubusercontent.com/teddy-dev/fvtt-scene-plus/refs/heads/main/module.json
```

---

This is my first module for FoundryVTT, I hope its decent. ♥
