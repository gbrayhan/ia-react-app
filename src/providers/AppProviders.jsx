import { AuthProvider } from '../contexts/UserContext.jsx';
import { ThemeProvider } from '../contexts/ThemeContext.jsx';
import PropTypes from "prop-types";

const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
};

AppProviders.propTypes = {
    children: PropTypes.node.isRequired
}

export default AppProviders;
