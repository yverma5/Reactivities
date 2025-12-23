import { createContext } from "react";
import CounterStore from "./counterStore";
import { uiStore } from "./uiStore";

interface Store{
    counterStore: CounterStore,
    uiStore:uiStore
}
export const store:Store={
    counterStore:new CounterStore(),
    uiStore: new uiStore()
}
export const StoreContext= createContext(store);