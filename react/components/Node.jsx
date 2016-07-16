import React from 'react';
import { Panel, Block, Heading, Text } from 'rebass';
import Popover from 'react-popover';
import NodeUp from './NodeUp.jsx';


class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false }; // stateful component for popover boolean
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    // simple toggle function for a popover
    const bool = !this.state.isOpen;
    return this.setState({ isOpen: bool });
  }

  close() {
    return this.setState({ isOpen: false });
  }

  render() {
    // setting background color depending on state
    let bgColor = '#FAFAFA';
    if (this.props.state.length !== 0) bgColor = '#B3E5FC';
    // inline styling, as well as using translate coordinates found by d3
    const style = {
      transform: `translate(${this.props.xtranslate}px,${this.props.ytranslate}px)`,
      width: this.props.width,
      height: this.props.height,
      cursor: 'pointer',
      backgroundColor: bgColor,
      borderRadius: '5px',
      boxShadow: '0 0 1em #90A4AE',
      // fontSize: '10px',
      textDecoration: 'none',
    };
    let propsArr = [];
    if (this.props.props.length !== 0) propsArr = this.props.props.map(ele => { return ele.name; });

    return (
      <foreignObject onMouseEnter={this.props.highlight} onMouseLeave={this.props.lowlight} onClick={this.toggle}>
        <Popover
          isOpen={this.state.isOpen}
          preferPlace="row"
          onOuterAction={this.close}
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
  props: React.PropTypes.array,
  state: React.PropTypes.array,
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
  props: [],
  state: [],
  methods: [],
  width: 200,
  height: 100,
};


export default Node;
