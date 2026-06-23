import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { StorageError } from "../errors/storageError";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  FIRST_ACCESS: "first_access",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const SECURE_KEYS: StorageKey[] = [STORAGE_KEYS.AUTH_TOKEN];

const isSecure = (key: StorageKey) => SECURE_KEYS.includes(key);

export const storageService = {
  async save<T>(key: StorageKey, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (isSecure(key)) {
        await SecureStore.setItemAsync(key, serialized);
      } else {
        await AsyncStorage.setItem(key, serialized);
      }
    } catch {
      throw new StorageError(`Não foi possível salvar o dado [${key}].`);
    }
  },

  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const raw = isSecure(key)
        ? await SecureStore.getItemAsync(key)
        : await AsyncStorage.getItem(key);

      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      throw new StorageError(`Não foi possível recuperar o dado [${key}].`);
    }
  },

  async remove(key: StorageKey): Promise<void> {
    try {
      if (isSecure(key)) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      throw new StorageError(`Não foi possível remover o dado [${key}].`);
    }
  },

  async clear(): Promise<void> {
    try {
      // Remove chaves seguras individualmente
      await Promise.all(SECURE_KEYS.map((k) => SecureStore.deleteItemAsync(k)));

      // Remove chaves simples em lote
      const simpleKeys = Object.values(STORAGE_KEYS).filter((k) => !isSecure(k as StorageKey));
      await AsyncStorage.multiRemove(simpleKeys);
    } catch {
      throw new StorageError("Não foi possível limpar o storage.");
    }
  },
};
