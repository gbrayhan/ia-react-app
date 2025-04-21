import {createContext, useContext, useReducer} from 'react';
import PropTypes from "prop-types";

const initialThemeState = {
    theme: 'light', language: 'es', fontSize: 'medium',
};

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return {
                ...state, theme: state.theme === 'light' ? 'dark' : 'light'
            };
        case 'SET_LANGUAGE':
            return {
                ...state, language: action.payload
            };
        case 'SET_FONT_SIZE':
            return {
                ...state, fontSize: action.payload
            };
        default:
            return state;
    }
};

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [state, dispatch] = useReducer(themeReducer, initialThemeState);

    return (<ThemeContext.Provider value={{state, dispatch}}>
        {children}
    </ThemeContext.Provider>);
};
ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useTheme = () => useContext(ThemeContext);
