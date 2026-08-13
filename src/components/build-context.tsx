"use client";

import { useSyncExternalStore } from "react";
import { MAX_LEVEL, MIN_LEVEL, NO_PERKS, type PerkId, type Perks } from "@/lib/perks";

const STORAGE_KEY = "kcd2-alchemy-build";

export type Build = {
  level: number;
  perks: Perks;
};

const DEFAULT_BUILD: Build = { level: MIN_LEVEL, perks: NO_PERKS };

type State = {
  build: Build;
  /**
   * False until the saved build has been read. The server and the hydrating
   * client both start here, so markup always matches; anything that would
   * render a saved value shows a neutral placeholder until this flips.
   */
  loaded: boolean;
};

const SERVER_STATE: State = { build: DEFAULT_BUILD, loaded: false };

/*
  The saved build is an external store (localStorage), so it is read through
  useSyncExternalStore rather than mirrored into state inside an effect. That
  keeps hydration honest and syncs every open tab for free.
*/
let state: State = SERVER_STATE;
let initialised = false;
const listeners = new Set<() => void>();

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)));
}

function readStoredBuild(): Build | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const { level, perks } = parsed as Partial<Build>;
    const storedPerks = perks as Record<string, unknown> | undefined;
    return {
      level: clampLevel(typeof level === "number" ? level : MIN_LEVEL),
      perks: Object.fromEntries(
        Object.keys(NO_PERKS).map((key) => [key, Boolean(storedPerks?.[key])]),
      ) as Perks,
    };
  } catch {
    // A corrupt or unreadable entry is not worth failing over.
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(build: Build) {
  state = { build, loaded: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
  } catch {
    // Private browsing or a full quota — the app works, just forgetfully.
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    state = { build: readStoredBuild() ?? DEFAULT_BUILD, loaded: true };
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): State {
  if (!initialised) {
    initialised = true;
    state = { build: readStoredBuild() ?? DEFAULT_BUILD, loaded: true };
  }
  return state;
}

function getServerSnapshot(): State {
  return SERVER_STATE;
}

export function setLevel(level: number) {
  commit({ ...getSnapshot().build, level: clampLevel(level) });
}

export function togglePerk(perk: PerkId) {
  const { build } = getSnapshot();
  commit({ ...build, perks: { ...build.perks, [perk]: !build.perks[perk] } });
}

export function resetBuild() {
  commit(DEFAULT_BUILD);
}

export function useBuild() {
  const { build, loaded } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    level: build.level,
    perks: build.perks,
    hydrated: loaded,
    setLevel,
    togglePerk,
    reset: resetBuild,
  };
}
