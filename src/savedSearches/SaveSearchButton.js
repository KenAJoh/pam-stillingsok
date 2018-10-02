import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';
import { AuthorizationEnum, SHOW_AUTHORIZATION_ERROR_MODAL } from '../authorization/authorizationReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        if (this.props.httpStatus === 404 || !this.props.isLoggedIn) {
            this.props.showError(AuthorizationEnum.SAVE_SEARCH_ERROR);
        } else {
            this.props.showSavedSearchForm(
                this.props.currentSavedSearch ? SavedSearchFormMode.EDIT : SavedSearchFormMode.ADD,
                this.props.currentSavedSearch !== undefined,
                'Tilbake til stillingssøk'
            );
        }
    };

    render() {
        return (
            <Knapp mini className="SaveSearchButton" onClick={this.onClick}>Lagre søk</Knapp>
        );
    }
}

SaveSearchButton.defaultProps = {
    currentSavedSearch: undefined,
    httpStatus: undefined
};

SaveSearchButton.propTypes = {
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    httpStatus: PropTypes.number,
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    httpStatus: state.savedSearches.httpErrorStatus,
    isLoggedIn: state.authorization.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace, cancelButtonText) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace,
        cancelButtonText
    }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
