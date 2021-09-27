import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { Chart } from './Chart';

import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileDownload } from '@fortawesome/free-solid-svg-icons';

import * as field_desc from '../data/owid-field-descriptions.json';

export class CountryData extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedCountry: '',
            selectedMetric_daily: '',
            selectedMetric_cumulative: '',
            options: {},
            data: {}
        }
    }

    componentDidMount() {
        let self = this;
        self.setState({ selectedCountry: this.props.selectedCountries[0] });
        self.fetchCountryData();
    }

    componentDidUpdate() {
        let self = this;
        if(self.state.selectedCountry.iso_code != this.props.selectedCountries[0].iso_code) {
            self.setState({ selectedCountry: this.props.selectedCountries[0] });
            self.fetchCountryData();
        }
    }

    fetchCountryData() {
        let self = this;

        axios.get('https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"b2742b74-e6d6-488d-8759-e948717339d9"%20WHERE%20iso%20LIKE%20%27' + this.props.selectedCountries[0].iso_code + '%27')
        .then(function(response) {
            if(self.state.data != response.data.result.records) {
                self.setState({ data: response.data.result.records });
            }
        })
    }

    selectMetric = (e) => {
        if(e.target.value == 'daily_') {

            this.setState({selectedMetric_daily: ''})

        } else if(e.target.value == 'cumulative_') {

            this.setState({selectedMetric_cumulative: ''})

        } else {

            if(e.target.value.includes('daily')) {
                this.setState({selectedMetric_daily: e.target.value})
            } else {
                this.setState({selectedMetric_cumulative: e.target.value})
            }

        }


        
    }

    downloadChart = () => {
        const echartInstance = this.echartRef.getEchartsInstance();

        var a = document.createElement("a");
        a.href = echartInstance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        a.download = this.state.selectedCountry.location;
        a.click();
    }

    render() {
        let self = this;
        return (
            <>
                <Card className="border-0 rounded">
                    <Card.Body>
                        <Row className="gx-2 align-items-center">
                            <Col xs="auto">
                                <Button variant="light-grey" style={{color: "#094151"}} onClick={() => self.props.onDeselectCountry() }><FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back</Button>
                            </Col>
                            <Col xs="auto">
                                <div style={{width: '2em', height: '2em', borderRadius: '50%', overflow: 'hidden', position: 'relative'}} className="border">
                                    {this.state.selectedCountry.iso_code != undefined ?
                                        <ReactCountryFlag
                                        svg
                                        countryCode={getCountryISO2(this.state.selectedCountry.iso_code)}
                                        style={{
                                            position: 'absolute', 
                                            top: '30%',
                                            left: '30%',
                                            marginTop: '-50%',
                                            marginLeft: '-50%',
                                            fontSize: '2.8em',
                                            lineHeight: '2.8em',
                                        }}/> : ''
                                    }
                                </div>
                            </Col>
                            <Col>
                                <div>{this.state.selectedCountry.location}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="border-0 rounded mt-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col><h5 className="my-0">Compare data to recoveries</h5></Col>
                            {/* <Col xs="auto">
                                <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Download an image of the current chart.</Tooltip>}>
                                    <Button onClick={() => this.downloadChart()} variant="light-grey" style={{color: "#094151"}}><FontAwesomeIcon icon={faFileDownload} />&nbsp;Download Image</Button>
                                </OverlayTrigger>
                            </Col> */}
                        </Row>
                        
                        <hr/>
                        

                        <Row className="my-4 justify-content-between">
                            <Col xs="auto" className="position-relative">
                                <div className="position-relative top-50 start-50 translate-middle">
                                    <h5>Daily Recoveries</h5>
                                </div>
                            </Col>
                            <Col xs="auto">
                                <Form.Select className="border-0" style={{backgroundColor: '#F6F6F6'}} onChange={this.selectMetric}>
                                    <option value="daily_">{self.state.selectedMetric_daily == '' ? 'Add a comparison metric' : 'Remove comparison'}</option>
                                    <option value="daily_cases">Daily Cases</option>
                                    <option value="daily_tests">Daily Tests</option>
                                    <option value="daily_vac_1">Daily Vaccinations</option>
                                    <option value="daily_deaths">Daily Deaths</option>
                                </Form.Select>   
                            </Col>
                        </Row>
                        
                        <Chart data={self.state.data} field="daily_recoveries" overlay={self.state.selectedMetric_daily}/>

                        <hr/>

                        <Row className="my-4 justify-content-between">
                            <Col xs="auto" className="position-relative">
                                <div className="position-relative top-50 start-50 translate-middle">
                                    <h5>Cumulative Recoveries</h5>
                                </div>
                            </Col>
                            <Col xs="auto">
                                <Form.Select className="border-0" style={{backgroundColor: '#F6F6F6'}} onChange={this.selectMetric}>
                                    <option value="cumulative_">{self.state.selectedMetric_cumulative == '' ? 'Add a comparison metric' : 'Remove comparison'}</option>
                                    <option value="cumulative_cases">Cumulative Cases</option>
                                    <option value="cumulative_tests">Cumulative Tests</option>
                                    <option value="cumulative_vac_1">Cumulative Vaccinations</option>
                                    <option value="cumulative_deaths">Cumulative Deaths</option>
                                </Form.Select>   
                            </Col>
                        </Row>

                        <Chart data={self.state.data} field="cumulative_recoveries" overlay={self.state.selectedMetric_cumulative}/>

                        <Row className="align-items-center mt-5">
                            <Col><span className="text-black-50">Source: <a href="https://au.int/en/africacdc" className="text-reset text-decoration-none" target="_blank">AfricaCDC</a></span></Col>
                        </Row>
                       
                        <hr/>

                        <h6 className="mt-3">Daily and cumulative data:</h6>
                        <p className="text-black-50 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam auctor mauris non viverra dictum. Donec dictum libero ante. Vivamus massa ipsum, fermentum quis scelerisque eu, maximus non ligula. Vestibulum varius risus vitae velit dignissim, quis semper felis lobortis. Maecenas sapien magna, fringilla vel suscipit at, finibus at erat. Nulla placerat semper malesuada. Quisque nec sollicitudin eros, vitae luctus lorem. Sed venenatis sollicitudin vulputate.</p>
                        
                    </Card.Body>
                </Card>
            </>
        );
    }
}