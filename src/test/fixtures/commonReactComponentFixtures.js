module.exports = {
  forLoopComponentFixture: `
    var Main = React.createClass({
      render: function() {
        var items = [];
        for (let i = 0; i < testArray.length; i++) {
          items.push(<ListItem 
            onChange={this.handleChange}
            onSubmit={this.handleSubmit} />);
        }
        return <div>
          {items}
        </div>
      }
    });
  `,
  mapComponentFixture: `
    var Main = React.createClass({
      render: function() {
        var items = testArray.map(item => <ListItem
          onChange={this.handleChange}
          onSubmit={this.handleSubmit} />);
        return <div>
          {items}
        </div>
      }
    });
  `,
};