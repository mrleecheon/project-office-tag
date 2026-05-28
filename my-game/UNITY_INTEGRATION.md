# Unity Integration Guide

## 1) Export game content as JSON

Run the exporter:

```bash
npm run export:unity
```

Generated files:

- `dist/unity/content-bundle.json`
- `dist/unity/chapter-index.json`
- `dist/unity/chapters/*.json`
- `dist/unity/manifests/assets.json`
- `dist/unity/manifests/audio-cues.json`

## 2) Copy files to Unity

Copy `dist/unity` into your Unity project:

- `Assets/StreamingAssets/game-content/`

Recommended result:

- `Assets/StreamingAssets/game-content/content-bundle.json`
- `Assets/StreamingAssets/game-content/chapters/chapter-01.json`
- `Assets/StreamingAssets/game-content/chapters/chapter-02.json`
- `Assets/StreamingAssets/game-content/chapters/prologue.json`

## 3) Install JSON package

Use Newtonsoft Json in Unity (`com.unity.nuget.newtonsoft-json`), then create DTO classes.

```csharp
using System;
using System.Collections.Generic;

[Serializable]
public class ChapterData {
  public string id;
  public string label;
  public string title;
  public string startSceneId;
  public List<SceneData> scenes;
  public List<MapData> maps;
}

[Serializable]
public class SceneData {
  public string id;
  public string chapterId;
  public string localId;
  public string mode;      // chat | vn | rpg | end
  public string mapId;
  public string next;
  public string returnTo;
  public List<LineData> lines;
  public List<ChoiceData> choices;
}

[Serializable]
public class LineData {
  public string @char;
  public string text;
  public string textKey;
  public bool isNarration;
}

[Serializable]
public class ChoiceData {
  public string text;
  public string next;
}

[Serializable]
public class MapData {
  public string id;
  public string label;
  public int cols;
  public int rows;
  public int tileSize;
  public List<List<int>> grid;
}
```

## 4) Unity loader example

```csharp
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using UnityEngine;

public static class GameContentLoader {
  public static async Task<ChapterData> LoadChapterAsync(string chapterId) {
    string basePath = Path.Combine(Application.streamingAssetsPath, "game-content");
    string chapterPath = Path.Combine(basePath, "chapters", chapterId + ".json");

    // On desktop this is fine. For Android/WebGL, switch to UnityWebRequest.
    string json = await Task.Run(() => File.ReadAllText(chapterPath));
    return JsonConvert.DeserializeObject<ChapterData>(json);
  }
}
```

## Notes

- Function-based dialogue text in JS is exported as template-like text when possible (for example `{nickname}` placeholder).
- Keep chapter ids and scene ids as source-of-truth keys (`chapter-01`, `prologue.start`, etc.).
- If you want locale-specific text, keep `textKey` in Unity and resolve from your locale table.
