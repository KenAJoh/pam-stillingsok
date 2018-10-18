import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import DelayedSpinner from '../../search/loading/DelayedSpinner';
import NoSavedSearches from '../noresult/NoSavedSearches';
import './SavedSearchesExpand.less';
import SavedSearchesExpandItem from './SavedSearchesExpandItem';
import { COLLAPSE_SAVED_SEARCHES } from './savedSearchExpandReducer';

class SavedSearchesExpand extends React.Component {
    componentWillUnmount() {
        this.props.collapse();
    }

    render() {
        const { isFetching, savedSearches } = this.props;
        return (
            <div className="SavedSearchesExpand">
                <div className="SavedSearchesExpand__inner">
                    {isFetching ? (
                        <div className="SavedSearchesExpand__spinner">
                            <DelayedSpinner />
                        </div>
                    ) : (
                        <div>
                            {savedSearches.length === 0 ? (
                                <NoSavedSearches showButton={false} />
                            ) : (
                                <div>
                                    <Undertittel>Lagrede søk</Undertittel>
                                    <ul className={savedSearches.length > 2 ? 'SavedSearchesExpand__list SavedSearchesExpand__columns' : 'SavedSearchesExpand__list'}>
                                        {savedSearches.map((savedSearch) => (
                                            <SavedSearchesExpandItem
                                                key={savedSearch.uuid}
                                                savedSearch={savedSearch}
                                            />
                                        ))}
                                    </ul>
                                    <div className="SavedSearchesExpand__link-to-saved-searches">
                                        <Link to={`${CONTEXT_PATH}/lagrede-sok`} className="lenke typo-element">
                                            Endre lagrede søk og varsler
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

SavedSearchesExpand.propTypes = {
    collapse: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetching: state.savedSearches.isFetching
});

const mapDispatchToProps = (dispatch) => ({
    collapse: () => dispatch({ type: COLLAPSE_SAVED_SEARCHES })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchesExpand);
