const initialEventData = {
    eventsData:
    {
        location: [],
    }
}



export const createEventDataSlice = (set, get) => ({
...initialEventData,


    setLocation: (location) => set((state) => {
        const newState = {...state};
        newState.eventsData.location = location;
        return newState
    }),

    
})