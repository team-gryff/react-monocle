'use strict';

function reactD3Tree (graphDOM) {
  const renderStart = Date.now();
  const domW = window.getComputedStyle(graphDOM, null).width;
  const domH = window.getComputedStyle(graphDOM, null).height;
  let tree, svg, diagonal,
  w = window.innerWidth; // 1480 - m[1] - m[3], //original: 1480
  h = window.innerHeight; // 800 - m[0] - m[2], // original: 800
  i = 0,
  duration = 500,
  rectW = 200,
  rectH = 100;
  const aspect = w / h;
  
  function __createTree (options) {
    const width = options && options.width ? options.width : w;
    const height = options && options.height ? options.height : h;

    tree = d3.layout.tree().size([ width, height ]);

    diagonal = d3.svg.diagonal()
      .projection(function (d) {
        return [d.x + rectW/2, d.y];
      });

    svg = d3.select(graphDOM)
      .append("svg")
      .attr("width", width) // .attr("width", `100%`)
      .attr("height", height) // .attr("height", `100%`)
      .attr('id', 'graphz')
      .append("svg:g")
      .attr("transform", "translate(0,40)");
  }

  function __getMaxLabelLength (node) {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((output, curr) => {
      return Math.max(output, curr.name.length, __getMaxLabelLength(curr));
    }, 0);
  }

  function treeInstance (options) {
    __createTree(options);

    d3.select(window)
      .on('resize', () => {
        // remove svg element from DOM
        d3.select('svg').remove();

        __createTree({ width: window.innerWidth, height: window.innerHeight * aspect });
        treeInstance.datum(d3Obj);
      });

    return treeInstance;
  }

  treeInstance.datum = function(source) {
    let root = source;
    root.x0 = 0;
    root.y0 = 0;
    let nodes = tree.nodes(root).reverse();
    let links = tree.links(nodes);

    // calculate max label length
    console.log(__getMaxLabelLength(source));
    rectW = (__getMaxLabelLength(source) + 10) * 10;

    // set depth of nodes
    nodes.forEach(function (d) { d.y = d.depth * h/3; });

    let node = svg.selectAll("g.node")
      .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
      .attr("class", "node");

    nodeEnter.append("rect")
      .attr("width", rectW)
      .attr("height", rectH)
      .attr("y", -10)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("stroke", "black")
      .attr("stroke-width", 0.9)
      .style("fill", function (d) {
        return d.children ? "white" : "lightsteelblue";
      });
    
    nodeEnter.append("text")
      .attr("x", 4)
      .attr("y", 10)
      .attr("dy", ".5em")
      .text(function (d) {
        return ([`Component: ${d.name}`]);
      })

    nodeEnter.append("text")
      .attr("x", 4)
      .attr("y", 28)
      .attr("dy", ".5em")
      .text(function(d) {
        let stateArr = [];
        let propsArr = [];
        let status;
        if (d.state.length > 0 && d.props.length > 0) {
          stateArr = d.state.map(i => {
            return i.name;
          });
          propsArr = d.props.map(i => {
            return i.name;
          });
          stateArr = stateArr.join(', ');
          propsArr = propsArr.join(', ');
          status = `State: ${stateArr}, Props: ${propsArr}`;
        } else if (d.state.length > 0) {
          stateArr = d.state.map(i => {
            return i.name;
          });
          stateArr = stateArr.join(', ');
          status = `State: ${stateArr}`;
        } else if (d.props.length > 0) {
            propsArr = d.props.map(i => {
              return i.name;
            });
          propsArr = propsArr.join(', ');
          status = `Props: ${propsArr}`;
        }
        return (status);
      })

    nodeEnter.append("text")
      .attr("x", 4)
      .attr("y", 46)
      .attr("dy", ".5em")
      .text(function(d) {
        if (d.methods.length > 0) return ([`Methods: ${d.methods}`]);
      })

    // Transition nodes to their positions.
    nodeEnter
      .transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    // Position links.
    let link = svg.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });

    // Enter new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        let o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);
    return treeInstance;
  };

  treeInstance.updateDimensions = function() {
    setTimeout(() => {
      const graphz = document.getElementById('graphz');
      graphz.style.height = graphz.getBBox().y + graphz.getBBox().height + 110;
      graphz.style.width = graphz.getBBox().x + graphz.getBBox().width + 110;
      if (Date.now() - renderStart <= duration) treeInstance.updateDimensions();
    }, 33);
  };

  return treeInstance;
}

const chart = reactD3Tree(document.getElementById('graph'));
chart().datum(d3Obj).updateDimensions();