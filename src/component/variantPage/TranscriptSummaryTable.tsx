import autobind from "autobind-decorator";
import * as React from 'react';
import "./TranscriptSummaryTable.css";
import { observer } from "mobx-react";
import { action, observable } from "mobx";
import { Button, Row, Col } from "react-bootstrap";
import { VariantAnnotationSummary } from "cbioportal-frontend-commons";
import TranscriptTable from "./TranscriptTable"

interface ITranscriptSummaryTableProps
{
    annotation: VariantAnnotationSummary | undefined;
}

export type Transcript = {
    transcript: string | undefined,
    hugoGeneSymbol: string | undefined,
    hgvsShort: string | undefined,
    refSeq: string | undefined,
    variantClassification: string | undefined,
    hgvsc: string | undefined,
    consequenceTerms: string | undefined,
    exon: string | undefined
}

@observer
class TranscriptSummaryTable extends React.Component<ITranscriptSummaryTableProps>
{
    @observable showAllTranscript = false;

    private getCanonicalTranscript(annotation: VariantAnnotationSummary | undefined ) {
        let canonicalTranscript:Transcript;
        if(annotation !== undefined) {
            canonicalTranscript = {
                "transcript": annotation.transcriptConsequenceSummary.transcriptId,
                "hugoGeneSymbol": annotation.transcriptConsequenceSummary.hugoGeneSymbol,
                "hgvsShort": annotation.transcriptConsequenceSummary.hgvspShort,
                "refSeq": annotation.transcriptConsequenceSummary.refSeq,
                "variantClassification": annotation.transcriptConsequenceSummary.variantClassification,
                "hgvsc": annotation.transcriptConsequenceSummary.hgvsc,
                "consequenceTerms": annotation.transcriptConsequenceSummary.consequenceTerms,
                "exon": annotation.transcriptConsequenceSummary.exon
            };
        }
        else {
            canonicalTranscript = {
                "transcript": "",
                "hugoGeneSymbol": "",
                "hgvsShort": "",
                "refSeq": "",
                "variantClassification": "",
                "hgvsc": "",
                "consequenceTerms": "",
                "exon": ""
            };
        }
        return canonicalTranscript;
    }

    private getOtherTranscript(annotation: VariantAnnotationSummary | undefined ) {
        let otherTranscript:Transcript[] = [];
        let canonicalTranscriptId = this.getCanonicalTranscript(this.props.annotation);
        if(annotation !== undefined) {
            annotation.transcriptConsequenceSummaries.forEach(transcript => {
                if (transcript.transcriptId !== canonicalTranscriptId.transcript) {
                    otherTranscript.push({
                        "transcript": transcript.transcriptId,
                        "hugoGeneSymbol": transcript.hugoGeneSymbol,
                        "hgvsShort": transcript.hgvspShort,
                        "refSeq": transcript.refSeq,
                        "variantClassification": transcript.variantClassification,
                        "hgvsc": transcript.hgvsc,
                        "consequenceTerms": transcript.consequenceTerms,
                        "exon": transcript.exon
                    });
                }
            });

        }
        else {
            otherTranscript.push({
                "transcript": "",
                "hugoGeneSymbol": "",
                "hgvsShort": "",
                "refSeq": "",
                "variantClassification": "",
                "hgvsc": "",
                "consequenceTerms": "",
                "exon": ""
            });
        }
        return otherTranscript;
    }

    public render()
    {
        return (
            <div>
                <Row>
                    <Col lg="12" className="transcriptTable">
                        <strong>Transcript Consequence Summary</strong>&nbsp;&nbsp;&nbsp;
                        <Button
                            onClick={this.onButtonClick}
                            aria-controls="table-content"
                            aria-expanded={this.showAllTranscript}
                            variant="outline-secondary"
                            className="btn-sm"
                        >
                            see all transcripts
                        </Button>
                        {/* make sure we have at least one transcript here*/}
                        {!this.showAllTranscript && (
                            <TranscriptTable isOpen={!this.showAllTranscript} canonicalTranscript={this.getCanonicalTranscript(this.props.annotation)} />
                        )}
                        {this.showAllTranscript && (
                            <TranscriptTable isOpen={this.showAllTranscript} canonicalTranscript={this.getCanonicalTranscript(this.props.annotation)} otherTranscripts={this.getOtherTranscript(this.props.annotation)} />
                        )}
                    </Col>
                </Row>
            </div>
        );
    }

    @autobind
    @action
    onButtonClick() {
        this.showAllTranscript = !this.showAllTranscript;
    }
}

export default TranscriptSummaryTable;