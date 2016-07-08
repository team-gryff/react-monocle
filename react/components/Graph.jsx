import React from 'react';
import d3 from 'd3';
import Node from './Node.jsx';
const cloneDeep = require('lodash.clonedeep');



class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      tree: d3.layout.tree().size([1300, 900]),
      width: 1300,
      height: 900,
      nodeW: 200,
      nodeH: 100,
      nodes: [],
    };
    this.highlight = this.highlight.bind(this);
    this.lowlight = this.lowlight.bind(this);
    this.resizeGraph = this.resizeGraph.bind(this);
    this.updateLinks = this.updateLinks.bind(this);
    this.highlightRecursion = this.highlightRecursion.bind(this);
  }

  componentWillMount() {
    const renderArr = [];
    const root = cloneDeep(this.props.treeData);
    const nodes = this.state.tree.nodes(root).reverse();
    nodes.forEach((d, i) => {
      d.y = d.depth * this.state.height / 3;
      d.id = d.id || i;
      renderArr.push(<Node
        xtranslate={d.x}
        ytranslate={d.y}
        id={i}
        key={i}
        highlight={this.highlight.bind(this, i)}
        lowlight={this.lowlight}
        name={d.name}
        props={d.props}
        state={d.state}
        methods={d.methods}
        width={this.state.nodeW}
        height={this.state.nodeH}
      />);
    });
    this.setState({
      nodes: renderArr,
      d3nodes: nodes,
    });
  }

  componentDidMount() {
    this.updateLinks();
  }

  updateLinks() {
    const svg = d3.select(document.getElementById('graphz'));
    const links = this.state.tree.links(this.state.d3nodes);
    const link = svg.selectAll('path.link')
      .data(links, d => { return d.target.id; });
    const diagonal = d3.svg.diagonal()
      .projection(d => { return [d.x + this.state.nodeW / 2, d.y]; });
    link.enter().insert('svg:path', 'foreignObject')
    .attr('class', 'link')
    .attr('d', diagonal);
    this.resizeGraph();
  }

  highlightRecursion(d) {
    if (!d.parent) return d;
    d3.select(document.getElementById('graphz'))
    .selectAll('path.link').filter(ele => {
      if (ele.source.id === d.parent.id && ele.target.id === d.id) return ele;
      return false;
    })
    .classed('highlight', true);
    return this.highlightRecursion(d.parent);
  }

  highlight(i, e) {
    e.preventDefault();
    this.state.d3nodes.forEach(ele => {
      if (ele.id === i) this.highlightRecursion(ele);
    });
    return true;
  }

  lowlight() {
    return d3.select(document.getElementById('graphz'))
           .selectAll('path.link')
           .classed('highlight', false);
  }

  resizeGraph() {
    const graphz = document.getElementById('graphz');
    console.log({
      width: graphz.getBBox().x + graphz.getBBox().width + 110,
      height: graphz.getBBox().y + graphz.getBBox().height + 100,
    });
    this.setState({
      width: graphz.getBBox().x + graphz.getBBox().width + 110,
      height: graphz.getBBox().y + graphz.getBBox().height + 100,
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
