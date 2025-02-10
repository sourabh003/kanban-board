import { CheckCircle2, Loader2, Plus, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Todo from './Todo';
import { STATUSES } from '../utils/constants';
import { createTodo, getTodos } from '../services/todo';

const defaultSections = [
    { id: STATUSES.pending, title: 'Pending' },
    { id: STATUSES.inProgress, title: 'In Progress' },
    { id: STATUSES.completed, title: 'Completed' },
]

const defaultPosition = { x: 0, y: 0 };

export default function Sections() {

    const movingCardRef = useRef(null)

    const [movingCardPosition, setMovingCardPosition] = useState(defaultPosition)

    const [todos, setTodos] = useState([])

    /**
     * Scope to improve,
     * we can add the logic to dyanmically add the sections
     * but for that we need to update the format of the response we're getting from the api
     */
    const [sections] = useState([...defaultSections])

    // to track the todo selected
    const [selectedTodo, setSelectedTodo] = useState(null)

    // To be called when clicking a todo
    const handleGrab = (event) => {
        const x = event.clientX;
        const y = event.clientY;

        // Find the element at the mouse position
        const hoveredElement = document.elementFromPoint(x, y);
        const todoDiv = hoveredElement?.closest("[data-todoid]");

        if (!todoDiv) return;

        let todoId = todoDiv.dataset.todoid;
        let todo = todos.find(t => t.id == todoId)
        setSelectedTodo(todo)

        // removing the todo from the list
        setTodos(todos => todos.filter(t => t.id != todoId))



        // setting the position of the moving client
        movingCardRef.current.offsetX = event.clientX
        movingCardRef.current.offsetY = event.clientY

        // assigning event listener to track the movement and make the card follow it
        window.addEventListener('mousemove', handleMouseMovement)
    }

    // To be called when releasing a todo
    const handleRelease = (event) => {
        // to prevent addition of a new card
        if (!selectedTodo) return;

        const x = event.clientX;
        const y = event.clientY;

        // Finding the section, where the mouse is on release
        const hoveredElement = document.elementFromPoint(x, y);
        const sectionDiv = hoveredElement?.closest("[data-section]");

        // if the mouse is not over any other section, returning the card to original section
        if (!sectionDiv) {
            setSelectedTodo(todo => {
                let updatedTodos = [...todos]
                updatedTodos.unshift(todo)
                setTodos(updatedTodos)
                return null
            })

            // removing the tracking once the card is placed back
            window.removeEventListener('mousemove', handleMouseMovement)
            setMovingCardPosition(defaultPosition)
            return;
        }

        let sectionId = sectionDiv.dataset.section;

        setSelectedTodo(todo => {
            let updatedTodos = [...todos]

            // updating the status of todo
            let updatedTodo = { ...todo, status: sectionId }

            // setting the todo, at the first position
            updatedTodos.unshift(updatedTodo)

            setTodos(updatedTodos)
            return null
        })

        window.removeEventListener('mousemove', handleMouseMovement)
        setMovingCardPosition(defaultPosition)
    }

    // to track the movement of the mouse, and move the div with it
    const handleMouseMovement = (event) => {
        setMovingCardPosition({
            x: event.clientX - (movingCardRef.current.clientWidth / 2),
            y: event.clientY - (movingCardRef.current.clientHeight / 2) + 10,
        });
    }

    // Fetching the todos
    const fetchTodos = async () => {
        try {
            const todos = await getTodos({ limit: 8 })
            // setting a new field to the todos, to manage the statuses better
            setTodos(todos.map(t => ({ ...t, status: t.completed ? STATUSES.completed : STATUSES.pending })))
        } catch (error) {
            alert(error?.message || "Error while fetching todos!")
        }
    }

    // to create a new todo
    const addNewTodo = async (todoTitle) => {
        try {
            const todo = await createTodo(todoTitle)
            let updatedTodos = [...todos]
            // every new todo has the same id, so assigning a custom id
            updatedTodos.unshift({ ...todo, id: Date.now() })
            setTodos(updatedTodos)
        } catch (error) {
            alert(error?.message || "Error while fetching todos!")
        }
    }

    useEffect(() => {
        fetchTodos()

        return () => {
            window.removeEventListener('mousemove', handleMouseMovement)
            setMovingCardPosition(defaultPosition)
        }
    }, [])

    return (
        <div
            className='flex h-full relative'
            onMouseDown={handleGrab}
            onMouseUp={handleRelease}
        >
            {sections.map(section => {
                return (
                    <div
                        data-section={section.id}
                        key={section.id}
                        className='border rounded m-5 border-2'
                    >
                        <Section
                            {...section}
                            todos={todos.filter(todo => todo.status === section.id)}
                            addNewTodo={addNewTodo}
                        />
                    </div>
                )
            })}

            {/* temporary card for drag effect */}
            <div
                className={`absolute w-[280px] opacity-[.7]`}
                style={{ left: `${movingCardPosition.x}px`, top: `${movingCardPosition.y}px` }}
                ref={movingCardRef}>
                {selectedTodo && (
                    <Todo {...selectedTodo} />
                )}
            </div>

        </div>
    )
}


const Section = ({ id, title, todos = [], addNewTodo }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [showAddForm, toggleAddForm] = useState(false)
    const inputRef = useRef(null)

    const handleAddTodo = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            let todoTitle = inputRef.current.value;
            await addNewTodo(todoTitle)
            toggleAddForm(false)
        } catch (error) {
            alert(error?.message || "Error while adding todo!")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='w-[300px] flex flex-col h-full'>
            {/* Section Header */}
            <div className='flex justify-between px-4 pt-4'>
                <p className='font-bold'>
                    {title}
                    <span className='ml-2 text-sm text-gray-500'>
                        {todos.length}
                    </span>
                </p>

                {/* Adding will be possible only on the pending section */}
                {id === STATUSES.pending && (
                    <Plus onClick={() => toggleAddForm(true)} className='cursor-pointer hover:bg-teal-300 transition 300 p-1 rounded-full' />
                )}
            </div>
            <div className='mt-4 p-3 flex-1 overflow-y-auto'>
                {/* Adding will be possible only on the pending section */}
                {id === STATUSES.pending && showAddForm && (
                    <form action="#" onSubmit={handleAddTodo}>
                        <div className='bg-white rounded-md mb-4 border border-gray-300 p-2'>
                            <input
                                disabled={isLoading}
                                required
                                ref={inputRef}
                                type="text"
                                className='border w-full border-gray-300 rounded p-1 text-sm'
                                placeholder='Enter todo title'
                            />
                            <div className='flex items-center mt-2 justify-between'>
                                <div className='bg-cyan-300 rounded-full p-1 h-[30px] w-[30px] grid place-items-center font-bold text-sm'>
                                    A
                                </div>
                                {isLoading ? (
                                    <Loader2 className='animate-spin text-cyan-500' />
                                ) : (
                                    <div className="flex">
                                        <XCircle
                                            onClick={() => [toggleAddForm(false), inputRef.current.value = ""]}
                                            className='w-auto h-full rounded-full ml-2 hover:text-red-700 text-red-400 cursor-pointer transition 300'
                                        />
                                        <button>
                                            <CheckCircle2 className='w-auto h-full rounded-full ml-2 hover:text-green-700 text-green-400 cursor-pointer transition 300' />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                )}
                <div>
                    {todos.map(todo => {
                        return (
                            <Todo key={todo.id} {...todo} />
                        )
                    })}
                </div>
            </div>
        </div >
    )
}