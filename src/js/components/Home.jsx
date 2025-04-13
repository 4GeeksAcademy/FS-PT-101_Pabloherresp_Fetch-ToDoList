import React from "react";
import {useState,useEffect,useRef} from "react";

const USER_API = "https://playground.4geeks.com/todo/users/"

const Home = () => {
	//useState
	const [list,setList] = useState([])
	const [text,setText] = useState("")
	const [textName,setTextName] = useState("")
	const [user,setUser] = useState("")
	const [boxClass, setBox] = useState("")

	//useRef que uso para que el input de la tarea recupere el foco al editar
	const ref = useRef(null);

	const createUser = async (name) => {
		try{
			const resp = await fetch( USER_API + name, {
				method: "POST",
				headers: {"Content-Type": "application/json"}
			})
			if (!resp.ok) 	throw new Error(`Error creating user ${name} -> Error: ${resp.status} ${resp.error}`)
			else	alert(`A new user with the name ${name} was created.`);
		}catch(error){
			console.log(error)
		}
	}

	const getTodos = async (name) => {
		if(name){
			try{
				const resp = await fetch(USER_API + user)
				if(!resp.ok){
					if(resp.status == 404){
						console.log("User not found -> Creating user -- " + name)
						createUser(name)
					}
					else throw new Error("Error getting user")
				}
				const data = await resp.json()
				setList(data.todos)
				setText("")
			}catch(error){
				console.log(error)
			}
		}
	}

	const addTask = async (e) => {
		e.preventDefault()
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${user}`,{
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body:JSON.stringify({
					"label": text,
					"is_done": "false"
				})
			})
			if(!resp.ok) throw new Error("Error: Couldn't create task" + resp.status)
			getTodos(user)
			setText("")
		} catch (error) {
			console.log(error)
		}
	}

	const toggleTaskStatus = async (id,is_done) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/todos/${id}`,{
				method: "PUT",
				headers: {"Content-Type":"application/json"},
				body: JSON.stringify({"is_done": !is_done})
			})
			if(!resp.ok) throw new Error("Couldn't update task -> " + resp.status)
			getTodos(user)
		} catch (error) {
			console.log(error)
		}
	}

	const editTask = async (id,label) => {
		deleteTask(id)
		setText(label)
	}
	
	const deleteTask = async (id) => {
		try {
			const resp = await fetch("https://playground.4geeks.com/todo/todos/"+id, {method: "DELETE"})
			if(!resp.ok) throw new Error("Couldn't delete task -> " + resp.status)
			getTodos(user)
		} catch (error) {
			console.log(error)
		}
	}

	const deleteUser = async (name) => {
		try {
			const resp = await fetch(`https://playground.4geeks.com/todo/users/${name}`, {
				method: "DELETE"
			})
			if(!resp.ok) throw new Error("Couldn't delete user -> " + resp.status)
			else	alert(`The user ${name} was deleted.`);
			setUser("")
		} catch (error) {
			console.log(error)
		}
	}

	const changeUser = (e) => {
		e.preventDefault()
		setUser(textName)
		setTextName("")
	}
	
	//lo dejo en caso de querer iniciar con un nombre concreto
	/*
 	useEffect(()=>{
		//setUser("")
	},[]) */

	useEffect(()=>{getTodos(user)},[user])
	
	useEffect(()=>{
		if(list?.length > 0){
			setBox("box")
			setTimeout(() => {
				setBox("")
			}, 200);
		}
		if (ref?.current) {
			ref.current.focus();
		 }
	},[list])

	return (
		<div className="text-white">
			{(user ? 
			<div className="container text-center">
				<div className="d-flex">
					<p className="mt-3  fs-4">User: {user}</p>
					<button type="button" className="btn btn-info ms-auto my-3" onClick={()=>setUser("")}>Load Other User</button>
					<button type="button" className="btn btn-danger ms-auto my-3" onClick={()=>deleteUser(user)}>Delete Current User</button>
				</div>
				<form onSubmit={(e)=>{addTask(e)}} className="mt-5 mb-2">
					<input ref={ref} type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="What needs to be done?" className="form-text form-control form-control-lg w-50 mx-auto" required/>
					<input type="submit" value="" hidden/>
				</form>
				<ul className={boxClass + " lista mt-2 list-group list-group-flush d-inline-flex bg-transparent"}>
					{list?.length > 0 ? list?.map((el)=>
						<li className="lista-item d-flex justify-content-start align-items-center list-group-item fs-4 bg-transparent" key={el.id}>
							<span className={"text-break me-auto "+(el.is_done ? "text-white-50 text-decoration-line-through":"text-white ")}>
								{el.label}
							</span>
							<span className="papelera ms-3 text-white" onClick={e=>toggleTaskStatus(el.id,el.is_done)}>
								<i className={"fa-solid " + (el.is_done ? "fa-x":"fa-check")}></i>
							</span>
							<span className="papelera ms-3 text-white" onClick={e=>editTask(el.id,el.label)}><i className="fa-solid fa-pencil"></i></span>
							<span className="papelera ms-3 text-white" onClick={e=>deleteTask(el.id)}><i className="fa-solid fa-trash"></i></span>
						</li>) : <li className="list-group-item fs-2 bg-transparent text-white" key="empty">There are no tasks, add some</li>}
				</ul>
			</div>
			:
			<div className="container text-center">
				<form onSubmit={(e)=>changeUser(e)} className="mt-5 mb-2">
					<input type="text" value={textName} onChange={(e)=>setTextName(e.target.value)} placeholder="Name of the user you wish to load or create" className="form-text form-control w-50 mx-auto" required/>
					<input type="submit" value="" hidden/>
				</form>
			</div>
			)}
		</div>
	);
};

export default Home;