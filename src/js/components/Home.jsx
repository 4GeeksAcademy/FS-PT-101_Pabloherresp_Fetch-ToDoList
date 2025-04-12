import React from "react";
import {useState,useEffect} from "react";

const USER_API = "https://playground.4geeks.com/todo/users/"

const Home = () => {
	const [list,setList] = useState([])
	const [text,setText] = useState("")
	const [user,setUser] = useState("")
	const [boxClass, setBox] = useState("")

	const createUser = async (name) => {
		try{
			const resp = await fetch( USER_API + name, {
				method: "POST",
				headers: {"Content-Type": "application/json"}
			})
			if (!resp.ok) 	throw new Error(`Error creating user ${name} -> Error: ${resp.status} ${resp.error}`)
			const data = await resp.json()
			console.log(data)
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
					"is_done": false
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

	const deleteTask = async (id) => {
		try {
			const resp = await fetch("https://playground.4geeks.com/todo/todos/"+id, {method: "DELETE"})
			if(!resp.ok) throw new Error("Couldn't delete task -> " + resp.status)
			getTodos(user)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(()=>{setUser("pabloherresp")},[])

	useEffect(()=>{getTodos(user)},[user])
	
	useEffect(()=>{
		if(list.length > 0){
			setBox("box")
			setTimeout(() => {
				setBox("")
			}, 200);
		}
	},[list])

	return (
		<div>
			<div className="container text-center">
				<p className="mt-3  display-5">User: {user}</p>
				<form onSubmit={(e)=>{addTask(e)}} className="mt-5 mb-2">
					<input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="What needs to be done?" className="form-text form-control form-control-lg"/>
					<input type="submit" value="" hidden/>
				</form>
				<ul className={boxClass + " lista mt-2 list-group list-group-flush d-inline-flex bg-transparent"}>
					{list?.length > 0 ? list?.map((el)=>
						<li className="lista-item d-flex justify-content-start align-items-center list-group-item fs-4 bg-transparent" key={el.id}>
							<span className={"text-break me-auto "+(el.is_done ? "text-decoration-line-through":"")}>
								{el.label}
							</span>
							<span className="papelera ms-3" onClick={e=>toggleTaskStatus(el.id,el.is_done)}>
								<i className={"fa-solid " + (el.is_done ? "fa-x":"fa-check")}></i>
							</span>
							<span className="papelera ms-3" onClick={e=>deleteTask(el.id)}><i className="fa-solid fa-trash"></i></span>
						</li>) : <li className="list-group-item fs-2" key="empty">There are no tasks, add some</li>}
				</ul>
			</div>
		</div>
	);
};

export default Home;