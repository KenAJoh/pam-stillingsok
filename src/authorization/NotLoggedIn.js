import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import AuthorizationEnum from './AuthorizationEnum';
import { HIDE_AUTHORIZATION_ERROR_MODAL } from './authorizationReducer';
import './NotLoggedIn.less';

class NotLoggedIn extends React.Component {
    closeModal = () => {
        this.props.hideError();
    };

    render() {
        if (this.props.authorizationError) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Logg inn for å utføre handling"
                    appElement={document.getElementById('app')}

                >
                    <div className="NotLoggedIn">
                        <Undertittel className="NotLoggedIn__title">Krever innlogging</Undertittel>
                        <Normaltekst className="NotLoggedIn__message">
                            {this.props.authorizationError === AuthorizationEnum.ADD_FAVORITE_ERROR && (
                                <span>For å lagre en favoritt må du logge inn</span>
                            )}
                            {this.props.authorizationError === AuthorizationEnum.SAVE_SEARCH_ERROR && (
                                <span>For å lagre et søk må du logge inn</span>
                            )}
                        </Normaltekst>
                        <div className="NotLoggedIn__buttons">
                            <Hovedknapp onClick={this.onRemoveClick}>Logg inn</Hovedknapp>
                            <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

NotLoggedIn.defaultProps = {
    authorizationError: undefined
};

NotLoggedIn.propTypes = {
    hideError: PropTypes.func.isRequired,
    authorizationError: PropTypes.string
};

const mapStateToProps = (state) => ({
    authorizationError: state.authorization.authorizationError
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_AUTHORIZATION_ERROR_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotLoggedIn);
