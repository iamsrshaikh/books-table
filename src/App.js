import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import InputBox from "./components/InputBox";
import Spinner from "./components/Spinner";

const BookTable = React.lazy(() => import("./components/BookTable"));

function App() {
  const [booksData, setBooksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const loaderRef = useRef(null);
  const initialLoad = useRef(true);

  const MAX_LIMIT = 10;

  const fetchData = async (pageNumber) => {
    try {
      setIsDataLoading(true);
      const response = await axios.get(
        `https://609cd6ba04bffa001792d638.mockapi.io/books?limit=${MAX_LIMIT}&page=${pageNumber}`
      );
      const currentData = response?.data;

      setHasMore(currentData?.length > 0);
      setBooksData((prevData) => {
        if (prevData) {
          return [...prevData, ...currentData];
        }
        return [...currentData];
      });
    } catch (error) {
      console.log("error in fetching data");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentEntry = entries[0];

        if (currentEntry.isIntersecting && hasMore) {
          if (initialLoad.current) {
            initialLoad.current = false;
            return;
          }
          setCurrentPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1,
        root: null,
        rootMargin: "0px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, booksData]);

  useEffect(() => {
    let timer;
    if (booksData) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDebounceSearchTerm(searchTerm);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    if (!debounceSearchTerm) return booksData;

    return booksData.filter((book) =>
      book?.name?.toLowerCase().includes(debounceSearchTerm.toLowerCase())
    );
  }, [booksData, debounceSearchTerm]);


  return (
    <div className="App">
      {booksData && (
        <>
          <InputBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Suspense fallback={<div><Spinner /></div>}>
            {debounceSearchTerm && filteredData.length === 0 ? (
              <div className="notFound">Data Not Found</div>
            ) : (
              <BookTable
                booksData={filteredData}
              />
            )}
          </Suspense>

          <div ref={loaderRef} style={{ height: "50px", marginTop: "20px" }}>
            {hasMore && isDataLoading
              ? "Loading More Books...."
              : "No More Books Available!"}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
