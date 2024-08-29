const JudulHeader = (props) => {
    return (
        <div>
            <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-2.5 mb-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        {props.subJudul}
                    </li>
                </ol>
            </nav>
            <h3 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">{props.judul}</h3>
        </div>
    )
}
export default JudulHeader