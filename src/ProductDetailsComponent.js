import React, { useState } from "react";
import web3 from "web3";

const ProductComponent = (props) => {
  let detail = props.details;
  let date = timeConverter(detail.productDate);

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

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  var hour = a.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  var min = a.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  var sec = a.getSeconds();
  if (sec < 10) {
    sec = "0" + sec;
  }
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

const Event = (props) => {
  let x = props.event;
  let data = [];
  let eventName = x.event
    .substring(1)
    .match(/[A-Z][a-z]+|[0-9]+/g)
    .join(" ");
  data.push(["Transaction Hash", x.transactionHash]);
  let ele2 = ["Time Stamp", timeConverter(x.returnValues.timeStamp)];
  data.push(ele2);
  let ele3 = ["From", x.returnValues.caller];
  data.push(ele3);
  if (x.returnValues.hasOwnProperty("receiver")) {
    data.push(["To", x.returnValues.receiver]);
  }

  if (x.returnValues.hasOwnProperty("price")) {
    data.push([
      "Price",
      web3.utils.fromWei(x.returnValues.price, "ether") + " eth",
    ]);
  }

  console.log(data);
  return (
    <>
      <h3>{eventName}</h3>
      {data.map((e) => (
        <p key={e[0]}>
          {e[0]} : {e[1]}
        </p>
      ))}
    </>
  );
};

const EventsComponent = (props) => {
  let events = props.details;
  console.log(events);
  return (
    <>
      <div>
        {events.map((e) => (
          <Event event={e} key={e.event} />
        ))}
      </div>
    </>
  );
};

export default (props) => {
  return (
    <>
      <ProductComponent details={props.details[0]} />
      <EventsComponent details={props.details[1]} key={1} />
    </>
  );
};
