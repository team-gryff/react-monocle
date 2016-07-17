import React from 'react';
import { Table, Heading, Space } from 'rebass';



function NodeUp(props) {
  // booleans to determine what needs to be dipslayed
  const propsBool = Object.keys(props.props).length > 0;
  const stateBool = Object.keys(props.state).length > 0;
  const methodsBool = props.methods.length > 0;
  // headings for the respective tables
  const propsHeadings = ['prop', 'value'];
  const stateHeadings = ['state', 'value'];
  const style = {
    backgroundColor: '#FAFAFA',
    padding: '1em 1em 1em 1em',
    border: '1px solid #78909C',
    borderRadius: '10px',
  };

  // formatting the data for table usage
  const stateData = [];
  for (const key in props.state) {
    stateData.push([key, JSON.stringify(props.state[key], null, 2)]);
  }
  const propsData = []
  for (const key in props.props) {
    propsData.push([key, JSON.stringify(props.props[key], null, 2)]);
  }
  const methodsData = props.methods.map((ele, i) => {
    return (<li key={i}>{ele}</li>);
  })
  return (
    <div style={style}>
      <Heading size={1} style={{ color: '#0088F0' }}>{props.name}</Heading>
      <Space x={4} />
      {
        stateBool ? (<div><Heading>STATE</Heading>
          <Table
            data={stateData}
            headings={stateHeadings}
            /></div>)
          : null
      }
      {propsBool ? (<div><Heading>PROPS</Heading>
        <Table
          data={propsData}
          headings={propsHeadings}
          /></div>)
        : null
      }
      {methodsBool ? (<div><Heading>METHODS</Heading>
        <ul>
          {methodsData}
        </ul>
      </div>)
        : null
      }
      {
        (!propsBool && !stateBool) ? <Heading>nothing to see here!</Heading>
          : null
      }
    </div>
  );
}

NodeUp.propTypes = {
  name: React.PropTypes.string,
  props: React.PropTypes.object,
  state: React.PropTypes.object,
  methods: React.PropTypes.array,
};

NodeUp.defaultProps = {
  name: 'Component',
  props: {},
  state: {},
  methods: [],
};


export default NodeUp;
