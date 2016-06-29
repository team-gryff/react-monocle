const d3 = require('d3');
const jsdom = require('jsdom');

var treeData = [
  {
    "name": "Top Level",
    "parent": "null",
    "children": [
      {
        "name": "Level 2: A",
        "parent": "Top Level",
        "children": [
          {
            "name": "Son of A",
            "parent": "Level 2: A"
          },
          {
            "name": "Daughter of A",
            "parent": "Level 2: A"
          }
        ]
      },
      {
        "name": "Level 2: B",
        "parent": "Top Level"
      }
    ]
  }
];

var tree;
var svg;
var diagonal;
var m = [20, 120, 20, 120],
w = 1480 - m[1] - m[3],
h = 800 - m[0] - m[2],
i = 0,
duration = 500,
rectW = 150,
rectH = 80;

var wrapLength = 120;


function createTree(element, treeData) {


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
}

function update(source) {
  root = treeData[0];
  root.x0 = 0;
  root.y0 = h / 2;
  var nodes = tree.nodes(root).reverse();
// var links = tree.links(nodes);

  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  var node = svg.selectAll("g.node")
  .data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });


  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + source.x0 + "," + source.y0 + ")";
  });

  nodeEnter.append("svg:rect")
  .attr("width", rectW)
  .attr("height", function(d) {
    return 19;
  })
  .attr("y", -11)
  .attr("rx", 2)
  .attr("ry", 2)
  .attr("stroke", "black")
  .style("fill", function (d) {
    return d._children ? "lightsteelblue" : "#fff";
  })
  .on("click", click);

  nodeEnter.append("text")
  .attr("x", function(d) {
    return d._children ? -8 : 8;
  })
  .attr("y", 3)
  .attr("dy", "0em")
  .text(function (d) {
      return (`Component: ${d.name} Props: ${d.depth} Methods: onClick`);
    });

  wrap(d3.selectAll("text"), wrapLength);

// Transition nodes to their new position.
  nodeEnter.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")

  .style("fill", "lightsteelblue");

  node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);


  node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.x + "," + source.y + ")";
    })
    .style("opacity", 1e-6)
    .remove();

  // Update the links…
  var link = svg.selectAll("path.link")
    .data(tree.links(nodes), function(d) {
      return d.target.id;
    });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
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

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

 // Toggle children on click.
function click(d) {
  console.log(d.children)
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
      d3.select(this.parentNode.children[0]).attr('height', 19 * (lineNumber+1));

    });
  }

  createTree('body', treeData);

  function remove() {
    if (svg) {
      svg.remove();
    }
  }

  module.exports = {remove, createTree};
