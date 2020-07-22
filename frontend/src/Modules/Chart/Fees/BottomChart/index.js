import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { scaleBand, scaleLinear } from '@vx/scale';
import {
  Bar
} from '@vx/shape';
import {Group} from "@vx/group";
import {AxisBottom} from "@vx/axis";
import { withTooltip, Tooltip } from "@vx/tooltip";
import {max} from "d3-array";

import { withStyles } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';

import {
  getParams,
  getMonth,
  isEqualList,
  isEqualObjList,
  thousandFormat
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
  empty, barThinHeight, thinItem
} from "../../../../Assets/js/constant";
// import detailData from '../../../../MockData/Fees/detail';

import { styles } from './style';

// accessors
const x = d => d.ActualFees;
const xF = d => d.ForecastFees;
const y = d => d.ProjectId;


class BottomChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false,

      data: [],
      hoverBar: null,
      selectedBars: [],
      selectedIdRects: [],
      selectedNameRects: [],
      selectedProjects: [],
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
      || !isEqualList(prevProps.selectedMiddleItems, this.props.selectedMiddleItems)
      || prevProps.filterName !== this.props.filterName
    ) {
      this.prepareData();
      this.deSelectAll();
    }
  }

  prepareData = () => {
    const { detailData, filterName, selectedYears, selectedMonths, selectedTopItems, selectedMiddleItems } = this.props;

    let dictData = {};
    let data = [];

    let _selectedMonths = selectedMonths.slice();
    selectedTopItems.forEach(topItem => {
      _selectedMonths.push(topItem['month']);
    });

    detailData.forEach(d => {
      if (
        (_selectedMonths.length === 0 || _selectedMonths.indexOf(getMonth(d.Date)) > -1) &&
        (selectedMiddleItems.length === 0 || selectedMiddleItems.indexOf(d[filterName]) > -1)
      ) {
        if (!dictData[y(d)]) {
          dictData[y(d)] = {};
          dictData[y(d)]['ProjectId'] = y(d);
          dictData[y(d)]['ProjectName'] = d['ProjectName'];
          dictData[y(d)]['ActualFees'] = 0;
          dictData[y(d)]['ForecastFees'] = 0;
        }

        dictData[y(d)]['ActualFees'] += x(d);
        dictData[y(d)]['ForecastFees'] += xF(d);
      }
    });

    Object.keys(dictData).map(key => {
      data.push(dictData[key]);
    });

    this.setState({data});
    this.deSelectAll();
  };

  getColor = (data) => {
    const { selectedProjects } = this.state;
    const activeColor = x(data) < xF(data) ? negativeActiveColor : positiveActiveColor;
    const disableColor = x(data) < xF(data) ? negativeDisableColor : positiveDisableColor;

    if (selectedProjects.length === 0) return activeColor;
    if (selectedProjects.indexOf(y(data)) > -1) return activeColor;
    return disableColor;
  };

  handleElement = (event, element, data) => {
    const { selectedBars, selectedIdRects, selectedNameRects , selectedProjects} = this.state;
    let _selectedBars = [], _selectedIdRects = [], _selectedNameRects = [], _selectedProjects = [];
    let exist = false, index = NaN;

    switch (element) {
      case 'bar':
        if (event.shiftKey) {
          _selectedBars = selectedBars.slice();
          _selectedIdRects = selectedIdRects.slice();
          _selectedNameRects = selectedNameRects.slice();
          _selectedProjects = selectedProjects.slice();

          for (let i = 0; i < selectedBars.length; i++) {
            if (selectedBars[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('barActive');
            _selectedBars.push(event.target);
            _selectedProjects.push(y(data));
          } else {
            event.target.classList.remove('barActive');
            _selectedBars.splice(index, 1);
            _selectedProjects.splice(index, 1);
          }

        } else {
          selectedBars.forEach(selectedBar => {
            selectedBar.classList.remove('barActive');
            if (selectedBar === event.target) exist = true;
          });
          selectedIdRects.forEach(rect => {
            rect.classList.remove('bkgActive');
          });
          selectedNameRects.forEach(rect => {
            rect.classList.remove('bkgActive');
          });

          if (exist && selectedBars.length === 1) {
            _selectedBars = [];
            _selectedIdRects = [];
            _selectedNameRects = [];
            _selectedProjects = [];
          } else {
            event.target.classList.add('barActive');
            _selectedBars = [event.target];
            _selectedIdRects = [];
            _selectedNameRects = [];
            _selectedProjects = [y(data)]
          }
        }

        break;

      case 'ProjectId':
        if (event.shiftKey) {
          _selectedBars = selectedBars.slice();
          _selectedIdRects = selectedIdRects.slice();
          _selectedNameRects = selectedNameRects.slice();
          _selectedProjects = selectedProjects.slice();

          for (let i = 0; i < selectedIdRects.length; i++) {
            if (selectedIdRects[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('bkgActive');
            _selectedIdRects.push(event.target);
            _selectedProjects.push(y(data));
          } else {
            event.target.classList.remove('bkgActive');
            _selectedIdRects.splice(index, 1);
            _selectedProjects.splice(index, 1);
          }

        } else {
          selectedBars.forEach(selectedBar => {
            selectedBar.classList.remove('barActive');
          });
          selectedIdRects.forEach(rect => {
            rect.classList.remove('bkgActive');
            if (rect === event.target) exist = true;
          });
          selectedNameRects.forEach(rect => {
            rect.classList.remove('bkgActive');
          });

          if (exist && selectedIdRects.length === 1) {
            _selectedBars = [];
            _selectedIdRects = [];
            _selectedNameRects = [];
            _selectedProjects = []
          } else {
            event.target.classList.add('bkgActive');
            _selectedBars = [];
            _selectedIdRects = [event.target];
            _selectedNameRects = [];
            _selectedProjects = [y(data)]
          }
        }

        break;

      case 'ProjectName':
        if (event.shiftKey) {
          _selectedBars = selectedBars.slice();
          _selectedIdRects = selectedIdRects.slice();
          _selectedNameRects = selectedNameRects.slice();
          _selectedProjects = selectedProjects.slice();

          for (let i = 0; i < selectedNameRects.length; i++) {
            if (selectedNameRects[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('bkgActive');
            _selectedNameRects.push(event.target);
            _selectedProjects.push(y(data));
          } else {
            event.target.classList.remove('bkgActive');
            _selectedNameRects.splice(index, 1);
            _selectedProjects.splice(index, 1);
          }

        } else {
          selectedBars.forEach(selectedBar => {
            selectedBar.classList.remove('barActive');
          });
          selectedIdRects.forEach(rect => {
            rect.classList.remove('bkgActive');
          });
          selectedNameRects.forEach(rect => {
            rect.classList.remove('bkgActive');
            if (rect === event.target) exist = true;
          });

          if (exist && selectedNameRects.length === 1) {
            _selectedBars = [];
            _selectedIdRects = [];
            _selectedNameRects = [];
            _selectedProjects = [];
          } else {
            event.target.classList.add('bkgActive');
            _selectedBars = [];
            _selectedIdRects = [];
            _selectedNameRects = [event.target];
            _selectedProjects = [y(data)];
          }
        }

        break;

      default:
        break;
    }

    this.setState({
      selectedBars: _selectedBars,
      selectedIdRects: _selectedIdRects,
      selectedNameRects: _selectedNameRects,
      selectedProjects: _selectedProjects
    });
  };

  deSelectAll = () => {
    const { selectedBars, selectedIdRects, selectedNameRects} = this.state;

    selectedBars.forEach(selectedBar => {
      selectedBar.classList.remove('barActive');
    });

    selectedIdRects.forEach(rect => {
      rect.classList.remove('bkgActive');
    });

    selectedNameRects.forEach(rect => {
      rect.classList.remove('bkgActive');
    });

    this.setState({
      selectedBars: [],
      selectedIdRects: [],
      selectedNameRects: [],
      selectedProjects: []
    });
  };

  showTooltip = (event, data, isBar = true) => {
    const { showTooltip } = this.props;
    let tooltipData, top, left;

    top = event.clientY  - 500;
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
      classes,
      tooltipOpen, tooltipLeft, tooltipTop, tooltipData
    } = this.props;

    const { data } = this.state;
    const count = data.length;

    const width = (window.innerWidth - 15) * 3 / 4;
    const height = count * barThinHeight;
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
      domain: data.map(d => y(d)),
      rangeRound: [yMax, 0],
      padding: 0.2
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>

        <div className="well subtitle pdv-5">By Project</div>

        {count > 0 ?
          <div className="well">
            <div style={ship(540)}>
              <Grid container>
                <Grid item md={3} sm={12} xs={12}>
                  {data.slice().reverse().map((d, i) => {
                    return (
                      <div key={i} className="flex">
                        <p style={thinItem} className={`${classes.leftItem} grayHover`} onClick={event => this.handleElement(event, 'ProjectId', d)}>
                          {y(d)}
                        </p>
                        <p style={thinItem} className={`${classes.rightItem} grayHover`} onClick={event => this.handleElement(event, 'ProjectName', d)}>
                          {d.ProjectName}
                        </p>
                      </div>
                    )
                  })}
                </Grid>

                <Grid item md={9} sm={12} xs={12}>
                  <svg width={width} height={height}>
                    <rect width={width} height={height} fill={'white'} onClick={this.deSelectAll} />
                    <Group top={margin.top} left={margin.left} >
                      {data.map((d, i) => {
                        const barWidth = Math.abs(xScale(x(d)) - xScale(0));
                        // const barHeight = yScale.bandwidth() - yScale.paddingInner() * yScale.step() / 2;
                        const barHeight = 16.6;
                        const barX = xScale(Math.min(0, x(d)));
                        const barY = barThinHeight * i + yScale.paddingInner() * yScale.step() / 2;

                        const lineX = xScale(Math.max(0, xF(d)));
                        const lineY = barThinHeight * i;
                        const lineHeight = barThinHeight;

                        return (
                          <Group key={`Project-${y(d)}-${i}`}>
                            <Bar
                              x={barX}
                              y={barY}
                              width={barWidth}
                              height={barHeight}
                              fill={this.getColor(d)}
                              onClick={event => {
                                this.handleElement(event, 'bar', d);
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
                          <div className="pdv-5"><strong>{y(tooltipData)}&nbsp;	&nbsp;	{tooltipData.ProjectName}</strong></div>
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
                <Grid item md={3} sm={12} xs={12}></Grid>

                <Grid item md={9} sm={12} xs={12}>
                  <svg width={width} height={barThinHeight}>
                    <rect
                      x={0}
                      y={0}
                      width={width}
                      height={barThinHeight}
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
          <div style={empty(200)} className="well">No data</div>
        }

      </div>
    );
  }

}


BottomChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedMonths: PropTypes.array.isRequired,
  selectedTopItems: PropTypes.array.isRequired,

  selectedMiddleItems: PropTypes.array.isRequired,
  filterName: PropTypes.string.isRequired,
};

export default withStyles(styles)(withTooltip(BottomChart));
