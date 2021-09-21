import React from 'react';
import _ from 'lodash';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Gradient from 'javascript-color-gradient';

import { countriesData } from '../data/geojson/africa.js';

export class RecoveriesMap extends React.Component {
    constructor() {
        super();
        this.state = {
            map: undefined,
            mode: 'relative',
            scale: [
                {
                    low: -50000,
                    high: -51,
                    color: '#2E9FF1'
                },
                {
                    low: -50,
                    high: -26,
                    color: '#70C3FF'
                },
                {
                    low: -25,
                    high: -11,
                    color: '#9DD6FF'
                },
                {
                    low: -10,
                    high: 0,
                    color: '#E0F2FF'
                },
                {
                    low: 0,
                    high: 10,
                    color: '#FFECEC'
                },
                {
                    low: 11,
                    high: 25,
                    color: '#FFD1D1'
                },
                {
                    low: 26,
                    high: 50,
                    color: '#FFB7B7'
                },
                {
                    low: 50,
                    high: 100,
                    color: '#FF8585'
                },
                {
                    low: 101,
                    high: 50000,
                    color: '#FF5454'
                },
            ],
            absScale: new Gradient()
        }
    }

    componentDidMount() {
        let self = this;
        self.state.absScale.setGradient('#FFECEC','#FF5454').setMidpoint(500);
    }

    componentDidUpdate() {
    }

    switchMode() {
        let self = this;
        self.setState({mode: this.state.mode == 'relative' ? 'absolute' : 'relative'});
        self.props.onModeSwitch();
    }

    getColor = (amount) => {

        let self = this;
        let selectedColor = '';
        let scale = self.state.scale;

        if(self.state.mode == 'absolute') {
            if(amount == null || amount == 'NaN') {
                return '#999'
            } else {
                if(amount < 1) amount = 1;
                return self.state.absScale.getColor(amount);
            }
        } else {

            if(amount == null || amount == 'NaN') {
                selectedColor = '#999';
            } else {
                _.forEach(scale, function(color) {
                    if(Math.round(amount) <= color.high && Math.round(amount) >= color.low) {
                        selectedColor = color.color;
                    }
                    
                })
            }

            return selectedColor;

        }

    }

    style = (feature) => {

        let self = this;
        let color = 0;

        if(feature.properties.iso_a3 == 'SOL') {
            color = null;
        } 
        else if(self.props.data != undefined && self.props.data.length > 0) {
            let country = _.filter(self.props.data, function(o) { return o.iso_code == feature.properties.iso_a3; })[0];
            if(country != undefined) {
                if(self.state.mode == 'relative') {
                    color = country.offset_recovery_ratio;
                } else {
                    color = country.summed;
                }
            }
        }

        return {
            fillColor: self.getColor(color),
            weight: 0.5,
            opacity: 1,
            color: '#fff',
            dashArray: '0',
            fillOpacity: 1
        };
        
    }

    countryAction = (feature, layer) => {

        let self = this;

        layer.on('click', function (e) {
            if(feature.properties.iso_a3 != 'SOL') {
                self.props.onCountrySelect(
                    { 
                        iso_code: e.target.feature.properties.iso_a3,
                        location: e.target.feature.properties.name
                    }
                );
            }

        });

        layer.on('mouseover', function (e) {
            if(e.target.feature.properties.iso_a3 != 'SOL') {
                layer.bindTooltip(function (layer) {
                        let change = _.filter(self.props.data, function(o) { return o.iso_code == e.target.feature.properties.adm0_a3})[0].offset_recovery_ratio;
                        if(change != null && change != undefined) {
                            change = (change > 0 ? '+' : '') + Math.round(change) + '%';
                        } else {
                            change = '-';
                        }
                        return ('<strong>' + e.target.feature.properties.name + '<br/>' + change + '</strong>'); 
                    }, {permanent: true, opacity: 1}  
                );
            } else {
                layer.bindTooltip(function (layer) {
                    return ('<strong>' + e.target.feature.properties.name + '<br/>-</strong>'); 
                }, {permanent: true, opacity: 1}  
            ); 
            }
            
            this.setStyle({
                'color': '#000'
            });
        });
        layer.on('mouseout', function () {
            layer.bindTooltip().closeTooltip();
            this.setStyle({
              'color': '#fff'
            });
        });


    }


    render() {
        let self = this;
        return (
            <>
                <Card className="border-0 rounded">
                    <Card.Body>
                        <h5>{ this.state.mode == 'relative' ? 'Recoveries' : ''}</h5>
                        <hr/>
                        <MapContainer 
                            center={[-0, 20]}
                            zoom={2.5}
                            scrollWheelZoom={false}
                            zoomControl={false}
                            attributionControl={false}
                            style={{background: '#fff'}}
                            dragging={false}
                            >
                            {/* <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                            /> */}
                            {this.props.data[0] != undefined ?
                                <GeoJSON
                                key={this.props.data[0].date}
                                onEachFeature={this.countryAction}
                                data={countriesData}
                                style={this.style}/>
                            : '' }
                            { this.state.mode == 'relative' ?
                                <div className="position-absolute fw-bold" style={{bottom: 0}}>
                                    <div>
                                        <Badge style={{background: '#FF5454',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> &gt; 100% increase
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#FF8585',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 50%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#FFB7B7',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 25%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#FFD1D1',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 10%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#FFECEC',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 0%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#E0F2FF',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 15%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#9DD6FF',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 25%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#70C3FF',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 50%
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#2E9FF1',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> &lt; 100% decrease
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#999',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> No Data
                                    </div>
                                </div>
                            :
                                <div className="position-absolute fw-bold" style={{bottom: 0}}>
                                    <div>
                                        <Badge style={{background: '#FF5454',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> &gt; 1000 per million
                                    </div>
                                    <div className="my-1">
                                        <Badge style={{background: '#FFECEC',top: '-4px'}} bg="" className="chart-scale position-relative">&nbsp;</Badge> 0
                                    </div>
                                </div>
                            }
                            {/* <div className="position-absolute bottom-0 end-0 mb-1 me-1">
                                <Button className="me-1" size="sm" variant={this.state.mode == 'relative' ? 'primary' : 'control-grey'} onClick={() => this.switchMode() }>RELATIVE</Button>
                                <Button size="sm" variant={this.state.mode == 'absolute' ? 'primary' : 'control-grey'} onClick={() => this.switchMode() }>ABSOLUTE</Button>
                            </div> */}
                        </MapContainer>

                        <Row className="align-items-center mt-5">
                            <Col><span className="text-black-50">Source: <a href="https://au.int/en/africacdc" className="text-reset text-decoration-none" target="_blank">AfricaCDC</a></span></Col>
                        </Row>

                        <hr/>
                        <h6 className="mt-3">How to read the Recovery Map:</h6>
                        <p className="text-black-50 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam auctor mauris non viverra dictum. Donec dictum libero ante. Vivamus massa ipsum, fermentum quis scelerisque eu, maximus non ligula. Vestibulum varius risus vitae velit dignissim, quis semper felis lobortis. Maecenas sapien magna, fringilla vel suscipit at, finibus at erat. Nulla placerat semper malesuada. Quisque nec sollicitudin eros, vitae luctus lorem. Sed venenatis sollicitudin vulputate.</p>
                    </Card.Body>
                </Card>
            </>
        );
    }
}