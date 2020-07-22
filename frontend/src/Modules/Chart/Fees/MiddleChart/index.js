import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { scaleBand, scaleLinear } from '@vx/scale';
import {
  Bar
} from '@vx/shape';
import {Group} from "@vx/group";
import {AxisBottom, AxisLeft} from "@vx/axis";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { max } from 'd3-array';

import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  NativeSelect,
  Typography,
  Grid,
} from "@material-ui/core";

import {
  getParams, getMonth, isEqualObjList, isEqualList, thousandFormat
} from "../../../../Utils/Functions";
import {
  positiveActiveColor,
  positiveDisableColor,
  negativeActiveColor,
  negativeDisableColor,
  barHeight,
  ship,
  axis,
  tooltip,
  item,
  empty
} from "../../../../Assets/js/constant";

import { styles } from './style';

// accessors
const x = d => d.ActualFees;
const xF = d => d.ForecastFees;
const y = (d, key) => d[key];


class MiddleChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false,

      data: [],
      hoverBar: null,
      selectedBars: [],
      selectedRects: [],
    };

    this.prepareData = this.prepareData.bind(this);
    this.handleElement = this.handleElement.bind(this);
    this.deSelectAll = this.deSelectAll.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    this.prepareData();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    if (
      prevProps.detailData.length !== this.props.detailData.length
      || !isEqualList(prevProps.selectedYears, this.props.selectedYears)
      || !isEqualList(prevProps.selectedMonths, this.props.selectedMonths)
      || !isEqualObjList(prevProps.selectedTopItems, this.props.selectedTopItems)
      || prevProps.filterName !== this.props.filterName
    ) {
      this.prepareData();
      this.deSelectAll();
    }
  }

  prepareData = () => {
    const { detailData, filterName, selectedYears, selectedMonths, selectedTopItems } = this.props;

    let dictData = {};
    let data = [];

    let _selectedMonths = selectedMonths.slice();
    selectedTopItems.forEach(item => {
      _selectedMonths.push(item['month']);
    });

    detailData.forEach(d => {
      if (_selectedMonths.length === 0 || _selectedMonths.indexOf(getMonth(d.Date)) > -1) {
        let item = d[filterName];

        if (!dictData[item]) {
          dictData[item] = {};
          dictData[item][filterName] = item;
          dictData[item]['ActualFees'] = 0;
          dictData[item]['ForecastFees'] = 0;
        }

        dictData[item]['ActualFees'] += d['ActualFees'];
        dictData[item]['ForecastFees'] += d['ForecastFees'];
      }
    });

    Object.keys(dictData).map(key => {
      data.push(dictData[key]);
    });

    this.setState({data});
  };

  getColor = (data) => {
    const { filterName, selectedMiddleItems } = this.props;
    const activeColor = x(data) < xF(data) ? negativeActiveColor : positiveActiveColor;
    const disableColor = x(data) < xF(data) ? negativeDisableColor : positiveDisableColor;

    if (selectedMiddleItems.length === 0) return activeColor;
    if (selectedMiddleItems.indexOf(data[filterName]) > -1) return activeColor;
    return disableColor;
  };

  handleFilter = event => {
    const filterName = event.target.value;
    this.props.handleFilter({filterName});
  };

  handleElement = (event, element, item=null) => {
    const { selectedMiddleItems } = this.props;
    const { selectedBars, selectedRects } = this.state;

    let _selectedBars = [], _selectedRects = [], _selectedMiddleItems = [];
    let exist = false, index = NaN;

    switch (element) {
      case 'bar':
        if (event.shiftKey) {
          _selectedBars = selectedBars.slice();
          _selectedMiddleItems = selectedMiddleItems.slice();
          _selectedRects = selectedRects.slice();

          for (let i = 0; i < selectedBars.length; i++) {
            if (selectedBars[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('barActive');
            _selectedBars.push(event.target);
            _selectedMiddleItems.push(item);
          } else {
            event.target.classList.remove('barActive');
            _selectedBars.splice(index, 1);
            _selectedMiddleItems.splice(index, 1);
          }

        } else {
          selectedBars.forEach(selectedBar => {
            selectedBar.classList.remove('barActive');
            if (selectedBar === event.target) exist = true;
          });

          selectedRects.forEach(selectedRect => {
            selectedRect.classList.remove('bkgActive');
          });

          if (exist && selectedBars.length === 1) {
            _selectedBars = [];
            _selectedRects = [];
            _selectedMiddleItems = [];
          } else {
            event.target.classList.add('barActive');
            _selectedBars = [event.target];
            _selectedRects = [];
            _selectedMiddleItems = [item];
          }
        }

        break;

      case 'rect':
        if (event.shiftKey) {
          _selectedBars = selectedBars.slice();
          _selectedMiddleItems = selectedMiddleItems.slice();
          _selectedRects = selectedRects.slice();

          for (let i = 0; i < selectedRects.length; i++) {
            if (selectedRects[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('bkgActive');
            _selectedRects.push(event.target);
            _selectedMiddleItems.push(item);
          } else {
            event.target.classList.remove('bkgActive');
            _selectedRects.splice(index, 1);
            _selectedMiddleItems.splice(index, 1);
          }

        } else {
          selectedBars.forEach(selectedBar => {
            selectedBar.classList.remove('barActive');
          });
          selectedRects.forEach(selectedRect => {
            selectedRect.classList.remove('bkgActive');
            if (selectedRect === event.target) exist = true;
          });

          if (exist && selectedRects.length === 1) {
            _selectedBars = [];
            _selectedRects = [];
            _selectedMiddleItems = [];
          } else {
            event.target.classList.add('bkgActive');
            _selectedBars = [];
            _selectedRects = [event.target];
            _selectedMiddleItems = [item];
          }
        }

        break;

      default:
        break
    }

    this.setState({
      selectedBars: _selectedBars,
      selectedRects: _selectedRects
    });

    this.props.handleFilter({selectedMiddleItems: _selectedMiddleItems});
  };

  deSelectAll = () => {
    const { selectedBars, selectedRects } = this.state;

    selectedBars.forEach(selectedBar => {
      selectedBar.classList.remove('barActive');
    });

    selectedRects.forEach(selectedRect => {
      selectedRect.classList.remove('bkgActive');
    });

    this.setState({
      selectedBars: [],
      selectedRects: []
    });

    this.props.handleFilter({selectedMiddleItems: []});
  };

  showTooltip = (event, data, isBar = true) => {
    const { showTooltip } = this.props;
    let tooltipData, top, left;

    top = event.clientY  - 270;
    left = event.clientX;
    tooltipData = data;
    tooltipData['isBar'] = isBar;

    if (isBar) {
      const { hoverBar } = this.state;
      if (hoverBar) hoverBar.classList.remove('barHover');
      event.target.classList.add('barHover');
      this.setState({hoverBar: event.target});
    }

    showTooltip({
      tooltipData: tooltipData,
      tooltipTop: top,
      tooltipLeft: left
    });
  };

  hideTooltip = () => {
    const { hideTooltip } = this.props;
    const { hoverBar } = this.state;

    if (hoverBar) hoverBar.classList.remove('barHover');
    this.setState({hoverBar: null});

    hideTooltip();
  };

  render() {
    const {
      classes, filterName,
      tooltipOpen, tooltipLeft, tooltipTop, tooltipData
    } = this.props;

    const { data } = this.state;
    const count = data.length;

    const width = (window.innerWidth - 15) * 11 / 12;
    const height = count * barHeight;
    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const { pageYOffset, xMax, yMax } = getParams(window, width, height, margin);

    let maxValue = 0;
    if (count > 0)
      maxValue = Math.max(0, max(data, d => Math.abs(x(d))), max(data, d => Math.abs(xF(d))));

    // scales
    const xScale = scaleLinear({
      domain: [0, maxValue],
      range: [0, xMax],
      nice: true
    });

    const yScale = scaleBand({
      domain: data.map(d => y(d, filterName)),
      rangeRound: [yMax, 0],
      padding: 0.2
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>

        <div className="wrapper">
          <div className="well">
            <Typography variant="h6" className="subtitle mt-10">By</Typography>
          </div>
          <div className="well">
            <FormControl className={classes.formControl}>
              <NativeSelect
                value={filterName}
                name="filterName"
                onChange={this.handleFilter}
              >
                <option value='Director'>Director</option>
                <option value='Supervisor'>Associate</option>
                <option value='ProjectManager'>Project Leader</option>
                <option value='ProjectType'>Project Type</option>
                <option value='ProjectSubType'>Project Sub Type</option>
              </NativeSelect>
            </FormControl>
          </div>
          <div className="right well"></div>
        </div>

        {count > 0 ?
          <div className="well">
            <div style={ship(200)}>
              <Grid container>
                <Grid item md={1} sm={12} xs={12}>
                  {data.slice().reverse().map((d, i) => {
                    return (
                      <p key={i} style={item} className="grayHover" onClick={ event => this.handleElement(event, 'rect', d[filterName])}>
                        {d[filterName]}
                      </p>
                    )
                  })}
                </Grid>

                <Grid item md={11} sm={12} xs={12}>
                  <svg width={width} height={height}>
                    <rect width={width} height={height} fill={'white'} onClick={this.deSelectAll} />
                    <Group top={margin.top} left={margin.left} >
                      {data.map((d, i) => {
                        const barWidth = Math.abs(xScale(x(d)) - xScale(0));
                        const barHeight = yScale.bandwidth();
                        const barX = xScale(Math.min(0, x(d)));
                        const offsetY = (12 / count) * (count / 2 - i);
                        const barY = yScale(y(d, filterName)) + offsetY;

                        const lineX = xScale(Math.max(0, xF(d)));
                        const lineY = barY - yScale.paddingInner() * yScale.step() / 2;
                        const lineHeight = 30;

                        return (
                          <Group key={`${filterName}-${y(d, filterName)}-${i}`}>
                            <Bar
                              x={barX}
                              y={barY}
                              width={barWidth}
                              height={barHeight}
                              fill={this.getColor(d)}
                              onClick={event => {
                                this.handleElement(event, 'bar', d[filterName]);
                              }}
                              onMouseMove={event => {
                                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                this.showTooltip(event, d);
                              }}
                              onMouseLeave={event => {
                                tooltipTimeout = setTimeout(() => {
                                  this.hideTooltip();
                                }, 300);
                              }}
                              onTouchMove={event => {
                                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                this.showTooltip(event, d);
                              }}
                              onTouchEnd={event => {
                                tooltipTimeout = setTimeout(() => {
                                  this.hideTooltip();
                                }, 300);
                              }}
                            />

                            <Bar
                              x={lineX}
                              y={lineY}
                              width={0.5}
                              stroke={"black"}
                              strokeWidth={0.5}
                              height={lineHeight}
                              fill={'black'}
                              onMouseMove={event => {
                                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                this.showTooltip(event, d, false);
                              }}
                              onMouseLeave={event => {
                                tooltipTimeout = setTimeout(() => {
                                  this.hideTooltip();
                                }, 300);
                              }}
                              onTouchMove={event => {
                                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                this.showTooltip(event, d, false);
                              }}
                              onTouchEnd={event => {
                                tooltipTimeout = setTimeout(() => {
                                  this.hideTooltip();
                                }, 300);
                              }}
                            />
                          </Group>
                        );
                      })}
                    </Group>
                  </svg>

                  {tooltipOpen && (
                    <Tooltip
                      top={tooltipTop + pageYOffset}
                      left={tooltipLeft}
                      style={tooltip}
                    >
                      {tooltipData.isBar ?
                        <div>
                          <div className="pdv-5"><strong>{tooltipData[filterName]}</strong></div>
                          <div className="ft-12">Fee Forecast: ${thousandFormat(xF(tooltipData))}</div>
                          <div className="ft-12">Fees Invoiced: ${thousandFormat(x(tooltipData))}</div>
                        </div>
                        :
                        <div>
                          Sum IncomeMTDForecast HistoricalOnly = {thousandFormat(xF(tooltipData))}
                        </div>
                      }
                    </Tooltip>
                  )}

                </Grid>
              </Grid>
            </div>

            <div style={axis}>
              <Grid container>
                <Grid item md={1} sm={12} xs={12}></Grid>

                <Grid item md={11} sm={12} xs={12}>
                  <svg width={width} height={barHeight}>
                    <rect
                      x={0}
                      y={0}
                      width={width}
                      height={barHeight}
                      fill={'transparent'}
                      onClick={event => {
                        this.deSelectAll();
                      }}
                    />
                    <AxisBottom
                      scale={xScale}
                      top={0}
                      hideAxisLine={true}
                      stroke="black"
                      numTicks={15}
                      tickStroke="#a9a9a9"
                      tickLabelProps={(value, index) => ({
                        fill: 'black',
                        fontSize: 11,
                        textAnchor: 'middle',
                        dy: '0.2em'
                      })}
                      tickComponent={({ formattedValue, ...tickProps }) => (
                        <text
                          {...tickProps}
                          onClick={this.deSelectAll}
                        >
                          ${formattedValue}
                        </text>
                      )}
                    />
                  </svg>
                </Grid>
              </Grid>
            </div>
          </div>
          :
          <div style={empty(100)} className="well">No data</div>
        }

      </div>
    );
  }

}


MiddleChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedMonths: PropTypes.array.isRequired,
  selectedTopItems: PropTypes.array.isRequired,

  selectedMiddleItems: PropTypes.array.isRequired,
  filterName: PropTypes.string.isRequired,

  handleFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(withTooltip(MiddleChart));
