import { IDBPDatabase, StoreNames, StoreKey, StoreValue, TypedDOMStringList, DBSchema } from 'idb';

type MemoryStoreFields = 'objectStoreNames' | 'add' | 'clear' | 'put' | 'count' | 'delete' | 'get' | 'close';

interface IIDBMemoryStore<DBTypes> extends Pick<IDBPDatabase<DBTypes>, MemoryStoreFields> { }
type StoreNameList<T> = Array<T> & {
  item(index: number): T | null;
  contains(string: T): boolean;
};

export class IDBMemoryStore<DBTypes extends DBSchema | any = any> implements IIDBMemoryStore<DBTypes> {
  private _store: DBTypes = {} as DBTypes;

  public async clear(name: StoreNames<DBTypes>): Promise<void> {
    this._store[name] = {};
    return;
  }

  public async count<Name extends StoreNames<DBTypes>>(storeName: Name, key?: IDBKeyRange | StoreKey<DBTypes, Name>): Promise<number> {
    // throw new Error('Method not implemented.');
    if (!this._store[storeName]) { return 0; }
    // For now, we won't support the key argument.
    return Object.keys(this._store[storeName]).length;
  }

  public close(): void { return; }

  public get objectStoreNames(): TypedDOMStringList<StoreNames<DBTypes>> {
    const list: StoreNameList<StoreNames<DBTypes>> = [] as StoreNameList<StoreNames<DBTypes>>;
    list.item = (index: number) => {
      return list[index];
    };
    list.contains = (string: StoreNames<DBTypes>) => {
      return list.includes(string);
    };
    list.push(...Object.keys(this._store) as any);
    return list;
  }

  public async get<Name extends StoreNames<DBTypes>>(
    storeName: Name, query: IDBKeyRange | StoreKey<DBTypes, Name>
  ): Promise<StoreValue<DBTypes, Name>> {
    const store = this._store[storeName];
    let value;
    if (store) {
      value = store[query as string];
    }
    return value;
  }

  // for add() and put(), we will for now require that the key is provided.
  // in real indexedDB, it will use the keyPath you provide when creating the store, to extract the key
  // from the given value; however that would require us to duplicate that object's API and provide createObjectStore
  // and I don't want to do that right now.

  public async put<Name extends StoreNames<DBTypes>>(
    storeName: Name, value: StoreValue<DBTypes, Name>, key?: IDBKeyRange | StoreKey<DBTypes, Name>
  ): Promise<StoreKey<DBTypes, Name>> {
    const store = this._store[storeName];
    if (store && key) {
      store[key as string] = value;
    }
    return key as StoreKey<DBTypes, Name>;
  }

  public async add<Name extends StoreNames<DBTypes>>(
    storeName: Name, value: StoreValue<DBTypes, Name>, key?: IDBKeyRange | StoreKey<DBTypes, Name>
  ): Promise<StoreKey<DBTypes, Name>> {
    const store = this._store[storeName];
    if (store) {
      value = store[key as string];
      if (typeof value !== 'undefined') {
        throw new Error('Value already exists for key: ' + key);
      }
      store[key as string] = value;
    }
    return key as StoreKey<DBTypes, Name>;
  }

  public async delete<Name extends StoreNames<DBTypes>>(storeName: Name, key: IDBKeyRange | StoreKey<DBTypes, Name>): Promise<void> {
    const store = this._store[storeName];
    if (store) {
      delete store[key as string];
    }
  }

}
