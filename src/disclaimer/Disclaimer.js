import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { HIDE_DISCLAIMER } from './disclaimerReducer';
import './Disclaimer.less';

const HOTJAR_URL = 'https://surveys.hotjar.com/s?siteId=118350&surveyId=124493';

const Disclaimer = () => (
    <div className="DisclaimerWrapper no-print">
        <div className="container">
            <div role="alert" className="Disclaimer typo-normal">
                <Normaltekst className="blokk-xxs">
                    <a href={HOTJAR_URL} className="lenke">
                        Gi tilbakemelding på stillingssøket
                    </a>
                </Normaltekst>
            </div>
        </div>
    </div>
);

Disclaimer.propTypes = {
    shouldShow: PropTypes.bool.isRequired,
    hideDisclaimer: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    shouldShow: state.disclaimer.shouldShow
});

const mapDispatchToProps = (dispatch) => ({
    hideDisclaimer: () => dispatch({ type: HIDE_DISCLAIMER })
});

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer);
