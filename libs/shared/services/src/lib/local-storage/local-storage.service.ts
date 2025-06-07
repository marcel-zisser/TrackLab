import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Set an item in the local storage
   * @param key of the item
   * @param value of the item
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Retrieves a value from an item in the local storage
   * @param key of the desired item
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from local storage', error);
      return null;
    }
  }

  /**
   * Removes an item from the local storage
   * @param key of the item to remove
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all items in local storage
   */
  clear(): void {
    localStorage.clear();
  }
}
