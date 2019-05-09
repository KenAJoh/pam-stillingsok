import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import StickyAlertStripe from '../common/StickyAlertStripe';

function UserAlertStripe({ userAlertStripeMode, userAlertStripeIsVisible }) {
    if (userAlertStripeIsVisible && (userAlertStripeMode === 'added')) {
        return (
            <StickyAlertStripe type="suksess">
                <span>
                    Din e-postadresse er lagret på
                    {' '}
                    <a className="link link--dark" href="/personinnstillinger">
                        Innstillinger
                    </a>
                </span>
            </StickyAlertStripe>
        );
    } else if (userAlertStripeIsVisible && userAlertStripeMode === 'set-email') {
        return (
            <StickyAlertStripe type="suksess">
                Din e-postadresse er lagret
            </StickyAlertStripe>
        );
    } else if (userAlertStripeIsVisible && userAlertStripeMode === 'clear-email') {
        return (
            <StickyAlertStripe type="suksess">
                E-postadressen din ble slettet
            </StickyAlertStripe>
        );
    }
    return <div />;
}

UserAlertStripe.propTypes = {
    userAlertStripeIsVisible: PropTypes.bool.isRequired,
    userAlertStripeMode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    userAlertStripeIsVisible: state.user.userAlertStripeIsVisible,
    userAlertStripeMode: state.user.userAlertStripeMode
});

export default connect(mapStateToProps)(UserAlertStripe);
