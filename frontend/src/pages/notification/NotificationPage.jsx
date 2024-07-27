import { Link } from "react-router-dom";
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { RiUserFollowLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";
import {toast} from 'react-hot-toast'

const NotificationPage = () => {
  const queryClient = useQueryClient()

  const {data: notifications, isLoading, isError} = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/notifications')

        return res.data
      } catch (error) {
        toast.error(error.response.data.error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data.error || "Failed to create post");
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

  const {mutate: deleteNotifications} = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete('/api/notifications/')

        return res.data
      } catch (error) {
        toast.error(error.response.data.error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data.error || "Failed to create post");
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error("Error setting up the request");
        }
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']})
      toast.success('Notifications deleted succesfully')
    },
  })

  const deleteNotificationsHandler = (e) => {
    e.preventDefault()
    deleteNotifications()
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotificationsHandler}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <RiUserFollowLine className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaRegHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
