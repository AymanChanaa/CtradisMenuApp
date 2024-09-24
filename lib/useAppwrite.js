import { useState, useEffect } from "react";
import { getAllPosts } from "./appwrite";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const posts = await fn();
      setData(posts);
    } catch (error) {
      console.log("useEffect Error " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppwrite;
