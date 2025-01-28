import { createContext, useReducer } from "react";

const initialState = {
    name: "John Doe",
    email: "",
};

const reducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
};


export const GlobalContext = createContext();

// eslint-disable-next-line react/prop-types
export const GlobalProvider = ({ children }) => {
    const [globalState, globalDispatch] = useReducer(reducer, initialState);

    return <GlobalContext.Provider value={{
        globalState,
        globalDispatch,
    }}>{children}</GlobalContext.Provider>;
};