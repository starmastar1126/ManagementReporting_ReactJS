import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { scaleLinear } from '@vx/scale';
import { Bar } from '@vx/shape';
import { Text } from '@vx/text';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from "@vx/tooltip";
import { AxisLeft, AxisBottom } from '@vx/axis';
import { localPoint } from "@vx/event";
import { max } from "d3-array";

import {
  getParams,
  thousandFormat
} from "../../../../Utils/Functions";

import { styles } from './style';
import {daysRanges, activeLabelColor} from "../../../../Assets/js/constant";

const xSelector = d => d.daysRange;
const ySelector = d => d.invoiceAmount;
const colorSelector = d => d.color;


class AgeingChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      hoverIndex: null
    };

    this._prepareData = this._prepareData.bind(this);
    this._handleSelect = this._handleSelect.bind(this);
    this._deSelectAll = this._deSelectAll.bind(this);
  }

  componentDidMount() {
    this._prepareData();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    if (
      prevProps.detailData.length !== this.props.detailData.length
      || prevProps.selectedYears.length !== this.props.selectedYears.length
    ) {
      this._deSelectAll();
      this._prepareData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  _prepareData = () => {
    const { detailData } = this.props;
    let chartData = {
      'Outstanding30Days': 0,
      'Outstanding60Days': 0,
      'Outstanding90Days': 0,
      'Outstanding120Days': 0,
      'Outstanding120PlusDays': 0,
      'Total': 0,
    };

    detailData.map(d => {
      chartData['Outstanding30Days'] += d.Outstanding30Days;
      chartData['Outstanding60Days'] += d.Outstanding60Days;
      chartData['Outstanding90Days'] += d.Outstanding90Days;
      chartData['Outstanding120Days'] += d.Outstanding120Days;
      chartData['Outstanding120PlusDays'] += d.Outstanding120PlusDays;
      chartData['Total'] += d.InvoiceAmount;
    });

    let data = [];
    let total = Math.round(chartData['Total']);
    let integral = 0;

    Object.keys(daysRanges).map(key => {
      const item = daysRanges[key];
      const val = Math.round(chartData[item.daysRange]);

      if (item.daysRange === 'Total') {
        data.push({
          ...item,
          invoiceAmount: total,
          integral: 0,
          percentage: 100
        });
      } else {
        data.push({
          ...item,
          invoiceAmount: val,
          integral: integral,
          percentage: Math.round(val/total * 100)
        });
      }

      integral += val;
    });

    this.setState({data});
  };

  _getStrokeWidth = (key) => {
    const daysRange = xSelector(daysRanges[key]);
    const { hoverIndex } = this.state;
    const { selectedDaysRanges } = this.props;
    return selectedDaysRanges.indexOf(daysRange) > -1 ? 1.4 : hoverIndex === key ? 0.8 : 0;
  };

  _handleSelect = (event, key) => {
    const { selectedDaysRanges } = this.props;
    const daysRange = xSelector(daysRanges[key]);

    let _selectedDaysRanges = selectedDaysRanges.slice();
    const index = selectedDaysRanges.indexOf(daysRange);

    if (event.shiftKey) {
      if (index > -1) {
        _selectedDaysRanges.splice(index, 1);
      } else {
        _selectedDaysRanges.push(daysRange);

        let tempArr = [];
        Object.keys(daysRanges).map(key => {
          if (_selectedDaysRanges.indexOf(daysRanges[key].daysRange) > -1 ) tempArr.push(daysRanges[key].daysRange);
        });
        _selectedDaysRanges = tempArr;
      }

    } else {
      if (selectedDaysRanges.length === 1 && index > -1) {
        _selectedDaysRanges = [];
      } else {
        _selectedDaysRanges = [daysRange];
      }
    }

    this.props.handleFilter({selectedDaysRanges: _selectedDaysRanges});
  };

  _showTooltip = (event, data) => {
    const { showTooltip } = this.props;
    const { x, y } = localPoint(event);

    showTooltip({
      tooltipData: data,
      tooltipTop: y,
      tooltipLeft: x
    });

    this.setState({hoverIndex: data.key});
  };

  _hideTooltip = () => {
    this.setState({hoverIndex: null});
    this.props.hideTooltip();
  };

  _deSelectAll = () => {
    this.props.handleFilter({selectedDaysRanges: []});
  };

  render() {
    const {
      classes, tooltipOpen, tooltipData, tooltipTop, tooltipLeft, selectedDaysRanges
    } = this.props;
    const { data } = this.state;

    const width = window.innerWidth < 768 ? window.innerWidth - 12 : window.innerWidth * 5 / 12 - 10;
    const height = 150;
    const margin = {
      top: 10,
      right: 0,
      bottom: 20,
      left: 70
    };
    const { pageYOffset, xMax, yMax } = getParams(window, width, height, margin);

    if (data.length === 0) return null;

    // scales
    const xScale = scaleLinear({
      domain: [0, 5],
      range: [xMax/12, xMax - width/12],
    });
    const xAxisScale = scaleLinear({
      domain: [0, 6],
      range: [0, xMax]
    });

    const dataMax = max(data, ySelector);
    const yScale = scaleLinear({
      domain: [0, Math.round(dataMax * 1.1)],
      range: [yMax, 0],
      nice: true
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>
        <Typography variant="h6" className="subtitle mb-10">Ageing</Typography>

        <div>
          <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="transparent" onClick={this._deSelectAll} />

            <Group top={margin.top} left={margin.left}>
              <AxisLeft
                scale={yScale}
                numTicks={3}
                tickFormat={(value, index) => `$${thousandFormat(value)}`}
              />

              {data.map((d, i) => {
                const barHeight = yMax - yScale(ySelector(d));
                const offsetY = yMax - yScale(d.integral + ySelector(d));

                return (
                  <Group key={`bar-${xSelector(d)}`}>
                    <Bar
                      width={xMax / 6 - xMax / 30}
                      height={barHeight}
                      x={xAxisScale(d.key) + xMax / 60}
                      y={yMax - offsetY}
                      fill={colorSelector(d)}
                      stroke={"black"}
                      strokeWidth={this._getStrokeWidth(d.key)}
                      data={{ x: xSelector(d), y: ySelector(d) }}
                      onClick={event => {
                        this._handleSelect(event, d.key);
                      }}
                      onMouseMove={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        this._showTooltip(event, d);
                      }}
                      onMouseLeave={event => {
                        tooltipTimeout = setTimeout(() => {
                          this._hideTooltip();
                        }, 300);
                      }}
                      onTouchMove={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        this._showTooltip({event, d});
                      }}
                      onTouchEnd={event => {
                        tooltipTimeout = setTimeout(() => {
                          this._hideTooltip();
                        }, 300);
                      }}
                    />
                    <Text
                      x={xScale(d.key)}
                      y={yMax - offsetY}
                      verticalAnchor="end"
                      textAnchor="start"
                      fontSize={10}
                      dx={-5}
                      dy={-5}
                    >
                      {`${d.percentage}%`}
                    </Text>
                  </Group>
                );
              })}

              {
                [0, 1, 2, 3, 4, 5].map((x, index) => {
                  return (
                    <rect
                      key={index}
                      x={index * xMax / 6} y={yMax}
                      width={xMax/6} height={margin.bottom}
                      fill={selectedDaysRanges.indexOf(xSelector(daysRanges[index])) > -1 ? activeLabelColor : 'transparent'}
                      onClick={(event) => this._handleSelect(event, index)}
                    />
                  )
                })
              }

              <AxisBottom
                top={yMax}
                left={0}
                scale={xAxisScale}
                hideZero
                numTicks={6}
                stroke="#1b1a1e"
                tickStroke="#a9a9a9"
                tickLabelProps={(value, index) => ({
                  textAnchor: 'middle',
                  fontSize: 10,
                  fontFamily: 'Arial',
                  dx: `${-xMax/12}`,
                  dy: '-0.5em',
                })}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text
                    {...tickProps}
                    fill={selectedDaysRanges.indexOf(xSelector(daysRanges[formattedValue - 1])) > -1 ? 'white' : 'black'}
                    onClick={(event) => this._handleSelect(event, formattedValue - 1)}
                  >
                    {daysRanges[formattedValue - 1].text}
                  </text>
                )}
              />
            </Group>
          </svg>

          {tooltipOpen && (
            <Tooltip
              top={tooltipTop + 30}
              left={tooltipLeft}
              style={{
                backgroundColor: "white",
                border: 'solid 1px gray',
                fontSize: '12px',
                width: '110px',
              }}
            >
              <p className="tooltipPanel" style={{fontWeight: 'bold'}}>{`${tooltipData.text === 'Total' ? 'All' : tooltipData.text} days`}</p>
              <p className="tooltipPanel">{`$${thousandFormat(ySelector(tooltipData))}`}</p>
              <p className="tooltipPanel">{`${tooltipData.percentage}% of total debt`}</p>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

}


AgeingChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedDaysRanges: PropTypes.array.isRequired,

  handleFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(withTooltip(AgeingChart));
