import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { scaleLinear, scaleOrdinal } from '@vx/scale';
import { LinePath } from '@vx/shape';
import { LegendOrdinal } from '@vx/legend';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from "@vx/tooltip";
import { AxisLeft, AxisBottom } from '@vx/axis';
import { localPoint } from "@vx/event";
import { extent, bisector } from "d3-array";

import {
  getParams,
  randomColor,
  thousandFormat,
  financialMonth
} from "../../../../Utils/Functions";
import {months, enMonths, fMonths, activeLabelColor} from "../../../../Assets/js/constant";

import {styles} from './style';

const xSelector = d => d.Month;
const ySelector = d => d.DebtorDays;
const bisectDate = bisector(xSelector).left;

class DebtorsDays extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false,
      data: {},
      lineStrokeSet: {},
      lineClicked: false
    };

    this._generateLineColors = this._generateLineColors.bind(this);
    this._prepareData = this._prepareData.bind(this);
    this._handleLineSelect = this._handleLineSelect.bind(this);
    this._handleLabelSelect = this._handleLabelSelect.bind(this);
    this._deSelectAll = this._deSelectAll.bind(this);
  }

  _onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    this._generateLineColors();
    this._prepareData();
    window.addEventListener('resize', this._onResize.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.summaryData.length !== this.props.summaryData.length
    ) {
      this._prepareData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize.bind(this));
  }

  _generateLineColors() {
    let lineStrokeSet = {};
    for (let i = 1990; i < 2030; i++) {
      lineStrokeSet[i] = randomColor();
    }
    this.setState({lineStrokeSet});
  }

  _prepareData = () => {
    const { summaryData } = this.props;

    let data = {};
    summaryData.forEach(d => {
      if (!data[d.Year]) data[d.Year] = [null,null,null,null,null,null,null,null,null,null,null,null];
      console.log(d);
      const _d = {
        ...d,
        Month: financialMonth(d.Month)
      };
      if (d.DebtorDays) data[_d.Year][_d.Month - 1] = _d;
    });

    Object.keys(data).map(key => {
      for (let i = 0; i < data[key].length; i++) {
        if (!data[key][i]) {
          data[key].splice(i, 1);
          i--;
        }
      }
    });

    console.log(data[2019])

    this.setState({data});
  };

  _showTooltip = (event, data, xScale, yScale) => {
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - xSelector(d0) > xSelector(d1) - x0 ? d1 : d0;
    }
    showTooltip({
      tooltipData: d,
      tooltipLeft: xScale(xSelector(d)),
      tooltipTop: yScale(ySelector(d)),
    });

    this.setState({lineClicked: false});
  };

  _hideTooltip = () => {
    const { hideTooltip } = this.props;
    hideTooltip();
  };

  _handleLineSelect = (event, data) => {
    const { lineClicked } = this.state;
    this.setState({lineClicked: !lineClicked});
  };

  _handleLabelSelect = (event, month) => {
    const { selectedMonths } = this.props;
    let _selectedMonths;

    let index = NaN;
    for (let i = 0; i < selectedMonths.length; i++) {
      if (selectedMonths[i] === month) {
        index = i;
        break;
      }
    }

    if (event.shiftKey) {
      _selectedMonths = selectedMonths.slice();

      if (isNaN(index)) {
        _selectedMonths.push(month);
      } else {
        _selectedMonths.splice(index, 1)
      }
    } else {
      if (!isNaN(index) && selectedMonths.length === 1) {
        _selectedMonths = [];
      } else {
        _selectedMonths = [month];
      }
    }

    this.props.handleFilter({
      selectedMonths: _selectedMonths,
    });
  };

  _deSelectAll = () => {
    this.props.handleFilter({
      selectedMonths: []
    });
  };

  render() {
    const {
      classes,
      summaryData, selectedYears, selectedMonths,
      tooltipOpen, tooltipData, tooltipTop, tooltipLeft
    } = this.props;
    const { data, lineStrokeSet, lineClicked } = this.state;

    const width = window.innerWidth - 15;
    const height = 150;
    const margin = {
      top: 10,
      right: 0,
      bottom: 20,
      left: 40
    };

    const { pageYOffset, xMax, yMax } = getParams(window, width, height, margin);

    if (Object.keys(data).length === 0) return null;

    // scales
    const xScale = scaleLinear({
      domain: extent(summaryData, xSelector),
      range: [xMax/24, xMax - width/24],
    });
    const xAxisScale = scaleLinear({
      domain: [0, 12],
      range: [0, xMax]
    });

    const [minValue, maxValue] = extent(summaryData, ySelector);
    const yScale = scaleLinear({
      domain: [minValue - 10, maxValue + 10],
      range: [yMax, 0],
      nice: true
    });

    const colorRange = selectedYears.reduce((ret, year) => {
      ret.push(lineStrokeSet[year]);
      return ret;
    }, []);
    const colors = scaleOrdinal({
      domain: selectedYears,
      range: colorRange
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>
        <div className="well">
          <Typography variant="h6" className="subtitle mb-10">Days Outstanding</Typography>

          <div>
            <svg width={width} height={height}>
              <rect x={0} y={0} width={width} height={height} fill={'transparent'} onClick={this._deSelectAll} />

              <Group top={margin.top} left={margin.left}>
                <AxisLeft scale={yScale} numTicks={4} hideZero />

                {Object.keys(data).map(key => {
                  const lineStroke = lineStrokeSet[key];
                  return (
                    <LinePath
                      key={key}
                      data={data[key]}
                      // curve={curveBasis}
                      x={d => xScale(xSelector(d))}
                      y={d => yScale(ySelector(d))}
                      strokeWidth={2}
                      stroke={lineStroke}
                      strokeLinecap="round"
                      fill="transparent"
                      onClick={event => {
                        this._handleLineSelect(event, data[key]);
                      }}
                      onMouseMove={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        this._showTooltip(
                          event,
                          data[key],
                          xScale,
                          yScale
                        );
                      }}
                      onMouseLeave={event => {
                        tooltipTimeout = setTimeout(() => {
                          this._hideTooltip();
                        }, 300);
                      }}
                      onTouchMove={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        this._showTooltip(
                          event,
                          data[key],
                          xScale,
                          yScale
                        );
                      }}
                      onTouchEnd={event => {
                        tooltipTimeout = setTimeout(() => {
                          this._hideTooltip();
                        }, 300);
                      }}
                    />
                  )
                })}

                {
                  months.map((month, index) => {
                    return (
                      <rect
                        key={index}
                        x={index * xMax / 12} y={yMax}
                        width={xMax/12} height={margin.bottom}
                        fill={selectedMonths.indexOf(financialMonth(month)) > -1 ? activeLabelColor : 'transparent'}
                        onClick={(event) => this._handleLabelSelect(event, financialMonth(month))}
                      />
                    )
                  })
                }

                <AxisBottom
                  top={yMax}
                  left={0}
                  scale={xAxisScale}
                  hideZero
                  numTicks={13}
                  stroke="#1b1a1e"
                  tickStroke="#a9a9a9"
                  tickLabelProps={(value, index) => ({
                    textAnchor: 'middle',
                    fontSize: 10,
                    fontFamily: 'Arial',
                    dx: `${-xMax/24}`,
                    dy: '-0.5em',
                  })}
                  tickComponent={({ formattedValue, ...tickProps }) => (
                    <text
                      {...tickProps} fill={selectedMonths.indexOf(financialMonth(formattedValue)) > -1 ? 'white' : 'black'}
                      onClick={(event) => this._handleLabelSelect(event, financialMonth(formattedValue))}
                    >
                      {enMonths[financialMonth(formattedValue) - 1]}
                    </text>
                  )}
                />

                {tooltipOpen && (
                  <g>
                    <circle
                      cx={tooltipLeft}
                      cy={tooltipTop}
                      r={lineClicked ? 6 : 4}
                      fill={lineStrokeSet[tooltipData.Year]}
                      stroke="#e3e3e3"
                      strokeWidth={lineClicked ? 3 : 0}
                      style={{ pointerEvents: "none" }}
                    />
                  </g>
                )}
              </Group>
            </svg>

            {tooltipOpen && (
              <Tooltip
                top={tooltipTop + 48}
                left={tooltipLeft - 24}
                style={{
                  backgroundColor: "white",
                  border: 'solid 1px gray',
                  fontSize: '12px',
                  width: '110px'
                }}
              >
                <p className="tooltipPanel">
                  <span className={classes.tltLeft}>{'Month:'}</span>
                  <span className={classes.tltRight}>{`${enMonths[financialMonth(xSelector(tooltipData)) - 1]}`}</span>
                </p>
                <p className="tooltipPanel">
                  <span className={classes.tltLeft}>{'DebtorDays:'}</span>
                  <span className={classes.tltRight}>{`${thousandFormat(ySelector(tooltipData))}`}</span>
                </p>
              </Tooltip>
            )}

            <div
              style={{
                position: 'absolute',
                top: margin.top,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              <LegendOrdinal scale={colors} direction="row" labelMargin="0 15px 0 0" />
            </div>
          </div>
        </div>
      </div>
    );
  };
}


DebtorsDays.propTypes = {
  classes: PropTypes.object.isRequired,

  summaryData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedMonths: PropTypes.array.isRequired,

  handleFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(withTooltip(DebtorsDays));
