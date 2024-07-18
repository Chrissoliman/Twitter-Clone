import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from "react";

const Posts = ({ feedType }) => {

  function getPostEndpoint() {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";

      default:
        return "/api/posts/all";
    }
  }

  const postEndpoint = getPostEndpoint()

  const {data: posts, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await axios.get(postEndpoint)

        return res.data
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(
            error.response.data.error || "Failed to create account"
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error("Error setting up the request");
        }
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [feedType, refetch])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
