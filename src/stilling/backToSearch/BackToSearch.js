import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './BackToSearch.less';

export default class BackToSearch extends React.Component {

    render() {
        return (
            <Link
                to="/"
                className="BackToSearch knapp knapp--green knapp--standard"
            >
                <Chevron type="venstre" className="BackToSearch__chevron" />
                Tilbake til søk
            </Link>
        );
    }
}
