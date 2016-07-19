import React from 'react';
import { Panel, Block, Heading, Text } from 'rebass';
import Popover from 'react-popover';
import NodeUp from './NodeUp.jsx';
import isEqual from 'lodash.isequal';


class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      updating: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.props, nextProps.props)) {
      this.props.highlight(true);
      this.setState({ updating: true });
      setTimeout(() => this.setState({ updating: false }), 550);
      setTimeout(() => this.props.lowlight(), 800);
    }
  }

  toggle() {
    // simple toggle function for a popover
    const bool = !this.state.isOpen;
    return this.setState({ isOpen: bool });
  }

  render() {
    // setting background color depending on state
    let bgColor = '#FAFAFA';
    let updating;
    if (Object.keys(this.props.state).length !== 0) bgColor = '#B3E5FC';
    
    if (this.state.updating) updating = '0 0 3em #2979FF';
    else updating = '0 0 1em #90A4AE';

    // inline styling, as well as using translate coordinates found by d3
    const style = {
      transform: `translate(${this.props.xtranslate}px,${this.props.ytranslate}px)`,
      transition: 'box-shadow 0.5s ease',
      width: this.props.width,
      height: this.props.height,
      cursor: 'pointer',
      backgroundColor: bgColor,
      borderRadius: '5px',
      boxShadow: updating,
      // fontSize: '10px',
      textDecoration: 'none',
    };

    const propsArr = [];
    for (const key in this.props.props) {
      propsArr.push(key);
    }

    return (
      <foreignObject onMouseEnter={this.props.highlight} onMouseLeave={this.props.lowlight} onClick={this.toggle}>
        <Popover
          isOpen={this.state.isOpen}
          preferPlace="row"
          body={<NodeUp
            name={this.props.name}
            state={this.props.state}
            props={this.props.props}
            methods={this.props.methods}
          />}
        >
          <Panel
            className="node"
            style={style}
            theme="secondary"
            p={0}
            my={0}
          >
            <Block
              borderLeft
              borderColor="#263238"
              backgroundColor="#1976D2"
              color="#FAFAFA"
              px={2}
              py={0}
              my={0}
            >
              <Heading size={4}>
                {this.props.name.toUpperCase()}
              </Heading>
            </Block>
            <Text style={{ fontSize: '14px', color: '#546E7A' }}>Props: </Text>
            <Text px={1} style={{ fontSize: '12px' }}>
              {propsArr.join(' | ')} <br />
            </Text>
          </Panel></Popover></foreignObject>
    );
  }
}

Node.propTypes = {
  xtranslate: React.PropTypes.number,
  ytranslate: React.PropTypes.number,
  name: React.PropTypes.string,
  props: React.PropTypes.object,
  state: React.PropTypes.object,
  methods: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  highlight: React.PropTypes.func,
  lowlight: React.PropTypes.func,
};

Node.defaultProps = {
  xtranslate: 0,
  ytranslate: 0,
  name: 'something messed up',
  props: {},
  state: {},
  methods: [],
  width: 200,
  height: 100,
};


export default Node;
