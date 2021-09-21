import React from 'react';
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';



export class Chart extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        
    }

    componentDidUpdate() {

        let self = this;

        const echartInstance = this.echartRef.getEchartsInstance();

        let dates = _.map(this.props.data,'date');
        let data = _.map(this.props.data, this.props.field);
        let overlay = [];

        let series = [
            {
                name: 'Recoveries',
                data: data,
                type: 'bar',
                smooth: true,
                itemStyle: {
                    color: '#93ABB2'
                },
            },
        ];

        if(self.props.overlay != '') {

            overlay = _.map(self.props.data, self.props.overlay);
            series.push(
                {
                    name: self.props.overlay,
                    data: overlay,
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    itemStyle: {
                        borderWidth: 3,
                        width: 2,
                        color: '#094151'
                    },
                },
            )
        } else {
            series.splice(1,1);
        }

        echartInstance.setOption(
            {
                grid: { top:20, bottom: 80, left: 60, right: 60},
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: [0],
                        show: true,
                        start: 0,
                        end: 100,
                        bottom: 10,
                        labelFormatter: function (value, valueStr) {
                            return valueStr.split('T')[0];
                        }
                    },
                ],
                yAxis: [
                    {
                        
                        type: 'value',
                        name: '',
                        position: 'left',
                        offset: 0,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '',
                        position: 'right',
                        axisLabel: {
                            formatter: (function(value){
                                let val = '';
                                if(value >= 1000000) {
                                    val = value / 1000000 + 'm';
                                } else if(value >= 1000) {
                                    val = value / 1000 + 'k';
                                } else {
                                    val = value;
                                } 
    
    
                                return val;
                            })
                        }
                    }
                ],
                xAxis: {
                    type: 'category', 
                    show: false,
                    axisLabel: {
                        formatter: (function(value){
                            return '';
                        })
                    },
                    data: dates,
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let label = '<strong>' + params[0].axisValue.split('T')[0] + '</strong><hr/>';
                        _.forEach(params, function(param) {
                            label += '<strong style="color: ' + param.color + '; text-transform: capitalize;">' + param.seriesName.replaceAll('_',' ') + '</strong>: ' + param.value + '<br/>'
                        })
    
                        return label
                    }
                },
                series: series,
            }, true
        )
        
    }

    

   

    render() {
        let self = this;
        return (
            <ReactECharts
            ref={(e) => { this.echartRef = e; }}
            option={{}}
            style={{height: '300px'}}
            />
        )
    }
}