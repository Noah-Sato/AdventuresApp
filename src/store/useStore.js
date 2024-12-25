import { create } from 'zustand'
import { createEventDataSlice } from './eventsData'



export const resetAllSlices = (set) => ({
    resetAll: () => {
        createEventDataSlice(set).reset()
    }
})


export const useStore = create((set,get,...a) => ({

...createEventDataSlice(set,get,...a),

}))





 export const useEventsStore = create((set) => ({
    location: null,
    setLocation: (location) => set((state) => {
        const newState = {...state};
        newState.location = location;
        return newState
    }),

    resetLocation: () => set({location: null}) ,


    startDate: null,
    setStartDate: (location) => set((state) => {
        const newState = {...state};
        newState.startDate = location;
        return newState
    }),


    resetStartDate: () => set({startDate: null}) ,

}))