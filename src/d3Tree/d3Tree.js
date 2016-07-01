'use strict';

let tree, svg, diagonal,
m = [20, 120, 20, 120],
w = 1480 - m[1] - m[3],
h = 800 - m[0] - m[2],
i = 0,
duration = 500,
rectW = 200,
rectH = 100;

function create(element, treeData) {
  tree = d3.layout.tree().size([w, h]);

  diagonal = d3.svg.diagonal()
  .projection(function (d) {
    return [d.x + rectW/2, d.y];
  });

  svg = d3.select(element)
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("svg:g")
  .attr("transform", "translate(0,40)");

  update(treeData);

  return tree;
}

//Update nodes
function update(source) {
  let root = source;
  root.x0 = 0;
  root.y0 = 0;
  let nodes = tree.nodes(root).reverse();
  let links = tree.links(nodes);

  //Set depth of nodes
  nodes.forEach(function (d) {
    d.y = d.depth * h/3;
  });

  let node = svg.selectAll("g.node")
  .data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
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
  nodeEnter.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })

  // Position links.
  let link = svg.selectAll("path.link")
    .data(tree.links(nodes), function(d) {
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
}

create(document.body, d3Obj);
