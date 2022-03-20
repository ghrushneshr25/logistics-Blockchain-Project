import React, { useState } from "react";

const ProductComponent = (props) => {
  let detail = props.details;
  let date = new Date(detail.productDate * 1000);
  date = date.toDateString() + " " + date.toLocaleTimeString();

  return (
    <>
      <div>
        <p>UIN: {detail.uin}</p>
        <p>Product Name: {detail.productName}</p>
        <p>Product Description: {detail.productDescription}</p>
        <p>Product Type: {detail.productType}</p>
        <p>Weight: {detail.weight}</p>
        <p>Date of Production: {date}</p>
        <p>Owner : {detail.CurrentOwner}</p>
      </div>
    </>
  );
};
const EventsComponent = (props) => {
  let events = Object.values(props.details);
  console.log(events);
  return (
    <>
      <div>
        {events.map((e) => {
          <p>{e.event}</p>;
        })}
      </div>
    </>
  );
};

export default (props) => {
  return (
    <>
      <ProductComponent details={props.details[0]} />
      <EventsComponent details={props.details[1]} />
    </>
  );
};
