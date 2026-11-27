export interface FindOptions {
  limit?: number;
  lastKey?: Record<string, any>;
  filters?: Record<string, any>;
}

export interface FindResult<T> {
  items: T[];
  lastKey?: Record<string, any>;
  count: number;
}

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<FindResult<T>>;
  findByIndex(indexName: string, key: string, value: any, options?: FindOptions): Promise<FindResult<T>>;
  findOneByIndex(indexName: string, key: string, value: any): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
