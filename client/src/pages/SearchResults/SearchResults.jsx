/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner"
import { GetServerUrl } from "../../hooks";
import axios from "axios";
import style from "./SearchResults.module.css";

const serverUrl = GetServerUrl();
const range = 5;

const SearchResults = () => {
  const location = useLocation();
  const [searchKey, setSearchKey] = useState("")
  const [searchResults, setSearchResults] = useState();
  const [searchResultsLimit, setSearchResultsLimit] = useState(range);
  const [isLastResults, setIsLastResults] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchKey(params.get("searchKey"));
    setSearchResults({});
    setSearchResultsLimit(range);
    setIsLastResults(false);
  }, [location]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setFetchLoading(true);

        const promise = await axios.get(`${serverUrl}/users/searchUsers?includes=${searchKey}&limit=${searchResultsLimit}`);

        const { results } = promise.data;

        if (results.length > searchResults?.length || !searchResults?.length) {
          setSearchResults(results);
        } else {
          setIsLastResults(true);
        }

        setFetchLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsLimit, searchKey]);

  return (
    <>
      {
        searchResults?.length > 0 ?
          <div className={style.search_results}>
            <h2 className={style.title}>Search Results</h2>

            {
              searchResults.map(user => {
                return user._id && <UserCard key={user._id} user={user} />
              })
            }

            {
              isLastResults ?
                <p className={style.end_results}>The end of results</p>
                : <button
                  className={style.load_more}
                  disabled={fetchLoading}
                  style={
                    fetchLoading ? { opacity: ".5", cursor: "revert" } : {}
                  }
                  onClick={() => setSearchResultsLimit(prev => prev + range)}
                >
                  {
                    fetchLoading &&
                    <RotatingLines
                      strokeColor="gray"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="15"
                      visible={true}
                    />
                  }
                  load more
                </button>
            }
          </div >

          : searchResults?.length == 0 ?
            <div className={style.no_results}>
              No results found
            </div>

            : <div className={style.spinner_container}>
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            </div>
      }
    </>
  )
}

const UserCard = ({ user }) => {
  return (
    <div className={style.user_card}>
      <div className={style.left_side}>
        <img src={user.picture} alt="user picture" />
      </div>

      <div className={style.right_side}>
        <Link to={`/users/${user._id}`}>{user.name}</Link>
        <p>{user.bio}</p>
      </div>
    </div>
  )
}

export default SearchResults
