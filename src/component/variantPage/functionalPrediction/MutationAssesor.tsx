import * as React from 'react';
import classNames from 'classnames';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { MutationAssessor as MutationAssessorData } from 'genome-nexus-ts-api-client';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Collapse, Table } from 'react-bootstrap';

import Toggle from '../../Toggle';

import tooltipStyles from './styles/mutationAssessorTooltip.module.scss';
import functionalImpactColor from './styles/functionalImpactTooltip.module.scss';
import functionalGroupsStyle from '../functionalGroups.module.scss';

// Most of this component comes from cBioPortal-frontend

const MUTATION_ASSESSOR_URL = 'http://mutationassessor.org/r3/';

export interface IMutationAssessorProps {
    mutationAssessor?: MutationAssessorData;
    isCanonicalTranscriptSelected: boolean;
}

export function hideArrow(tooltipEl: any) {
    const arrowEl = tooltipEl.querySelector('.rc-tooltip-arrow');
    arrowEl.style.display = 'true';
}

// This is mostly to make the legacy MA links work
function maLink(link: string | undefined) {
    let url = null;

    // ignore invalid links ("", "NA", "Not Available")
    if (link) {
        // getma.org is the legacy link, need to replace it with the actual value
        url = link.replace('getma.org', 'mutationassessor.org/r3');

        // prepend "http://" if needed
        if (url.indexOf('http://') !== 0) {
            url = `http://${url}`;
        }
    }

    return url;
}

const MutationAssessorLegend: React.FunctionComponent = () => {
    return (
        <div style={{ minWidth: 450 }}>
            <Table table-border-top striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Legend</th>
                        <th>
                            <span
                                style={{ display: 'inline-block' }}
                                title="Mutation Assessor"
                            >
                                <img
                                    height={14}
                                    src={require('./styles/mutationAssessor.png')}
                                    alt="Mutation Assessor"
                                />
                                &nbsp;Qualitative prediction
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span>
                                <i
                                    className={classNames(
                                        functionalImpactColor['high'],
                                        'fa fa-circle'
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                        </td>
                        <td>
                            <b>High</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>
                                <i
                                    className={classNames(
                                        functionalImpactColor['medium'],
                                        'fa fa-circle'
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                        </td>
                        <td>
                            <b>Medium</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>
                                <i
                                    className={classNames(
                                        functionalImpactColor['low'],
                                        'fa fa-circle'
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                        </td>
                        <td>
                            <b>Low</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span>
                                <i
                                    className={classNames(
                                        functionalImpactColor['neutral'],
                                        'fa fa-circle'
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                        </td>
                        <td>
                            <b>Neutral</b>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

const MutationAssessorInfo: React.FunctionComponent = () => {
    return (
        <div>
            <a
                href={MUTATION_ASSESSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                Mutation Assessor
            </a>{' '}
            predicts the functional impact of amino-acid substitutions in
            proteins, such as mutations discovered in cancer or missense
            polymorphisms. The functional impact is assessed based on
            evolutionary conservation of the affected amino acid in protein
            homologs. The method has been validated on a large set (60k) of
            disease associated (OMIM) and polymorphic variants.
        </div>
    );
};

const MutationAssessorValue: React.FunctionComponent<{
    mutationAssessor?: MutationAssessorData;
}> = (props) => {
    if (props.mutationAssessor) {
        const maData = props.mutationAssessor;
        const xVarLink = maLink(
            `http://mutationassessor.org/r3/?cm=var&p=${maData.uniprotId}&var=${maData.variant}`
        );
        const msaLink = maLink(maData.msaLink);
        const pdbLink = maLink(maData.pdbLink);
        const impact = maData.functionalImpact ? (
            <div>
                {(maData.functionalImpactScore ||
                    maData.functionalImpactScore === 0) && (
                    <div>
                        <span className="mr-2">Score</span>
                        <strong>
                            {maData.functionalImpactScore.toFixed(2)}
                        </strong>
                    </div>
                )}
                <div>
                    Please refer to the score range{' '}
                    <a
                        href="http://mutationassessor.org/r3/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        here
                    </a>
                    .
                </div>
            </div>
        ) : null;

        const xVar =
            xVarLink &&
            maData.uniprotId.length !== 0 &&
            maData.variant.length !== 0 ? (
                <div className={tooltipStyles['mutation-assessor-link']}>
                    <a
                        href={xVarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            height="15"
                            width="19"
                            src={require('./styles/mutationAssessor.png')}
                            className={
                                tooltipStyles['mutation-assessor-main-img']
                            }
                            alt="Mutation Assessor"
                        />
                        Go to Mutation Assessor
                    </a>
                </div>
            ) : null;

        const msa =
            msaLink && maData.msaLink.length !== 0 ? (
                <div className={tooltipStyles['mutation-assessor-link']}>
                    <a href={msaLink} target="_blank" rel="noopener noreferrer">
                        <span
                            className={`${tooltipStyles['ma-icon']} ${tooltipStyles['ma-msa-icon']}`}
                        >
                            msa
                        </span>
                        Multiple Sequence Alignment
                    </a>
                </div>
            ) : null;

        const pdb =
            pdbLink && maData.pdbLink.length !== 0 ? (
                <div className={tooltipStyles['mutation-assessor-link']}>
                    <a href={pdbLink} target="_blank" rel="noopener noreferrer">
                        <span
                            className={`${tooltipStyles['ma-icon']} ${tooltipStyles['ma-3d-icon']}`}
                        >
                            3D
                        </span>
                        Mutation Assessor 3D View
                    </a>
                </div>
            ) : null;

        return (
            <div>
                {impact}
                {msa}
                {pdb}
                {xVar}
            </div>
        );
    } else {
        return null;
    }
};

@observer
export default class MutationAssessor extends React.Component<
    IMutationAssessorProps,
    {}
> {
    @observable showDetails = false;

    constructor(props: IMutationAssessorProps) {
        super(props);
        makeObservable(this);
    }

    public render() {
        let maContent: JSX.Element;

        const dataSource = (
            <>
                Mutation Assessor&nbsp;
                <i className="fas fa-external-link-alt" />
                {!this.props.isCanonicalTranscriptSelected && <span> *</span>}
            </>
        );

        if (
            this.props.mutationAssessor &&
            this.props.mutationAssessor.functionalImpact != null &&
            this.props.mutationAssessor.functionalImpact !== ''
        ) {
            const maData = this.props.mutationAssessor;
            maContent = <span>{maData.functionalImpact}</span>;
        } else {
            maContent = <span>N/A</span>;
        }

        return (
            <div className={functionalGroupsStyle['functional-group']}>
                <div className={functionalGroupsStyle['data-source']}>
                    <DefaultTooltip
                        placement="top"
                        overlay={
                            <div style={{ maxWidth: 450 }}>
                                <MutationAssessorInfo />
                            </div>
                        }
                    >
                        <a
                            href={MUTATION_ASSESSOR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {dataSource}
                        </a>
                    </DefaultTooltip>
                </div>
                <div>
                    <span className={functionalGroupsStyle['data-with-link']}>
                        <a
                            href={MUTATION_ASSESSOR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {maContent}
                        </a>
                    </span>
                    <Toggle
                        isOpen={this.showDetails}
                        textWhenOpen="Less"
                        textWhenClosed="More"
                        onToggle={this.onToggleDetails}
                    />
                    <Collapse in={this.showDetails}>
                        <div className="pt-2">
                            <MutationAssessorValue
                                mutationAssessor={this.props.mutationAssessor}
                            />
                            <br />
                            <MutationAssessorLegend />
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }

    @action
    onToggleDetails = () => {
        this.showDetails = !this.showDetails;
    };
}
