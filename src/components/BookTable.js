import React, {useMemo, useState } from "react";

import "./BookTable.css";
import SortArrow from "./SortArrow";

export const SORT_STATES = {
  ASC: 'ASC',
  DESC: 'DESC',
  CLEAR: 'CLEAR',
};

const BookTable = ({ booksData }) => {
  const [sortState, setSortState] = useState(SORT_STATES.CLEAR);

  const toggleSort = () => {
    setSortState((prev) => {
      switch (prev) {
        case SORT_STATES.CLEAR:
          return SORT_STATES.ASC;
        case SORT_STATES.ASC:
          return SORT_STATES.DESC;
        case SORT_STATES.DESC:
          return SORT_STATES.CLEAR;
        default:
          return SORT_STATES.CLEAR;
      }
    });
  };

  const sortedData = useMemo(() => {
    if (sortState === SORT_STATES.CLEAR) return booksData;

    const sortedCopy = [...booksData]; 

    return sortState === SORT_STATES.ASC
      ? sortedCopy.sort((a, b) => a.price - b.price)
      : sortedCopy.sort((a, b) => b.price - a.price);
  }, [sortState, booksData]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th className="price">
              <div>Price</div>
              <SortArrow sortState={sortState} onClick={toggleSort} />
            </th>
            <th>Book Image</th>
          </tr>
        </thead>

        <tbody>
          {sortedData?.map((books, i) => (
            <tr key={i}>
              <td>{books.name}</td>
              <td>{books.book_author}</td>
              <td>{books.price}</td>
              <td>
                <img
                  src={`https://picsum.photos/100/150?random=${books.id}`}
                  loading="lazy"
                  alt={books.id}
                  height="120px"
                  width="100px"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(BookTable);
