import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const {
    mutate: createPost,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await axios.post("/api/posts/create", { text, img });

        return res.data;
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
    onSuccess: () => {
      toast.success("Post created succefully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setText("");
      setImg(null);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createPost({ text, img });
  }

  function handleImgChange(e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      console.log("reader: ", reader);

      console.log("file: ", file);
      reader.readAsDataURL(file);
      console.log("reader result: ", reader.result);
    }
  }
  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={imgRef}
            onChange={handleImgChange}
          />

          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 mt-2">
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
