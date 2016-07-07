import React from 'react';
import d3 from 'd3';
import Node from './Node.jsx';
const cloneDeep = require('lodash.clonedeep');



class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      tree: d3.layout.tree().size([1340, 1000]),
      width: 1340,
      height: 1000,
      nodeW: 200,
      nodeH: 100,
      nodes: [],
    };
    this.click = this.click.bind(this);
    this.resizeGraph = this.resizeGraph.bind(this);
  }

  componentWillMount() {
    const renderArr = [];
    const root = cloneDeep(this.props.treeData);
    const nodes = this.state.tree.nodes(root).reverse();
    nodes.forEach((d, i) => {
      d.y = d.depth * this.state.height / 3;
      renderArr.push(<Node
        xtranslate={d.x}
        ytranslate={d.y}
        id={i}
        key={i}
        click={this.click}
        name={d.name}
        props={d.props}
        state={d.state}
        methods={d.methods}
        width={this.state.nodeW}
        height={this.state.nodeH}
      />);
    });
    this.setState({ nodes: renderArr });
  }

  componentDidMount() {
    const svg = d3.select(document.getElementById('graphz'));
    const root = cloneDeep(this.props.treeData);
    const nodes = this.state.tree.nodes(root).reverse();
    nodes.forEach((d, i) => {
      d.id = d.id || i;
    });
    const links = this.state.tree.links(nodes);
    const link = svg.selectAll('path.link')
      .data(links, d => {
        return d.target.id;
      });
    const diagonal = d3.svg.diagonal()
      .projection(d => {
        return [d.x + this.state.nodeW / 2, Math.floor(d.y / 1.5)];
      });
    link.enter().insert('svg:path', 'foreignObject')
    .attr('class', 'link')
    .attr('d', diagonal);
    this.resizeGraph();
  }

  click(e) {
    e.preventDefault();
    // do something
  }

  resizeGraph() {
    const graphz = document.getElementById('graphz');
    this.setState({
      nodeW: graphz.getBBox().x + graphz.getBBox().width + 110,
      nodeH: graphz.getBBox().y + graphz.getBBox().height + 100,
    });
  }

  render() {
    const gStyle = {
      transform: 'translate(0px,40px)',
    };
    return (
      <svg height={this.state.height} width={this.state.width}>
        <g style={gStyle} id="graphz">
          {this.state.nodes}
        </g>
        <div className="testing"></div>
      </svg>
    );
  }
}

Graph.propTypes = {
  treeData: React.PropTypes.object.isRequired,
};

Graph.defaultProps = {
  treeData: {
    name: '',
    children: [],
    props: [],
    methods: [],
    state: [],
  },
};

export default Graph;
