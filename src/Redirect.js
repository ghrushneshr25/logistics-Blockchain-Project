import React, { useState } from "react";
import DistributorPage from "./DistributorPage";
import ManufacturerPage from "./ManufacturerPage";
import OwnerPage from "./OwnerPage";

export default (props) => {
  const typeOfUser = props.typeOfUser;
  if (typeOfUser === "0") {
    return (
      <div>
        <OwnerPage />
      </div>
    );
  }
};
