import {Column, Row} from 'nav-frontend-grid';
import {Normaltekst, Undertittel} from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import getEmployer from '../../../server/common/getEmployer';
import getWorkLocation from '../../../server/common/getWorkLocation';
import {CONTEXT_PATH} from '../../fasitProperties';
import {formatISOString, isValidISOString} from '../../utils';
import './SearchResultsItemDetails.less';
import {sendUrlEndring} from "../../common/hooks/useTrackPageview";

function LinkToAd({children, stilling, isFinn, employer}) {

    const logMetrics = () => {
        sendUrlEndring({
            page: `${CONTEXT_PATH}/stilling`,
            source: 'FINN'
        })
    };

    if (isFinn) {
        return (
            <a onClick={logMetrics} href={`https://www.finn.no/${stilling.reference}`}
               className="SearchResultItem__link"
            >
                {children}
            </a>
        )
    }
    return (
        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`}
              className="SearchResultItem__link"
        >
            {children}
        </Link>
    )
}

export default function SearchResultsItemDetails({stilling}) {
    let frist;
    const {applicationdue} = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = 'Ikke oppgitt';
    }
    const location = getWorkLocation(stilling.properties.location, stilling.locationList);
    const employer = getEmployer(stilling);
    const isFinn = stilling.source && stilling.source.toLowerCase() === "finn";

    return (
        <LinkToAd
            stilling={stilling}
            isFinn={isFinn}
            employer={employer}
        >
            <Row className="SearchResultsItemDetails">
                <Column xs="12" md="4">
                    {employer && (
                        <Normaltekst
                            className="SearchResultsItemDetails__employer"
                            aria-label={`${employer}.`}
                        >
                            {employer}
                        </Normaltekst>
                    )}
                </Column>
                <Column xs="12" md="8">
                    <Undertittel
                        tag="h3"
                        className="SearchResultsItemDetails__title"
                        aria-label={`${stilling.title}.`}
                    >
                        {stilling.title}
                    </Undertittel>
                    {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                        <Normaltekst
                            className="SearchResultsItemDetails__jobtitle"
                            aria-label={`${stilling.properties.jobtitle}.`}
                        >
                            {stilling.properties.jobtitle}
                        </Normaltekst>
                    )}

                    {location && (
                        <Normaltekst
                            className="SearchResultsItemDetails__location"
                            aria-label={`${location}.`}
                        >
                            {location}
                        </Normaltekst>
                    )}
                    {stilling.published && (
                        <Normaltekst
                            className="SearchResultsItemDetails__published"
                            aria-label={`Publisert ${formatISOString(stilling.published, 'DD.MM.YYYY')}.`}
                        >
                           Publisert: {formatISOString(stilling.published, 'DD.MM.YYYY')}
                        </Normaltekst>
                    )}
                    <div className="SearchResultsItemDetails__applicationdue-wrapper">
                        <Normaltekst
                            className="SearchResultsItemDetails__applicationdue"
                            aria-label={`Søknadsfrist: ${frist}.`}
                        >
                            Søknadsfrist: {frist}
                        </Normaltekst>
                        {isFinn && (
                            <Normaltekst
                                className="SearchResultsItemDetails__external-link"
                                aria-label={"Annonsen åpnes på finn."}
                            >
                                Annonsen åpnes på FINN <span className="SearchResultsItemDetails__external-link-icon"
                                                             aria-label="Ekstern lenke"/>
                            </Normaltekst>
                        )}
                    </div>
                </Column>
            </Row>
        </LinkToAd>
    );
}

SearchResultsItemDetails.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string
        }),
        locationList: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};
