import { SetCollection, CollectionCallback } from 'classes/util/types/EmitterType';

export default class EventEmitter {
  private static instanceEventEmitter = new EventEmitter();

  private listeners = new Map<String, SetCollection>();

  public static getInstance() {
    return this.instanceEventEmitter;
  }

  public subscribe(eventName: string, callback: CollectionCallback) {
    const list = this.listeners.get(eventName) || new Set();
    list.add(callback);
    this.listeners.set(eventName, list);
    // console.log(this.listeners);
  }

  public unsubscribe(eventName: string, callback: CollectionCallback) {
    const list = this.listeners.get(eventName);
    if (list) {
      list.delete(callback);
    }
  }

  public dispatch(eventName: string, parameter?: string) {
    const list = this.listeners.get(eventName);
    // console.log(123);

    if (list && list.size) {
      list.forEach((func) => func(parameter));
    }
  }
}
