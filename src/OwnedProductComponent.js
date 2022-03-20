import React, { useState } from "react";

export default (props) => {
  console.log(props.owned);
  return (
    <div>
      {props.owned.map((product) => (
        <p key={product[0]}>{product[0] + " " + product[1]}</p>
      ))}
    </div>
  );
};
