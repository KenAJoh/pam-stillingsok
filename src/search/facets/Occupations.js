import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL
} from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import Facet from './Facet';
import './Facet.less';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import { OCCUPATION_LEVEL_OTHER } from './facetsReducer';
import UnknownFacetValues from './UnknownFacetValues';

class Occupations extends React.Component {
    onFirstLevelClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkFirstLevel(value);
        } else {
            this.props.uncheckFirstLevel(value);
        }
        this.props.search();
    };

    onSecondLevelClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkSecondLevel(value);
        } else {
            this.props.uncheckSecondLevel(value);
        }
        this.props.search();
    };

    /**
     * This ensures that 'Tannhelse/-pleie' is displayed as 'Tannlege og tannpleier'
     * in the search filters. It's a mere cosmetic change since the value attributed
     * to the checkbox remains the same. The decision behind this particular change
     * came due to a problem in the categorization of STYRK codes.
     *
     * "Tannhelsesekretærer ligger under samme STYRK som legesekretærer så
     * det er ikke mulig å skille de fra hverandre, og nå er det nærliggende
     * å tro at også tannhelsesekretær-annonser ligger i denne kategorien."
     *
     * @param key
     * @returns {string|*}
     */
    editedSecondLevelItemKey(key) {
        return key === 'Tannhelse/-pleie' ? 'Tannlege og tannpleier' : key;
    }



    render() {
        const {
            occupationFirstLevels, checkedFirstLevels, checkedSecondLevels, deprecatedFirstLevels,
            deprecatedSecondLevels
        } = this.props;
        return (

            <Facet
                panelId={SearchCriteriaPanels.OCCUPATIONS_PANEL}
                count={checkedFirstLevels.length + checkedSecondLevels.length}
                title="Yrke"
            >
                {occupationFirstLevels && occupationFirstLevels.map((firstLevel) => (
                    <div key={firstLevel.key}>
                        <Checkbox
                            name="occupation"
                            label={`${firstLevel.key} (${firstLevel.count})`}
                            value={firstLevel.key}
                            onChange={this.onFirstLevelClick}
                            checked={checkedFirstLevels.includes(firstLevel.key)}
                            aria-label={`${firstLevel.key}, ${firstLevel.count !== 1 ? `${firstLevel.count} annonser` : '1 annonse'}`}
                        />
                        {checkedFirstLevels && checkedFirstLevels.includes(firstLevel.key)
                        && firstLevel.key !== OCCUPATION_LEVEL_OTHER && (
                            <div
                                className="Facet__inner__items"
                                role="group"
                                aria-label="Velg underkategori"
                            >
                                {firstLevel.occupationSecondLevels &&
                                firstLevel.occupationSecondLevels.map((secondLevel) => (
                                    <Checkbox
                                        name="occupation"
                                        key={this.editedSecondLevelItemKey(secondLevel.key)}
                                        label={`${this.editedSecondLevelItemKey(secondLevel.label)} (${secondLevel.count})`}
                                        aria-label={`${this.editedSecondLevelItemKey(secondLevel.label)}, ${secondLevel.count !== 1 ? `${secondLevel.count} annonser` : '1 annonse'}`}
                                        value={secondLevel.key}
                                        onChange={this.onSecondLevelClick}
                                        checked={checkedSecondLevels.includes(secondLevel.key)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <UnknownFacetValues
                    namePrefix="occupation"
                    unknownValues={deprecatedFirstLevels}
                    checkedValues={checkedFirstLevels}
                    onClick={this.onFirstLevelClick}
                    unknownNestedValues={deprecatedSecondLevels}
                    checkedNestedValues={checkedSecondLevels}
                    onNestedLevelClick={this.onSecondLevelClick}
                />
            </Facet>
        );
    }
}

Occupations.propTypes = {
    occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number,
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        }))
    })).isRequired,
    checkedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkFirstLevel: PropTypes.func.isRequired,
    uncheckFirstLevel: PropTypes.func.isRequired,
    checkSecondLevel: PropTypes.func.isRequired,
    uncheckSecondLevel: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    occupationFirstLevels: state.facets.occupationFirstLevelFacets,
    checkedFirstLevels: state.searchQuery.occupationFirstLevels,
    checkedSecondLevels: state.searchQuery.occupationSecondLevels,
    deprecatedFirstLevels: state.unknownFacets.unknownOccupationFirstLevels,
    deprecatedSecondLevels: state.unknownFacets.unknownOccupationSecondLevels
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkFirstLevel: (firstLevel) => dispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, firstLevel }),
    uncheckFirstLevel: (firstLevel) => dispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, firstLevel }),
    checkSecondLevel: (secondLevel) => dispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, secondLevel }),
    uncheckSecondLevel: (secondLevel) => dispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, secondLevel }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Occupations);
