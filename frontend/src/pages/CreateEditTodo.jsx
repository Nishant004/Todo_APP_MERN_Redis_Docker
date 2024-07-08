import React, { useState } from "react";
import TagInput from "../component/TagInput.jsx";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateEditTodo({
  todoData,
  type,
  onClose,
  getAllTodos,
}) {
  const [title, setTitle] = useState(todoData?.title || "");
  const [content, setContent] = useState(todoData?.content || "");
  const [tags, setTags] = useState(todoData?.tags || []);
  const [error, setError] = useState(null);

  const addNewTodo = async () => {
    try {
      const accessToken = localStorage.getItem("token");

      const response = await axios.post(
        `/api/todos/add-todo`,
        {
          title,
          content,
          tags,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.todo) {
        toast.success(response.data.message);
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editTodo = async () => {
    const todoId = todoData._id;
    try {
      const accessToken = localStorage.getItem("token");

      const response = await axios.put(
        `/api/todos/edit-todo/${todoId}`,
        {
          title,
          content,
          tags,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.todo) {
        toast.success(response.data.message);
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAddTodo = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editTodo();
    } else {
      addNewTodo();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddTodo}
      >
        {type === "add" ? "ADD" : "Update"}
      </button>
    </div>
  );
}

export default CreateEditTodo;
