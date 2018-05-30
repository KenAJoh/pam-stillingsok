import React from 'react';
import { Container, Row, Column } from 'nav-frontend-grid';
import ReactHtmlParser from 'react-html-parser';
import { Panel } from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
import { fetchStilling } from './api';
import StillingsBoks from './listbox/ListBox';
import Details from './Details';
import './Stilling.less';

const arrayHasData = (array) => array && array[0].hasOwnProperty('punkt');

export default class Stilling extends React.Component {
    constructor(props) {
        super(props);
        const urlFragments = window.location.href.split('/');
        this.state = {
            id: urlFragments[urlFragments.length - 1],
            stilling: undefined
        };
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        fetchStilling(this.state.id).then(
            (response) => {
                this.setState({
                    stilling: response.hits.hits[0]
                });
            },
            (error) => {
                this.setState({
                    error
                });
            }
        );
    };

    render() {
        return (
            <div>
                {this.state.error && (
                    <Container>Det oppstod en feil</Container>
                )}

                {this.state.stilling && (
                    <article id="annonse-container">
                        <header id="annonse-header" className="background--light-green">
                            <Container>
                                <Row className="blokk-m">
                                    <Column xs="12" md="8">
                                        <Sidetittel id="stillingstittel">
                                            {this.state.stilling._source.title}
                                        </Sidetittel>
                                    </Column>
                                </Row>
                            </Container>
                        </header>
                        <Container className="annonse-margin">
                            <Row>
                                <Column xs="12" md="8">
                                    <section>
                                        <Panel className="blokk-s panel--padding panel--gray-border">
                                            {this.state.stilling._source.properties.adtext && (
                                                <Row>
                                                    <Column xs="12">
                                                        <div
                                                            id="stillingstekst"
                                                            className="blokk-s"
                                                        >
                                                            {ReactHtmlParser(this.state.stilling._source.properties.adtext)}
                                                        </div>
                                                    </Column>
                                                </Row>
                                            )}
                                        </Panel>
                                        {arrayHasData(this.state.stilling._source.properties.hardrequirements) && (
                                            <StillingsBoks
                                                title="Krav (kvalifikasjoner)"
                                                items={this.state.stilling._source.properties.hardrequirements}
                                            />
                                        )}
                                        {arrayHasData(this.state.stilling._source.properties.softrequirements) && (
                                            <StillingsBoks
                                                title="Ønsket kompetanse"
                                                items={this.state.stilling._source.properties.softrequirements}
                                            />
                                        )}
                                        {arrayHasData(this.state.stilling._source.properties.personalattributes) && (
                                            <StillingsBoks
                                                title="Personlige egenskaper"
                                                items={this.state.stilling._source.properties.personalattributes}
                                            />
                                        )}
                                    </section>
                                </Column>
                                <Column xs="12" md="4">
                                    <section aria-labelledby="tilleggsinformasjon-title">
                                        <Details stilling={this.state.stilling} />
                                    </section>
                                </Column>
                            </Row>
                        </Container>
                    </article>
                )}
            </div>
        );
    }
}
