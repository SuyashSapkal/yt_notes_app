function Button({ children, onclick }: { children?: React.ReactNode; onclick?: () => void }) {
    return (
        <button className="px-[1rem] py-[0.5rem] bg-[#121212] text-white mt-[2rem] rounded-full" onClick={onclick}>
            {children}
        </button>
    )
}

export default Button