export default class CaseInsensitiveMap<V> extends Map<string, V> {
  constructor(entries?: readonly (readonly [string, V])[] | null) {
    super();
    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  override has(key: string): boolean {
    return super.has(key.toLowerCase());
  }

  override get(key: string): V | undefined {
    return super.get(key.toLowerCase());
  }

  override set(key: string, value: V): this {
    return super.set(key.toLowerCase(), value);
  }

  override delete(key: string): boolean {
    return super.delete(key.toLowerCase());
  }
}