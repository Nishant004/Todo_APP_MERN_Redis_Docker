

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { HideLoading, ShowLoading } from '../redux/alertSlice';
import TodoInfo from "../component/TodoInfo";
import { MdAdd } from "react-icons/md";
import CreateEditTodo from "./CreateEditTodo";
import Modal from 'react-modal'
import axios from "axios";
import NavSearch from "../component/NavSearch";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmptyCard from "../component/EmptyCard";
import AddNotesImg from "../assets/images/add-notes.svg"
import NoDataImg from "../assets/images/no-data.svg";


function Home() {
  // const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [allTodos, setAllTodos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);


  //model use
  
     const[openCreateEditModal ,setOpenCreateEditModal ] = useState({
      isShown:false,
      type:"add",
      data:null,
     })


  const handleEdit = (todoDetails) => {
    setOpenCreateEditModal({ isShown: true, data: todoDetails, type: "edit" });
  };





   // Get User Info
const getUserInfo = async () => {
  try {
    const accessToken = localStorage.getItem("token");
    const response = await axios.get(
      `/api/todos/get-user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data && response.data.user) {
      // toast.success(response.data.message)
      setUserInfo(response.data.user);
    }
  } catch (error) {
    
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    } else if (error.message === "Network Error") {
      console.error("Network Error:", error.message);
      // Handle network errors appropriately
    } else {
      toast.error(response.data.message)
      console.error("Error:", error);
    }
  }
};


 


   //get all todos
   const getAllTodos = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const response = await axios.get(
        `/api/todos/get-all-todos`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.data) {
        if (response.data.redisData) {
          toast.success("Data loaded from Redis cache");
          setAllTodos(response.data.redisData);
        } else if (response.data.data) {
          toast.success(response.data.message);
          setAllTodos(response.data.data);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };
  
  
  const deleteTodo = async (data) => {
    const todoId = data._id;
    try {
        const accessToken = localStorage.getItem("token");

        const response = await axios.delete(
            `/api/todos/delete-todo/${todoId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.data && !response.data.error) {
            toast.success(response.data.message);
            getAllTodos(); // Refresh the todos list
            // onClose(); // Close the modal or handle as needed
        } else {
            console.error("Unexpected response:", response.data);
            toast.error("An unexpected response occurred. Please try again.");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            console.error("Server error:", error.response.data.message);
            toast.error(`Server error: ${error.response.data.message}`);
        } else if (error.message === "Network Error") {
            console.error("Network Error:", error.message);
            toast.error("Network Error: Please check your internet connection.");
        } else {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    }
};



  //search

  const onSearchTodo = async (query) => {
    try {
      const accessToken = localStorage.getItem("token");
  
      const response = await axios.get("/api/todos/search-todos", {
        params: { query },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data && response.data.data) {
        setIsSearch(true);
        setAllTodos(response.data.data);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };



  

  const updateIsPinned = async (todoData) => {
    const todoId = todoData._id
  
    try {
      const accessToken = localStorage.getItem("token");
  
      const response = await axios.put(
        `/api/todos/update-todo-pinned/${todoId}`,
        { isPinned: !todoData.isPinned },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.data && response.data.data) {
        
        const updatedTodo = response.data.data;
        console.log("Updated Todo:", updatedTodo);
  
        getAllTodos(); // Refresh Todo after update
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };
  


  const handleClearSearch = () => {
    setIsSearch(false);
    getAllTodos();
  };
  
 

   useEffect(() => {
    getAllTodos();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <div className="flex justify-center h-screen ">
      <div className=" bg-yellow-400 min-w-full">
         <div className="p-5">

         <NavSearch userInfo={userInfo} onSearchTodo={onSearchTodo}
          handleClearSearch={handleClearSearch}/>


        <button className="w-10 h-10 flex items-center justify-center rounded -2xl bg-primary hover:bg-blue-700 absolute right-8 top-21 " onClick={()=>{
          
          setOpenCreateEditModal({
            isShown:true,type:'add',date:null})
        }}>
          <MdAdd className="text-[32px] text-white" /> 
        </button>

       </div>
        <div className="bg-green-300 container mx-auto" >
          <div className="">
           {allTodos.length > 0 ?(
          <div className="p-10 grid grid-cols-3 gap-4 mt-8">
           {allTodos.map((item , index)=>{
           return ( <TodoInfo 
            key={item._id}
            title={item.title}
            content={item.content}
            tags={item.tags}
            date={item.createdAt}
            countdown="2 hour remaing"
            isPinned={item.isPinned}
            onEdit={()=>handleEdit(item)}
            onDelete={()=>deleteTodo(item)}
            onPinNote={()=>updateIsPinned(item)}
            />
          )
          })}
          </div>
        )
        :(
         
          <EmptyCard
          mgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={
              isSearch
                ? `Oops! No notes found matching your search.`
                : `Start creating your first note! Click the 'Add' button to jot down your
          thoughts, ideas, and reminders. Let's get started!`
            }
          />
        )}
          </div>
        </div>

        <Modal 
        isOpen={openCreateEditModal.isShown}
        onRequestClose={()=>{}}
         style={{
          overlay:{
            backgroundColour:"rgba(0,0,0,0.2)",
          },
         }}
         contentLabel=''
         className='w-[50%] max-h-3/4 bg-white rounded-md mt-14 p-5 '
         >
        <CreateEditTodo 
        type ={openCreateEditModal.type}
        todoData={openCreateEditModal.data}
        onClose={()=>{
          setOpenCreateEditModal({isShown:false ,type :"add",data:null})
        }}
         getAllTodos={getAllTodos}
        />
        </Modal>
      </div>
    </div>
  );
}

export default Home;
