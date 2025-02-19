import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString } from '../../utils';
import worktimeParser from './worktimeParser';
import getWorkLocation from '../../../server/common/getWorkLocation';

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;
    const location = getWorkLocation(stilling.properties.location, stilling.locationList, false);

    return (
        <div className="EmploymentDetails detail-section">
            <Undertittel className="EmploymentDetails__head detail-section__head">Om stillingen</Undertittel>
            <div className="detail-section__body">
                <dl className="dl-flex typo-normal">
                    {properties.jobtitle && [
                        <dt key="dt">Stillingstittel:</dt>,
                        <dd key="dd">{properties.jobtitle}</dd>]
                    }
                    {location && [
                        <dt key="dt">Sted:</dt>,
                        <dd key="dd">{location}</dd>
                    ]}
                    {(properties.remote === 'Hjemmekontor' || properties.remote === 'Hybridkontor') && [
                        <dt key="dt">Hjemmekontor:</dt>,
                        <dd key="dd">{properties.remote === 'Hjemmekontor' ? 'Kun hjemmekontor' : 'Hybrid (noe hjemme, noe på arbeidsplassen)'}</dd>
                    ]}
                    {properties.engagementtype && [
                        <dt key="dt">Ansettelsesform:</dt>,
                        <dd key="dd">{properties.engagementtype }</dd>
                    ]}
                    {properties.jobpercentage && [
                        <dt key="dt">Prosent:</dt>,
                        <dd key="dd">{properties.jobpercentage} %</dd>
                    ]}
                    {properties.extent && [
                        <dt key="dt">Heltid/deltid:</dt>,
                        <dd key="dd">{properties.extent}</dd>
                    ]}
                    {properties.positioncount && [
                        <dt key="dt">Antall stillinger:</dt>,
                        <dd key="dd">{properties.positioncount}</dd>
                    ]}
                    {properties.sector && [
                        <dt key="dt">Sektor:</dt>,
                        <dd key="dd">{properties.sector}</dd>
                    ]}
                    {properties.workday && [
                        <dt key="dt">Arbeidsdager:</dt>,
                        <dd key="dd">{worktimeParser(properties.workday)}</dd>
                    ]}
                    {properties.workhours && [
                        <dt key="dt">Arbeidstid:</dt>,
                        <dd key="dd">{worktimeParser(properties.workhours)}</dd>
                    ]}
                    {properties.jobarrangement && [
                        <dt key="dt">Arb.tidsordning:</dt>,
                        <dd key="dd">{properties.jobarrangement}</dd>
                    ]}
                    {properties.starttime && [
                        <dt key="dt">Oppstart:</dt>,
                        <dd key="dd">
                            {isValidISOString(properties.starttime) ?
                                formatISOString(properties.starttime, 'DD.MM.YYYY') :
                                properties.starttime}
                        </dd>
                    ]}
                </dl>
            </div>
        </div>
    );
}

EmploymentDetails.propTypes = {
    stilling: PropTypes.shape({
        properties: PropTypes.shape({
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            engagementtype: PropTypes.string,
            jobpercentage: PropTypes.string,
            extent: PropTypes.string,
            positioncount: PropTypes.string,
            sector: PropTypes.string,
            workday: PropTypes.string,
            workhours: PropTypes.string,
            jobarrangement: PropTypes.string,
            starttime: PropTypes.string
        }),
        location: PropTypes.shape({})
    }).isRequired
};

