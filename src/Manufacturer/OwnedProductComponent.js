import React, { useState } from "react";

export default (props) => {
  console.log(props.owned);
  return (
    <div>
      {props.owned.map((product) => (
        <p>{product[0] + " " + product[1]}</p>
      ))}
    </div>
  );
};
