export default function Todo({ id, todo }) {
    return (
        <div
            data-todoid={id}
            key={id}
            className='cursor-pointer flex flex-col bg-white shadow mt-4 rounded-lg min-h-[80px] first:mt-0 p-2 transition 300 hover:border-gray-500'
        >
            <div className="w-full flex">
                <p className='text-sm flex-1 font-bold'>
                    {todo}
                </p>
                {/* <MoreHorizontal className='text-gray-500 w-10' /> */}
            </div>

            <div className='flex items-center'>
                <div className='bg-cyan-300 rounded-full p-1 h-[30px] w-[30px] grid place-items-center font-bold text-sm'>
                    A
                </div>
                <div className='ml-2'>
                    <p className='text-xs text-gray-500'>Last Updated</p>
                    <p className='text-sm text-gray-800'><code>{new Date().toISOString().split("T")[0]}</code></p>
                </div>
            </div>
        </div>
    )
}