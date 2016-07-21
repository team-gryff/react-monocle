import React from 'react';


const ListItem = ({
  id,
  text,
  onDelete,
}) => (
  <div>
    {text}
    <button onClick={onDelete}>X</button>
  </div>
)

ListItem.propTypes = {
  id: React.PropTypes.number.isRequired,
}

export default ListItem;
