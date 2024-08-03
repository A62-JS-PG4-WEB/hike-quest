import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllThreads } from "../../services/threads.service";

export default function AllThreads() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  console.log(threads);

  useEffect(() => {
    getAllThreads(search)
      .then(threads => setThreads(threads))
      .catch(error => alert(error.message));
    // (async() => {
    //   try {
    //     const tweets = await getAllTweets();
    //     console.log(tweets);
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // })();
  }, [search]);

  const setSearch = (value) => {
    setSearchParams({
      search: value,
    });
  }

  // const handleUpdateTweet = async (tweet) => {
  //   try {
  //     const updatedTweet = await updateTweet(tweet);
  //     setTweets(tweets.map(t => t.id === updatedTweet.id ? updatedTweet : t))
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  return (
    <div>
      <h1>Our Threads</h1>
      <label htmlFor="search"></label>
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" /><br/><br/>
      {threads.length > 0
      ? threads.map(t => <p key={t.id}>{t.content}... <button onClick={() => navigate(`/threads/${t.id}`)}>See more</button></p>)
      : 'No threads'
      }
    </div>
  )
}