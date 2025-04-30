import React from "react";

import arrow from "../assets/filter_arrow.svg";
import arrowEnabled from "../assets/filter_arrow_enabled.svg";
import { SORT_STATES } from "./BookTable";

import "./SortArrow.css";

const SortArrow = ({ sortState, onClick }) => {
  return (
    <div className="filterCont">
      <div className="container" onClick={onClick}>
        <img
          className="arrow"
          alt=""
          src={sortState === SORT_STATES.ASC ? arrowEnabled : arrow}
        />
        <img
          className="arrow invert"
          alt=""
          src={sortState === SORT_STATES.DESC ? arrowEnabled : arrow}
        />
      </div>
    </div>
  );
};

export default SortArrow;
