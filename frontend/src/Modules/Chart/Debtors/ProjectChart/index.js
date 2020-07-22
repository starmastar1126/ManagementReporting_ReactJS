import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import {Bar, BarStackHorizontal} from '@vx/shape';
import { withTooltip, Tooltip } from "@vx/tooltip";
import { AxisBottom } from '@vx/axis';
import { localPoint } from "@vx/event";
import { max } from "d3-array";

import {
  isMulti,
  getIndexFromElementList,
  getIndexFromObjList,
  deActivateEls,
  isEqualList,
  isEqualObjList,
  thousandFormat
} from "../../../../Utils/Functions";
import {
  daysRangeKeys, debtorKeyTextMap, debtorColors, ship, axis, thinAxis, barThinHeight
} from "../../../../Assets/js/constant";

import { styles } from './style';


const xSelector = d => d.Total;
const ySelector = d => d.ProjectName;


class ProjectChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      keys: [],
      colors: [],

      selectedClientEls: [],
      selectedInvoiceEls: [],
      selectedProjectEls: [],
      selectedBars: [],

      activeBar: null
    };

    this._prepareData = this._prepareData.bind(this);
    this._handleElementSelect = this._handleElementSelect.bind(this);
    this._deSelectAll = this._deSelectAll.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    this._prepareData();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    if (
      prevProps.detailData.length !== this.props.detailData.length
      || prevProps.selectedYears.length !== this.props.selectedYears.length
      || !isEqualList(prevProps.selectedDaysRanges, this.props.selectedDaysRanges)
      || !isEqualList(prevProps.selectedItems, this.props.selectedItems)
      || !isEqualObjList(prevProps.selectedItemStacks, this.props.selectedItemStacks)
    ) {
      this._deSelectAll();
      this._prepareData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  _prepareData = () => {
    const { detailData, selectedDaysRanges, selectedItems, selectedItemStacks } = this.props;
    const keys = selectedDaysRanges.length === 0 || selectedDaysRanges[selectedDaysRanges.length - 1] === 'Total' ? daysRangeKeys : selectedDaysRanges;

    let colors = keys.reduce((ret, key) => {
      ret.push(debtorColors[key]);
      return ret;
    }, []);

    let data = {};
    detailData.forEach(d => {
      if ((selectedItems.length === 0 && selectedItemStacks.length === 0) || selectedItems.indexOf(d.Director) > -1) {
        if (!data[d.ClientName]) data[d.ClientName] = {};
        if (!data[d.ClientName][d.ProjectName]) data[d.ClientName][d.ProjectName] = {};
        if (!data[d.ClientName][d.ProjectName]['Total']) data[d.ClientName][d.ProjectName]['Total'] = 0;
        if (!data[d.ClientName][d.ProjectName]['InvoiceNumber']) data[d.ClientName][d.ProjectName]['InvoiceNumber'] = d.InvoiceNumber;
        if (!data[d.ClientName][d.ProjectName]['details']) data[d.ClientName][d.ProjectName]['details'] = d;

        keys.forEach(key => {
          if (!data[d.ClientName][d.ProjectName][key]) data[d.ClientName][d.ProjectName][key] = 0;
          data[d.ClientName][d.ProjectName]['Total'] += d[key];
          data[d.ClientName][d.ProjectName][key] += d[key];
        });

      } else {
        if (selectedItemStacks.length > 0 ) {
          keys.forEach(key => {
            const stack = {
              director: d.Director,
              daysRange: key
            };

            if (getIndexFromObjList(selectedItemStacks, stack) > -1) {
              if (!data[d.ClientName]) data[d.ClientName] = {};
              if (!data[d.ClientName][d.ProjectName]) data[d.ClientName][d.ProjectName] = {};
              if (!data[d.ClientName][d.ProjectName]['Total']) data[d.ClientName][d.ProjectName]['Total'] = 0;
              if (!data[d.ClientName][d.ProjectName]['InvoiceNumber']) data[d.ClientName][d.ProjectName]['InvoiceNumber'] = d.InvoiceNumber;
              if (!data[d.ClientName][d.ProjectName]['details']) data[d.ClientName][d.ProjectName]['details'] = d;
              if (!data[d.ClientName][d.ProjectName][key]) data[d.ClientName][d.ProjectName][key] = 0;

              data[d.ClientName][d.ProjectName]['Total'] += d[key];
              data[d.ClientName][d.ProjectName][key] += d[key];
            }
          });
        }
      }
    });

    this.setState({
      data: Object.keys(data).map(ClientName => {
        return Object.keys(data[ClientName]).map(ProjectName => {
          let d = data[ClientName][ProjectName];
          d.ClientName = ClientName;
          d.ProjectName = ProjectName;

          keys.forEach(key => {
            if (!d[key]) d[key] = 0
          });

          return d;
        });
      }),
      keys: keys,
      colors: colors
    });
  };

  _handleElementSelect = (event, element) => {
    const { selectedClientEls, selectedInvoiceEls, selectedProjectEls, selectedBars } = this.state;
    let _selectedClientEls = [];
    let _selectedInvoiceEls = [];
    let _selectedProjectEls = [];
    let _selectedBars = [];
    let index = -1;

    if (event.shiftKey) {
      _selectedClientEls = selectedClientEls.slice();
      _selectedInvoiceEls = selectedInvoiceEls.slice();
      _selectedProjectEls = selectedProjectEls.slice();
      _selectedBars = selectedBars.slice();

      switch (element) {
        case 'Client':
          index = getIndexFromElementList(selectedClientEls, event.target);
          if (index > -1) {
            event.target.classList.remove('bkgActive');
            _selectedClientEls.splice(index, 1);
          } else {
            event.target.classList.add('bkgActive');
            _selectedClientEls.push(event.target);
          }
          break;
        case 'Invoice':
          index = getIndexFromElementList(selectedInvoiceEls, event.target);
          if (index > -1) {
            event.target.classList.remove('bkgActive');
            _selectedInvoiceEls.splice(index, 1);
          } else {
            event.target.classList.add('bkgActive');
            _selectedInvoiceEls.push(event.target);
          }
          break;
        case 'Project':
          index = getIndexFromElementList(selectedProjectEls, event.target);
          if (index > -1) {
            event.target.classList.remove('bkgActive');
            _selectedProjectEls.splice(index, 1);
          } else {
            event.target.classList.add('bkgActive');
            _selectedProjectEls.push(event.target);
          }
          break;
        case 'Bar':
          index = getIndexFromElementList(selectedBars, event.target);
          if (index > -1) {
            event.target.classList.remove('barActive');
            _selectedBars.splice(index, 1);
          } else {
            event.target.classList.add('barActive');
            _selectedBars.push(event.target);
          }
          break;
        default:
          break;
      }

    } else {
      _selectedClientEls = [];
      _selectedInvoiceEls = [];
      _selectedProjectEls = [];
      _selectedBars = [];

      deActivateEls(selectedClientEls, 'bkgActive');
      deActivateEls(selectedInvoiceEls, 'bkgActive');
      deActivateEls(selectedProjectEls, 'bkgActive');
      deActivateEls(selectedBars, 'barActive');

      switch (element) {
        case 'Client':
          index = getIndexFromElementList(selectedClientEls, event.target);
          if (index < 0 || selectedClientEls.length > 1 || isMulti([selectedInvoiceEls, selectedProjectEls, selectedBars])) {
            event.target.classList.add('bkgActive');
            _selectedClientEls = [event.target];
          }
          break;
        case 'Invoice':
          index = getIndexFromElementList(selectedInvoiceEls, event.target);
          if (index < 0 || selectedInvoiceEls.length > 1 || isMulti([selectedClientEls, selectedProjectEls, selectedBars])) {
            event.target.classList.add('bkgActive');
            _selectedInvoiceEls = [event.target];
          }
          break;
        case 'Project':
          index = getIndexFromElementList(selectedProjectEls, event.target);
          if (index < 0 || selectedProjectEls.length > 1 || isMulti([selectedClientEls, selectedInvoiceEls, selectedBars])) {
            event.target.classList.add('bkgActive');
            _selectedProjectEls = [event.target];
          }
          break;
        case 'Bar':
          index = getIndexFromElementList(selectedBars, event.target);
          if (index < 0 || selectedBars.length > 1 || isMulti([selectedClientEls, selectedInvoiceEls, selectedProjectEls])) {
            event.target.classList.add('barActive');
            _selectedBars = [event.target];
          }
          break;
        default:
          break;
      }
    }

    this.setState({
      selectedClientEls: _selectedClientEls,
      selectedInvoiceEls: _selectedInvoiceEls,
      selectedProjectEls: _selectedProjectEls,
      selectedBars: _selectedBars
    });
  };

  _showTooltip = (event, bar, position) => {
    const { activeBar } = this.state;
    if (activeBar) activeBar.classList.remove('barHover');
    event.target.classList.add('barHover');
    this.setState({activeBar: event.target});

    const offsetX = window.innerWidth < 768 ? 0 : window.innerWidth / 3 - 10;
    let offsetY = 0;
    for (let i = 0; i < position; i++) {
      offsetY += this.state.data[i].length * barThinHeight;
    }
    offsetY -= document.getElementById("wrapper").scrollTop;

    const tooltipData = {
      ...bar.bar.data.details,
      key: bar.key,
      index: bar.index,
      Total: bar.bar.data.Total
    };

    this.props.showTooltip({
      tooltipData: tooltipData,
      tooltipTop: localPoint(event).y + offsetY + 40,
      tooltipLeft: localPoint(event).x + offsetX,
    });
  };

  _hideTooltip = () => {
    const { activeBar } = this.state;
    if (activeBar) activeBar.classList.remove('barHover');
    this.setState({activeBar: null});

    this.props.hideTooltip();
  };

  _deSelectAll = () => {
    const { selectedClientEls, selectedInvoiceEls, selectedProjectEls, selectedBars } = this.state;

    deActivateEls(selectedClientEls, 'bkgActive');
    deActivateEls(selectedInvoiceEls, 'bkgActive');
    deActivateEls(selectedProjectEls, 'bkgActive');
    deActivateEls(selectedBars, 'barActive');

    this.setState({
      selectedClientEls: [],
      selectedInvoiceEls: [],
      selectedProjectEls: [],
      selectedBars: []
    })
  };

  render() {
    const {
      classes,
      tooltipOpen, tooltipData, tooltipTop, tooltipLeft
    } = this.props;
    const { data, keys, colors } = this.state;

    const width = window.innerWidth < 768 ? window.innerWidth - 12 : window.innerWidth * 2 / 3 - 40;
    const xMax = width;

    if (data.length === 0 || keys.length === 0) return null;

    let yScales = [];
    let xMaxValue = 0;
    data.forEach(d => {
      yScales.push(
        scaleBand({
          rangeRound: [barThinHeight * d.length, 0],
          domain: d.map(ySelector),
          padding: 0.2,
        })
      );

      let m = max(d, xSelector);
      if (m > xMaxValue) xMaxValue = m;
    });

    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [0, xMaxValue],
      nice: true,
    });
    const color = scaleOrdinal({
      domain: keys,
      range: colors,
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>
        <div className="well">
          <Typography variant="h6" className="subtitle mb-10">By Project</Typography>
        </div>

        <div className="well">
          <div style={ship(540)} id="wrapper">
            {data.map((d1, i) => {
              const yMax = d1.length * barThinHeight;

              return (
                <Grid container key={i} className={classes.wrapper}>
                  <Grid item md={4} sm={12} xs={12}>
                    <Grid container>
                      <Grid item md={5} className="grayHover" onClick={event => this._handleElementSelect(event, 'Client')}>
                        {d1[0].ClientName}
                      </Grid>
                      <Grid item md={2}>
                        {d1.map((d2, j) => {
                          return (
                            <p key={`${i}-${j}`} className="grayHover" onClick={event => this._handleElementSelect(event, 'Client')}>
                              {d2.InvoiceNumber}
                            </p>
                          )
                        })}
                      </Grid>
                      <Grid item md={5}>
                        {d1.map((d2, j) => {
                          return (
                            <p key={`${i}-${j}`} className="grayHover" onClick={event => this._handleElementSelect(event, 'Client')}>
                              {d2.ProjectName}
                            </p>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={8} sm={12} xs={12}>
                    <div>
                      <svg width={width} height={yMax}>
                        <rect x={0} y={0} width={width} height={yMax} fill="transparent" onClick={this._deSelectAll}/>

                        <BarStackHorizontal
                          data={d1}
                          keys={keys}
                          height={yMax}
                          y={ySelector}
                          xScale={xScale}
                          yScale={yScales[i]}
                          color={color}
                        >
                          {barStacks => {
                            return barStacks.map(barStack => {
                              return barStack.bars.map(bar => {
                                return (
                                  <rect
                                    key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                                    x={bar.x}
                                    y={bar.y}
                                    width={bar.width}
                                    // height={bar.height}
                                    height={16.6}
                                    fill={bar.color}
                                    onClick={event => {
                                      this._handleElementSelect(event, 'Bar');
                                    }}
                                    onMouseLeave={event => {
                                      tooltipTimeout = setTimeout(() => {
                                        this._hideTooltip();
                                      }, 300);
                                    }}
                                    onMouseMove={event => {
                                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                      this._showTooltip(event, bar, i);
                                    }}
                                    onTouchEnd={event => {
                                      tooltipTimeout = setTimeout(() => {
                                        this._hideTooltip();
                                      }, 300);
                                    }}
                                    onTouchMove={event => {
                                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                      this._showTooltip(event, bar, i);
                                    }}
                                  />
                                );
                              });
                            });
                          }}
                        </BarStackHorizontal>
                      </svg>

                      {tooltipOpen && (
                        <Tooltip
                          top={tooltipTop}
                          left={tooltipLeft}
                          style={{
                            minWidth: 60,
                            backgroundColor: 'white',
                            color: 'black',
                          }}
                        >
                          <p className="tooltipPanel">{'Client: '}<strong>{tooltipData.ClientName}</strong></p>
                          <p className="tooltipPanel">{'Project: '}<strong>{tooltipData.ProjectName}</strong></p>
                          <p className="tooltipPanel">{'Director: '}<strong>{tooltipData.Director}</strong></p>
                          <br/>
                          <p className="tooltipPanel">{'Age: '}<strong>{debtorKeyTextMap[tooltipData.key]}</strong></p>
                          <p className="tooltipPanel">{'Amount: '}<strong>${thousandFormat(tooltipData.InvoiceAmount)}</strong></p>
                        </Tooltip>
                      )}
                    </div>
                  </Grid>
                </Grid>
              )
            })}
          </div>

          <div style={thinAxis} onClick={this._deSelectAll}>
            <Grid container>
              <Grid item md={4} sm={12} xs={12}></Grid>

              <Grid item md={8} sm={12} xs={12}>
                <svg width={width} height={barThinHeight}>
                  <rect x={0} y={0} width={width} height={barThinHeight} fill={'transparent'}/>

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
      </div>
    );
  }
}


ProjectChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedDaysRanges: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  selectedItemStacks: PropTypes.array.isRequired,

  handleFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(withTooltip(ProjectChart));
