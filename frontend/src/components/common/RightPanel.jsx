import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from './LoadingSpinner'

const RightPanel = () => {
  const {
    data: suggestedUsers,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/users/suggested");

        return res.data;
      } catch (error) {
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
    },
  });

  const {follow, isPending} = useFollow()

  function handleFollow(e, userId) {
    e.preventDefault()
    follow(userId)
  }


  if (suggestedUsers?.length === 0) {
	return <div className="md:w-64 w-0"></div>
  }

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#000000] border border-stone-700 p-4 rounded-md sticky top-2">
        <p className="font-bold text-lg mb-2">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => handleFollow(e, user._id)}
                  >
                    {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
