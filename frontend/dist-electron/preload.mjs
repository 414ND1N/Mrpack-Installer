"use strict";
const electron = require("electron");
const StartMrpackInstallation = async (installationType, mrpackDirectory, profileDirectory, optionalFiles, cbStatus, cbMax, cbProgress, cbFinish, cbError) => {
  try {
    const url = "http://127.0.0.1:8002/mrpack/install/start/";
    const resp = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        installation_type: installationType,
        mrpack_directory: mrpackDirectory,
        profile_directory: profileDirectory,
        optional_files: optionalFiles || []
      })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { install_id } = await resp.json();
    await new Promise((resolve, reject) => {
      const es = new EventSource(`http://127.0.0.1:8002/mrpack/install/stream/${install_id}`);
      let settled = false;
      const finishResolve = () => {
        if (settled) return;
        settled = true;
        es.close();
        resolve();
      };
      const finishReject = (message) => {
        if (settled) return;
        settled = true;
        es.close();
        reject(new Error(message));
      };
      es.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        if (data.type === "status" && cbStatus) {
          cbStatus(data.message);
        } else if (data.type === "max" && cbMax) {
          cbMax(data.message);
        } else if (data.type === "progress" && cbProgress) {
          cbProgress(data.message);
        } else if (data.type === "error") {
          const errorMessage = String(data.message || "Installation failed");
          if (cbError) cbError(errorMessage);
          finishReject(errorMessage);
        } else if (data.type === "done") {
          if (cbFinish) cbFinish(data.message);
          else if (cbStatus) cbStatus("Installation completed!");
          finishResolve();
        }
      };
      es.onerror = () => {
        const errorMessage = "Connection error during installation stream";
        console.error("SSE error");
        if (cbError) cbError(errorMessage);
        else if (cbStatus) cbStatus(errorMessage);
        finishReject(errorMessage);
      };
    });
  } catch (error) {
    console.error("Error fetching random projects:", error);
    throw error;
  }
};
const GetMrpackMedatadaInfo = async (filePath) => {
  try {
    const resp = await fetch(`http://127.0.0.1:8002/mrpack/metadata/?file_path=${encodeURIComponent(filePath)}`, { method: "GET", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching Mrpack metadata:", error);
    throw error;
  }
};
const DownloadCollection = async (collectionId, version, loaders, directory, updateExisting, log = true) => {
  try {
    const payload = {
      collection_id: collectionId.trim(),
      version,
      loaders,
      directory,
      update: updateExisting,
      log
    };
    const res = await fetch("http://127.0.0.1:8002/modrinth/collection/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.text().catch(() => res.statusText);
      throw new Error(`Request failed (${res.status}): ${body}`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("downloadCollection error", error);
    throw error;
  }
};
const GetCollectionInfo = async (collectionId) => {
  try {
    const url = new URL("http://127.0.0.1:8002/modrinth/collection/info/");
    url.searchParams.set("collection_id", collectionId);
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `HTTP ${res.status}`;
      throw new Error(detail);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching collection info:", error);
    throw error;
  }
};
const GetModsInCollectionInfo = async (collectionId, version, loaders) => {
  try {
    const url = new URL("http://127.0.0.1:8002/modrinth/collection/mods/verify");
    url.searchParams.set("collection_id", collectionId);
    url.searchParams.set("version", version);
    url.searchParams.set("loaders", loaders);
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `HTTP ${res.status}`;
      throw new Error(detail);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching mods in collection info:", error);
    throw error;
  }
};
const FetchRandomProjects = async (count = 10) => {
  const url = new URL("https://api.modrinth.com/v2/projects_random");
  url.searchParams.set("count", count.toString());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1e4);
  try {
    const resp = await fetch(url.toString(), { method: "GET", cache: "no-store", signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching random projects:", error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
const SearchProjects = async (query, facets, index, offset, limit = 10) => {
  const url = new URL("https://api.modrinth.com/v2/search");
  url.searchParams.set("limit", limit.toString());
  if (query) url.searchParams.set("query", query);
  if (facets) url.searchParams.set("facets", JSON.stringify(facets));
  if (index != null) url.searchParams.set("index", index.toString());
  if (offset != null) url.searchParams.set("offset", offset.toString());
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1e4);
  try {
    const resp = await fetch(url.toString(), { method: "GET", cache: "no-store", signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching search projects:", error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
const PathJoin = async (...paths) => {
  try {
    const url = new URL("http://127.0.0.1:8002/utils/path/join");
    paths.forEach((p) => url.searchParams.append("paths", p));
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `Request failed (${res.status})`;
      throw new Error(detail);
    }
    const result = await res.text();
    return result;
  } catch (error) {
    console.error("Error joining paths:", error);
    throw error;
  }
};
const PathExists = async (path) => {
  try {
    const url = new URL("http://127.0.0.1:8002/utils/path/exists");
    url.searchParams.append("path", path);
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `Request failed (${res.status})`;
      throw new Error(detail);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error checking file existence:", error);
    throw error;
  }
};
const PathDelete = async (path) => {
  try {
    const url = new URL("http://127.0.0.1:8002/utils/path/delete");
    url.searchParams.append("path", path);
    const res = await fetch(url.toString(), { method: "DELETE" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `Request failed (${res.status})`;
      throw new Error(detail);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error deleting path:", error);
    throw error;
  }
};
const GetVersion = async () => {
  try {
    const url = new URL("http://127.0.0.1:8002/");
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `Connection failed (${res.status})`;
      throw new Error(detail);
    }
    const data = await res.json();
    return data.version || "unknown";
  } catch (error) {
    console.error("Error fetching version:", error);
    throw error;
  }
};
const GetMinecraftDirectory = async () => {
  try {
    const url = new URL("http://127.0.0.1:8002/minecraft/minecraft_directory/");
    const resp = await fetch(url.toString(), { method: "GET", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching random projects:", error);
    throw error;
  }
};
const AddVanillaLauncher = async (props) => {
  try {
    const url = new URL("http://127.0.0.1:8002/minecraft/add_vanilla_launcher/");
    url.searchParams.set("mrpack_directory", props.mrpack_path);
    url.searchParams.set("profile_directory", props.installation_directory);
    if (props.memory?.min && props.memory?.max) {
      url.searchParams.set("java_min", props.memory?.min != "" ? String(props.memory.min) : "2");
      url.searchParams.set("java_max", props.memory?.max != "" ? String(props.memory.max) : "4");
    }
    if (props.profile_icon) url.searchParams.set("icon", props.profile_icon ?? "Furnace");
    const resp = await fetch(url.toString(), { method: "POST", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching random projects:", error);
    throw error;
  }
};
const IsModdedMinecraftDirectory = async (directory) => {
  try {
    const url = new URL("http://127.0.0.1:8002/minecraft/directory/is_modded");
    url.searchParams.append("directory", directory);
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error checking if directory is modded:", error);
    throw error;
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  invoke: (channel, ...args) => electron.ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => electron.ipcRenderer.send(channel, ...args),
  on: (channel, listener) => electron.ipcRenderer.on(channel, (_event, ...args) => listener(...args)),
  off: (channel, listener) => electron.ipcRenderer.removeListener(channel, listener)
});
electron.contextBridge.exposeInMainWorld("winConfig", {
  getTheme: () => electron.ipcRenderer.invoke("get-theme"),
  getFullscreen: () => electron.ipcRenderer.invoke("get-fullscreen"),
  getLanguage: () => electron.ipcRenderer.invoke("get-language"),
  setTheme: (theme) => electron.ipcRenderer.invoke("set-theme", theme),
  getSystemTheme: () => electron.ipcRenderer.invoke("get-system-theme"),
  setFullscreen: (fullscreen) => electron.ipcRenderer.invoke("set-fullscreen", fullscreen),
  setLanguage: (lang) => electron.ipcRenderer.invoke("set-language", lang),
  getSystemLanguage: () => electron.ipcRenderer.invoke("get-system-language"),
  updateApp: () => electron.ipcRenderer.invoke("update-app"),
  checkUpdate: () => electron.ipcRenderer.invoke("check-update"),
  getVersion: () => electron.ipcRenderer.invoke("get-version"),
  ShowOpenDialog: (options) => electron.ipcRenderer.invoke("dialog:showOpenDialog", options)
});
electron.contextBridge.exposeInMainWorld("backend", {
  // Utils related
  PathJoin: (...paths) => PathJoin(...paths),
  PathExists: (path) => PathExists(path),
  PathDelete: (path) => PathDelete(path),
  GetVersion: () => GetVersion(),
  IsModdedMinecraftDirectory: (directory) => IsModdedMinecraftDirectory(directory),
  // Modrinth related
  FetchRandomProjects: (count) => FetchRandomProjects(count),
  SearchProjects: (query, facets, index, offset, limit = 10) => SearchProjects(query, facets, index, offset, limit),
  AddVanillaLauncher: (props) => AddVanillaLauncher(props),
  // Modrinth related
  GetMinecraftDirectory: () => GetMinecraftDirectory(),
  StartMrpackInstallation: (installationType, mrpackDirectory, profileDirectory, optionalFiles, cbStatus, cbMax, cbProgress, cbFinish, cbError) => StartMrpackInstallation(installationType, mrpackDirectory, profileDirectory, optionalFiles, cbStatus, cbMax, cbProgress, cbFinish, cbError),
  DownloadCollection: (collectionId, version, loaders, directory, updateExisting, log = true) => DownloadCollection(collectionId, version, loaders, directory, updateExisting, log),
  GetCollectionInfo: (collectionId) => GetCollectionInfo(collectionId),
  GetModsInCollectionInfo: (collectionId, version, loaders) => GetModsInCollectionInfo(collectionId, version, loaders),
  GetMrpackMedatadaInfo: (filePath) => GetMrpackMedatadaInfo(filePath)
  // GetMrpackInfo: (filePath: string) => GetMrpackInfo(filePath),
});
console.log("Preload script loaded successfully.");
