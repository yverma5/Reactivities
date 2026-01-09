import { createContext } from "react";
import CounterStore from "./counterStore";
import { uiStore } from "./uiStore";
import { ActivityStore } from "./activityStore";

interface Store{
    counterStore: CounterStore,
    uiStore:uiStore
    activityStore:ActivityStore
}
export const store:Store={
    counterStore:new CounterStore(),
    uiStore: new uiStore(),
    activityStore: new ActivityStore()
}
export const StoreContext= createContext(store);