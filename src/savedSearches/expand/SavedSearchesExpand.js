import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DelayedSpinner from '../../search/loading/DelayedSpinner';
import NoSavedSearches from '../noresult/NoSavedSearches';
import './SavedSearchesExpand.less';
import SavedSearchesExpandItem from './SavedSearchesExpandItem';

function SavedSearchesExpand({ isFetching, savedSearches, isSavedSearchesExpanded }) {
    if (isSavedSearchesExpanded) {
        return (
            <div className="SavedSearchesExpand">
                {isFetching ? (
                    <div className="SavedSearchesExpand__spinner">
                        <DelayedSpinner />
                    </div>
                ) : (
                    <div>
                        {savedSearches.length === 0 ? (
                            <NoSavedSearches />
                        ) : (
                            <div>
                                <div className="SavedSearchesExpand__columns">
                                    {savedSearches.map((savedSearch) => (
                                        <SavedSearchesExpandItem
                                            key={savedSearch.uuid}
                                            savedSearch={savedSearch}
                                        />
                                    ))}
                                </div>
                                <div className="SavedSearchesExpand__link-to-saved-searches">
                                    <Link to="/lagrede-sok" className="lenke typo-element">
                                        Endre lagrede søk og varsler
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
    return <div />;
}

SavedSearchesExpand.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isSavedSearchesExpanded: PropTypes.bool.isRequired,
    savedSearches: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};

const mapStateToProps = (state) => ({
    savedSearches: state.savedSearches.savedSearches,
    isFetching: state.savedSearches.isFetching,
    isSavedSearchesExpanded: state.savedSearchExpand.isSavedSearchesExpanded
});

export default connect(mapStateToProps)(SavedSearchesExpand);
