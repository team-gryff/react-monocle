import React from 'react';


const Node = (props) => {
  const style = {
    transform: `translate(${props.xtranslate}px,${props.ytranslate}px)`,
    width: props.width,
    height: props.height,
    cursor: 'pointer',
    backgroundColor: '#FAFAFA',
    borderRadius: '5px',
    boxShadow: '0 0 1em #90A4AE',
    fontSize: '14px',
  };
  const header = {
    width: '100%',
    height: Math.floor(props.height / 4),
    backgroundColor: '#01579B',
    color: 'white',
    // fontSize: '20px',
  };
  let stateArr = [];
  let propsArr = [];
  let methodsArr = [];
  if (props.state.length !== 0) stateArr = props.state.map(ele => { return ele.name; });
  if (props.props.length !== 0) propsArr = props.props.map(ele => { return ele.name; });
  if (props.methods.length !== 0) methodsArr = props.methods;
  return (
    <foreignObject onMouseEnter={props.highlight} onMouseLeave={props.lowlight}><div
      className="node"
      style={style}
    >
      <div style={header}>
          <h4>{props.name.toUpperCase()}</h4>
      </div>
      State: {stateArr.join(', ')} <br />
      Props: {propsArr.join(', ')} <br />
      Methods: {methodsArr.join(', ')}
    </div></foreignObject>
  );
};

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
