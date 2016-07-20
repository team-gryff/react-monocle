import React from 'react';
import { tree, hierarchy, select, path } from 'd3';
import Node from './Node.jsx';
const cloneDeep = require('lodash.clonedeep');
const isEqual = require('lodash.isequal');


class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 1000,
      height: 900,
      initialHeight: 900,
      nodeW: 145.62, // golden ratio
      nodeH: 90,
      nodes: [],
    };
    this.highlight = this.highlight.bind(this);
    this.lowlight = this.lowlight.bind(this);
    this.resizeGraph = this.resizeGraph.bind(this);
    this.highlightRecursion = this.highlightRecursion.bind(this);
    this.nodeRender = this.nodeRender.bind(this);
    this.linkRender = this.linkRender.bind(this);
    this.resizeGraph = this.resizeGraph.bind(this);
    this.propUpdate = this.propUpdate.bind(this);
    this.propDoneUpdate = this.propDoneUpdate.bind(this);
  }

  /**
   * Clone tree data, pass to tree() to create nodes objects, setting state to render nodes,
   */
  componentWillMount() {
    const nodes = tree().size([window.innerWidth * 0.6, this.state.height])(hierarchy(this.props.treeData));
    return this.nodeRender(nodes); // react render
  }

  /**
   * add resize event listener to resize graph, render links
   */
  componentDidMount() {
    window.addEventListener('resize', this.resizeGraph);
    this.linkRender(this.state.d3nodes, this.state.d3nodes, 1);  // d3 dom injection
  }

  componentWillReceiveProps(nextProps) {
    const nodes = tree().size([window.innerWidth * 0.6, this.state.height])(hierarchy(nextProps.treeData));
    this.nodeRender(nodes); // react render
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.width !== this.state.width || (this.state.nodes && prevState.nodes && prevState.nodes.length !== this.state.nodes.length)) {
      this.linkRender(this.state.d3nodes, prevState.d3nodes, 500);
    }
    return true;
  }

  componentWillUnmount() {
    select(document.getElementById('graphz'))
    .selectAll('path.link').remove();
    window.removeEventListener('resize', this.resizeGraph);
  }

  propUpdate(i) {
    select(document.getElementById('graphz'))
    .selectAll('path.link').filter(ele => {
      if (ele.target.id === i) return ele;
      return false;
    })
    .classed('propchange', true);
  }

  propDoneUpdate(i) {
    select(document.getElementById('graphz'))
    .selectAll('path.link').filter(ele => {
      if (ele.target.id === i) return ele;
      return false;
    })
    .classed('propchange', false);
  }


  highlightRecursion(d) {
    // finds out which links to highlight
    // recurses up to where there is no parent (top most node)
    if (!d.parent) return d;
    select(document.getElementById('graphz'))
    .selectAll('path.link').filter(ele => {
      if (ele.source.id === d.parent.id && ele.target.id === d.id) return ele;
      return false;
    })
    .classed('highlight', true);
    return this.highlightRecursion(d.parent);
  }

  highlight(i) {
    // highlight links on hover over
    this.state.d3nodes.each(ele => {
      if (ele.id && ele.id === i) this.highlightRecursion(ele);
    });
    return true;
  }

  lowlight() {
    // unhighlight on cursor exit
    return select(document.getElementById('graphz'))
           .selectAll('path.link')
           .classed('highlight', false)
           .classed('propchange', false);
  }

  nodeRender(nodes) {
    let i = 0;
    const renderArr = [];

    nodes.each(d => {
      d.y = d.depth * this.state.initialHeight / 5;
      d.id = d.id || ++i;
      // using the information provided by d3
      // to render Node components
      renderArr.push(<Node
        xtranslate={d.x}
        ytranslate={d.y}
        key={i}
        highlight={this.highlight.bind(this, i)}
        lowlight={this.lowlight}
        propUpdate={this.propUpdate.bind(this, i)}
        propDoneUpdate={this.propDoneUpdate.bind(this, i)}
        name={d.data.name}
        props={d.data.props}
        state={d.data.state}
        methods={d.data.methods}
        width={this.state.nodeW}
        height={this.state.nodeH}
      />);
    });

    // setting state so information can be used in render + other methods
    this.setState({
      nodes: renderArr,
      d3nodes: nodes,
      width: window.innerWidth * 0.6,
    });
    return nodes;
  }


  linkRender(nodes, prev, duration) {
    const graphz = document.getElementById('graphz');
    const links = nodes.links();

    const prevPositions = {};
    prev.each(d => {
      prevPositions[d.id] = {
        x: d.x,
        y: d.y,
      };
    });

    select(document.getElementById('graphz'))
    .selectAll('path.link').remove();

    select(document.getElementById('graphz'))
    .selectAll('path.link').data(links, d => { return d.target.id; })
    .enter()
    .insert('svg:path', 'foreignObject')
    .attr('class', 'link')
    .attr('d', (node) => {
      const pathing = path();
      if (prevPositions.hasOwnProperty(node.source.id) && prevPositions.hasOwnProperty(node.target.id)) {
        const oldX = prevPositions[node.source.id].x;
        const oldY = prevPositions[node.source.id].y;
        const newX = prevPositions[node.target.id].x;
        const newY = prevPositions[node.target.id].y;
        pathing.moveTo(oldX + this.state.nodeW / 2, oldY);
        pathing.bezierCurveTo(oldX + this.state.nodeW / 2, (oldY + newY) / 2, newX + this.state.nodeW / 2, (oldY + newY) / 2, newX + this.state.nodeW / 2, newY);
        return pathing;
      }
      pathing.moveTo(node.source.x + this.state.nodeW / 2, node.source.y + this.state.nodeH / 2);
      pathing.lineTo(node.source.x + this.state.nodeW / 2 + 1, node.source.y + 1);
      return pathing;
    })
    .transition()
    .duration(duration)
    .attr('d', (node) => {
      // creating a cubic bezier curve for the link
      // equiv to d3.svg.diagonal before 4.0
      const oldX = node.source.x;
      const oldY = node.source.y;
      const newX = node.target.x;
      const newY = node.target.y;
      const pathing = path();
      pathing.moveTo(oldX + this.state.nodeW / 2, oldY);
      pathing.bezierCurveTo(oldX + this.state.nodeW / 2, (oldY + newY) / 2, newX + this.state.nodeW / 2, (oldY + newY) / 2, newX + this.state.nodeW / 2, newY);
      return pathing;
    });

    if (this.state.height > this.state.currentHeight) this.setState({ height: graphz.getBBox().y + graphz.getBBox().height + 100 });
  }

  resizeGraph() {
    // makes sure graph is the right size after rendering the graph
    const root = cloneDeep(this.props.treeData);
    const nodes = tree().size([this.state.width, this.state.initialHeight])(hierarchy(root));
    this.nodeRender(nodes);
  }

  render() {
    const divStyle = {
      backgroundColor: '#FAFAFA',
      paddingTop: '20px',
      transform: 'translate(0px, -20px)',
    };
    const gStyle = {
      transform: 'translate(0px,40px)',
      fill: '#FAFAFA',
    };
    const svgStyle = {
      transform: `translate(-${this.state.nodeW / 2}px, 0px)`,
    };
    return (
      <div style={divStyle}>
      <svg height={this.state.height} width={this.state.width} style={svgStyle} >
        <g style={gStyle} id="graphz">
          {this.state.nodes}
        </g>
      </svg>
      </div>
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
