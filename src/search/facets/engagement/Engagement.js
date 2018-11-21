import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import './Engagement.less';
import { CHECK_ENGAGEMENT_TYPE, UNCHECK_ENGAGEMENT_TYPE } from './engagementReducer';

class Engagement extends React.Component {
    onEngagementClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkEngagement(value);
        } else {
            this.props.uncheckEngagement(value);
        }
        this.props.search();
    };

    render() {
        const { engagementType, checkedEngagement, deprecatedEngagementType } = this.props;
        let title = 'Ansettelsesform';
        if (checkedEngagement.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedEngagement.length > 1) {
            title += ` (${checkedEngagement.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                className="Engagement"
                apen
            >
                <div
                    role="group"
                    aria-label="Ansettelsesform"
                    className="Engagement__inner"
                >
                    <div>
                        {engagementType && engagementType.map((item) => (
                            <Checkbox
                                name="engagementType"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onEngagementClick}
                                checked={checkedEngagement.includes(item.key)}
                            />
                        ))}
                        {deprecatedEngagementType && deprecatedEngagementType.map((engagement) => (
                            <div key={engagement}>
                                <Checkbox
                                    name="deprecatedEngagement"
                                    label={<span>{engagement}<span className="Search__expiredText"> (Utgått)</span></span>}
                                    value={engagement}
                                    onChange={this.onEngagementClick}
                                    checked={checkedEngagement.includes(engagement)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Engagement.propTypes = {
    engagementType: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedEngagement: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedEngagementType: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkEngagement: PropTypes.func.isRequired,
    uncheckEngagement: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    engagementType: state.engagement.engagementType,
    checkedEngagement: state.engagement.checkedEngagementType,
    deprecatedEngagementType: state.engagement.deprecatedEngagementType
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkEngagement: (value) => dispatch({ type: CHECK_ENGAGEMENT_TYPE, value }),
    uncheckEngagement: (value) => dispatch({ type: UNCHECK_ENGAGEMENT_TYPE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Engagement);
