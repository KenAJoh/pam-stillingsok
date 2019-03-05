import { Column, Container, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../common/pageHeader/PageHeader';
import DelayedSpinner from '../search/loading/DelayedSpinner';
import NotAuthenticated from '../authentication/NotAuthenticated';
import NoUser from '../user/NoUser';
import FavouriteAlertStripe from './alertstripe/FavouriteAlertStripe';
import './Favourites.less';
import FavouriteList from './list/FavouriteList';
import RemoveFavouriteModal from './modal/RemoveFavouriteModal';
import NoFavourites from './noresult/NoFavourites';
import { authenticationEnum } from '../authentication/authenticationReducer';
import {CONTEXT_PATH} from "../fasitProperties";
import TotalFavourites from './totalFavourites/TotalFavourutes';

class Favourites extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = 'Favoritter - Arbeidsplassen';
        ga('set', 'page', `${CONTEXT_PATH}/favoritter`);
        ga('set', 'title', 'Favoritter');
        ga('send', 'pageview');
    }

    render() {
        return (
            <div className="Favourites">
                <FavouriteAlertStripe />
                <PageHeader
                    backUrl={`${CONTEXT_PATH}/`}
                    title="Favoritter"
                />
                <Container className="Favourites__main">
                    {this.props.isAuthenticated === authenticationEnum.NOT_AUTHENTICATED && (
                        <div className="UserSettings__main">
                            <div className="UserSettings__section">
                                <Row>
                                    <Column xs="12">
                                        <NotAuthenticated title="Du må logge inn for å se dine favoritter" />
                                    </Column>
                                </Row>
                            </div>
                        </div>
                    )}
                    {this.props.isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                        <div>
                            {(this.props.isFetchingUser || this.props.isFetchingFavourites) ? (
                                <Row>
                                    <Column xs="12">
                                        <div className="Favourites__main__spinner">
                                            <DelayedSpinner />
                                        </div>
                                    </Column>
                                </Row>
                            ) : (
                                <div>
                                    {!this.props.user && (
                                        <div className="UserSettings__main">
                                            <div className="UserSettings__section">
                                                <Row>
                                                    <Column xs="12">
                                                        <NoUser />
                                                    </Column>
                                                </Row>
                                            </div>
                                        </div>
                                    )}

                                    {this.props.user && (
                                        <Row>
                                            <Column xs="12">
                                                <div>
                                                    {this.props.favourites.length === 0 ? (
                                                        <NoFavourites />
                                                    ) : (
                                                        <div>
                                                            <TotalFavourites total={this.props.favourites.length} />
                                                            <FavouriteList />
                                                        </div>
                                                    )}
                                                </div>
                                            </Column>
                                        </Row>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </Container>
                <RemoveFavouriteModal />
            </div>
        );
    }
}
Favourites.defaultProps = {
    user: undefined
};

Favourites.propTypes = {
    user: PropTypes.shape(),
    isFetchingUser: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.string.isRequired,
    isFetchingFavourites: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    isFetchingUser: state.user.isFetchingUser,
    isAuthenticated: state.authentication.isAuthenticated,
    favourites: state.favourites.favourites,
    totalElements: state.favourites.totalElements,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

export default connect(mapStateToProps)(Favourites);
