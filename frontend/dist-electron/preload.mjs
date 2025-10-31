"use strict";
const electron = require("electron");
const modrinthFetchRandomProjects = async (count = 10) => {
  try {
    const url = new URL("http://127.0.0.1:8001/modrinth/projects_random/");
    url.searchParams.set("count", count.toString());
    const resp = await fetch(url.toString(), { method: "GET", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching random projects:", error);
    throw error;
  }
};
const modrinthSearchProjects = async (count = 10, type, querry, offset) => {
  try {
    const url = new URL("http://127.0.0.1:8001/modrinth/search/");
    url.searchParams.set("limit", count.toString());
    if (querry) url.searchParams.set("query", querry);
    if (offset != null) url.searchParams.set("offset", offset.toString());
    if (type) url.searchParams.set("facets", JSON.stringify([[`project_type:${type}`]]));
    const resp = await fetch(url.toString(), { method: "GET", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching search projects:", error);
    throw error;
  }
};
const GetMrpackMedatadaInfo = async (filePath) => {
  try {
    const resp = await fetch(`http://127.0.0.1:8001/mrpack/metadata/?file_path=${encodeURIComponent(filePath)}`, { method: "GET", cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching Mrpack metadata:", error);
    throw error;
  }
};
const PathJoin = async (...paths) => {
  try {
    const url = new URL("http://127.0.0.1:8001/utils/path_join/");
    paths.forEach((p) => url.searchParams.append("paths", p));
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const body = await res.text().catch(() => res.statusText);
      throw new Error(`Request failed (${res.status}): ${body}`);
    }
    const result = await res.text();
    return result;
  } catch (error) {
    console.error("Error joining paths:", error);
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
  setTheme: (theme) => electron.ipcRenderer.invoke("set-theme", theme),
  setFullscreen: (fullscreen) => electron.ipcRenderer.invoke("set-fullscreen", fullscreen),
  updateApp: () => electron.ipcRenderer.invoke("update-app"),
  checkUpdate: () => electron.ipcRenderer.invoke("check-update"),
  getVersion: () => electron.ipcRenderer.invoke("get-version")
});
electron.contextBridge.exposeInMainWorld("backend", {
  fetchRandomProjects: (count) => modrinthFetchRandomProjects(count),
  searchProjects: (count, type, querry, offset) => modrinthSearchProjects(count, type, querry, offset),
  GetMrpackMedatadaInfo: (filePath) => GetMrpackMedatadaInfo(filePath),
  PathJoin: (...paths) => PathJoin(...paths)
});
console.log("Preload script loaded successfully.");
