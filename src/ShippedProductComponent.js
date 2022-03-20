import React, { useState } from "react";

export default (props) => {
  console.log(props.shipped);
  return (
    <div>
      {props.shipped.map((product) => (
        <p key={product[0]}>{product[0] + " " + product[1]}</p>
      ))}
    </div>
  );
};
