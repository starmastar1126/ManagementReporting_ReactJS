import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from "@vx/tooltip";
import { AxisLeft, AxisBottom } from '@vx/axis';
import { localPoint } from "@vx/event";
import { max } from "d3-array";

import {
  getParams,
  isEqualList,
  getIndexFromObjList,
  thousandFormat
} from "../../../../Utils/Functions";
import {
  daysRangeKeys, debtorKeyTextMap, debtorColors, barHeight, activeLabelColor
} from "../../../../Assets/js/constant";

import { styles } from './style';

const xSelector = d => d.Total;
const ySelector = d => d.Director;


class ItemsChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false,
      data: [],
      keys: [],
      activeStack: null,
      selectedStacks: []
    };

    this._prepareData = this._prepareData.bind(this);
    this._handleStackSelect = this._handleStackSelect.bind(this);
    this._handleLabelSelect = this._handleLabelSelect.bind(this);
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
      || !isEqualList(prevProps.selectedDaysRanges, this.props.selectedDaysRanges)
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
    const { detailData, selectedDaysRanges } = this.props;
    const keys = selectedDaysRanges.length === 0 || selectedDaysRanges[selectedDaysRanges.length - 1] === 'Total' ? daysRangeKeys : selectedDaysRanges;

    let colors = keys.reduce((ret, key) => {
      ret.push(debtorColors[key]);
      return ret;
    }, []);

    let data = {};
    detailData.forEach(d => {
      if (!data[ySelector(d)]) data[ySelector(d)] = {};

      if (!data[ySelector(d)]['Total']) data[ySelector(d)]['Total'] = 0;
      data[ySelector(d)]['Total'] += d.InvoiceAmount;

      keys.forEach(key => {
        if (!data[ySelector(d)][key]) data[ySelector(d)][key] = 0;
        data[ySelector(d)][key] += d[key];
      });
    });

    this.setState({
      data: Object.keys(data).map(Director => {
        let d = data[Director];
        d.Director = Director;
        keys.forEach(key => {
          if (!d[key]) d[key] = 0
        });
        return d;
      }),
      keys: keys,
      colors: colors
    });
  };

  _handleStackSelect = (event, bar) => {
    const { selectedItems, selectedItemStacks } = this.props;
    const { selectedStacks } = this.state;
    const stack = {
      director: ySelector(bar.bar.data),
      daysRange: bar.key
    };
    const index = getIndexFromObjList(selectedItemStacks, stack);

    let _selectedItems = [];
    let _selectedItemStacks = [];
    let _selectedStacks = [];

    if (event.shiftKey) {
      _selectedItems = selectedItems.slice();
      _selectedItemStacks = selectedItemStacks.slice();
      _selectedStacks = selectedStacks.slice();

      if (index > -1) {
        event.target.classList.remove('barActive');
        _selectedStacks.splice(index, 1);
        _selectedItemStacks.splice(index, 1);
      } else {
        event.target.classList.add('barActive');
        _selectedStacks.push(event.target);
        _selectedItemStacks.push(stack);
      }
    } else {
      _selectedItems = [];
      selectedStacks.forEach(selectedStack => {
        selectedStack.classList.remove('barActive');
      });

      if (index > -1 && selectedItems.length === 0 && selectedItemStacks.length === 1) {
        _selectedStacks = [];
        _selectedItemStacks = [];
      } else {
        event.target.classList.add('barActive');
        _selectedStacks = [event.target];
        _selectedItemStacks = [stack]
      }
    }

    this.setState({selectedStacks: _selectedStacks});
    this.props.handleFilter({
      selectedItems: _selectedItems,
      selectedItemStacks: _selectedItemStacks
    });
  };

  _handleLabelSelect = (event, director) => {
    const { selectedItems, selectedItemStacks } = this.props;
    const { selectedStacks } = this.state;
    const index = selectedItems.indexOf(director);

    let _selectedItems = [];
    let _selectedItemStacks = [];
    let _selectedStacks = [];

    if (event.shiftKey) {
      _selectedItems = selectedItems.slice();
      _selectedItemStacks = selectedItemStacks.slice();
      _selectedStacks = selectedStacks.slice();

      if (index > -1) {
        _selectedItems.splice(index, 1);
      } else {
        _selectedItems.push(director);
      }
    } else {
      _selectedItemStacks = [];
      _selectedStacks = [];

      selectedStacks.forEach(selectedStack => {
        selectedStack.classList.remove('barActive');
      });

      if (index > -1 && selectedItems.length === 1 && selectedItemStacks.length === 0) {
        _selectedItems = []
      } else {
        _selectedItems = [director];
      }
    }

    this.setState({selectedStacks: _selectedStacks});
    this.props.handleFilter({
      selectedItems: _selectedItems,
      selectedItemStacks: _selectedItemStacks
    });
  };

  _showTooltip = (event, bar) => {
    const { activeStack } = this.state;
    if (activeStack) activeStack.classList.remove('barHover');
    event.target.classList.add('barHover');
    this.setState({activeStack: event.target});

    this.props.showTooltip({
      tooltipData: bar,
      tooltipTop: localPoint(event).y,
      tooltipLeft: localPoint(event).x,
    });
  };

  _hideTooltip = () => {
    const { activeStack } = this.state;
    if (activeStack) activeStack.classList.remove('barHover');
    this.setState({activeStack: null});

    this.props.hideTooltip();
  };

  _deSelectAll = () => {
    this.state.selectedStacks.forEach(selectedStack => {
      selectedStack.classList.remove('barActive');
    });
    this.setState({selectedStacks: []});
    this.props.handleFilter({
      selectedItems: [],
      selectedItemStacks: []
    });
  };

  render() {
    const {
      classes,
      tooltipOpen, tooltipData, tooltipTop, tooltipLeft,
      selectedItems
    } = this.props;
    const { data, keys, colors } = this.state;

    const width = window.innerWidth < 768 ? window.innerWidth - 12 : window.innerWidth *5 / 12 - 10;
    const height = 150;
    const margin = {
      top: 10,
      right: 0,
      bottom: 20,
      left: 80
    };
    const { pageYOffset, xMax, yMax } = getParams(window, width, height, margin);

    if (data.length === 0 || keys.length === 0) return null;

    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [0, max(data, xSelector)],
      nice: true,
    });
    const yScale = scaleBand({
      rangeRound: [yMax, yMax - barHeight * data.length],
      domain: data.map(ySelector),
      padding: 0.2,
    });
    const color = scaleOrdinal({
      domain: keys,
      range: colors,
    });

    let tooltipTimeout;

    return (
      <div className={classes.root}>
        <Typography variant="h6" className="subtitle mb-10">By Director</Typography>

        <div>
          <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="transparent" onClick={this._deSelectAll} />

            {
              data.map((d, index) => {
                return (
                  <rect
                    key={index}
                    x={0} y={yScale(ySelector(d)) + 8}
                    width={margin.left} height={barHeight}
                    fill={selectedItems.indexOf(ySelector(d)) > -1 ? activeLabelColor : 'transparent'}
                    onClick={(event) => {this._handleLabelSelect(event, ySelector(d))}}
                  />
                )
              })
            }

            <Group top={margin.top} left={margin.left}>
              <AxisLeft
                hideTicks={true}
                scale={yScale}
                stroke="black"
                tickStroke="black"
                tickLabelProps={(value, index) => ({
                  fill: 'black',
                  fontSize: 11,
                  textAnchor: 'end',
                  dy: '0.33em',
                })}
                tickComponent={({ formattedValue, ...tickProps }) => (
                  <text
                    {...tickProps}
                    fill={selectedItems.indexOf(formattedValue) > -1 ? 'white' : 'black'}
                    onClick={(event) => this._handleLabelSelect(event, formattedValue)}
                  >
                    {formattedValue}
                  </text>
                )}
              />

              <BarStackHorizontal
                data={data}
                keys={keys}
                height={yMax}
                y={ySelector}
                xScale={xScale}
                yScale={yScale}
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
                          height={bar.height}
                          fill={bar.color}
                          onClick={event => {
                            this._handleStackSelect(event, bar);
                          }}
                          onMouseLeave={event => {
                            tooltipTimeout = setTimeout(() => {
                              this._hideTooltip();
                            }, 300);
                          }}
                          onMouseMove={event => {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            this._showTooltip(event, bar);
                          }}
                          onTouchEnd={event => {
                            tooltipTimeout = setTimeout(() => {
                              this._hideTooltip();
                            }, 300);
                          }}
                          onTouchMove={event => {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            this._showTooltip(event, bar);
                          }}
                        />
                      );
                    });
                  });
                }}
              </BarStackHorizontal>

              <AxisBottom
                scale={xScale}
                top={yMax}
                stroke="black"
                numTicks={6}
                tickStroke="black"
                tickLabelProps={(value, index) => ({
                  fill: 'black',
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
            </Group>
          </svg>

          {tooltipOpen && (
            <Tooltip
              top={tooltipTop + margin.top + margin.bottom}
              left={tooltipLeft}
              style={{
                minWidth: 60,
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <p className="tooltipPanel"><strong>{ySelector(tooltipData.bar.data)}</strong></p>
              <p className="tooltipPanel">{`${debtorKeyTextMap[tooltipData.key]} days`}</p>
              <p className="tooltipPanel">{`$${thousandFormat(tooltipData.bar.data[tooltipData.key])}`}</p>
            </Tooltip>
          )}
        </div>
      </div>
    )
  }

}


ItemsChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  selectedDaysRanges: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  selectedItemStacks: PropTypes.array.isRequired,

  handleFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(withTooltip(ItemsChart));
