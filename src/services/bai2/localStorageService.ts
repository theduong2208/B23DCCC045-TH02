export class LocalStorageService {
  static saveItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
