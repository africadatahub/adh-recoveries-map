import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import FlipMove from 'react-flip-move';
import { LeaderboardItem } from './LeaderboardItem';
import _ from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faArrowsAltV } from '@fortawesome/free-solid-svg-icons'


export class Leaderboard extends React.Component {
    constructor() {
        super();
        this.state = {
            limit: 10,
            fullList: false
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    toggleList = () => {
        let self = this;

        self.setState({ fullList: !self.state.fullList });
        self.state.limit == 10 ? self.setState({ limit: 56 }) : self.setState({ limit: 10 });
    }

   

    render() {
        let self = this;
        return (
            <>
                <Card className="border-0 rounded">
                    <Card.Body>
                        <h5>Recoveries</h5>
                        <hr/>
                        
                        {this.props.playingTimeline == true ?
                            <FlipMove>
                                {self.props.data.map((country,index) => {
                                    if(index < self.state.limit) {
                                        return <LeaderboardItem index={index} key={country.iso_code} country={country} onCountrySelect={self.props.onCountrySelect} definitions={this.props.definitions}/>
                                    }
                                })}
                            </FlipMove>
                        :
                            <>
                                {self.props.data.map((country,index) => {
                                    if(index < self.state.limit) {
                                        return <LeaderboardItem index={index} key={country.iso_code} country={country} onCountrySelect={self.props.onCountrySelect} definitions={this.props.definitions}/>
                                    }
                                })}
                            </>
                        }
                        

                        <Button variant="control-grey" className="w-100 d-flex justify-content-between my-3" onClick={ () => self.toggleList() }>
                            <div>{ self.state.fullList == true ? 'Click to collapse' : 'Click to expand all countries' }</div>
                            <FontAwesomeIcon icon={faArrowsAltV} style={{position: 'relative', top: '4px'}}/>
                        </Button>
                        
                        {this.props.playingTimeline == true ?
                            <>
                                {self.state.fullList == false ? 
                                    (<FlipMove>
                                        {self.props.data.map((country,index) => {
                                            if(index > (self.props.data.length - 11)) {
                                                return <LeaderboardItem index={index} key={country.iso_code} country={country} onCountrySelect={self.props.onCountrySelect} definitions={this.props.definitions}/>
                                            }
                                        })}
                                    </FlipMove>) : ''
                                }
                            </>
                        :
                            <>    
                                {self.state.fullList == false ? 
                                    (<>
                                        {self.props.data.map((country,index) => {
                                            if(index > (self.props.data.length - 11)) {
                                                return <LeaderboardItem index={index} key={country.iso_code} country={country} onCountrySelect={self.props.onCountrySelect} definitions={this.props.definitions}/>
                                            }
                                        })}
                                    </>) : ''
                                }
                            </>
                        }
                        <hr/>
                        <Row className="align-items-center">
                            <Col><span className="text-black-50">Source: <a className="text-black-50" target="_blank" href="https://www.ourworldindata.com">www.ourworldindata.com</a></span></Col>
                        </Row>
                        <hr/>
                        <h6 className="mt-3">What this chart is attempting to communicate:</h6>
                        <p className="text-black-50 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam auctor mauris non viverra dictum. Donec dictum libero ante. Vivamus massa ipsum, fermentum quis scelerisque eu, maximus non ligula. Vestibulum varius risus vitae velit dignissim, quis semper felis lobortis. Maecenas sapien magna, fringilla vel suscipit at, finibus at erat. Nulla placerat semper malesuada. Quisque nec sollicitudin eros, vitae luctus lorem. Sed venenatis sollicitudin vulputate.</p>
                    </Card.Body>
                </Card>
                
            </>
        );
    }
}