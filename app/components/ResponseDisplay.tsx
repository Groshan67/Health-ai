interface ResponseDisplayProps {
    response: string;
    loading: boolean;
    type: 'user' | 'assistant';
}

export const ResponseDisplay = ({ response, loading, type }: ResponseDisplayProps) => {
    return (
        <div className={`
        group relative w-full mb-4 flex 
        ${type === 'user' ? 'justify-end' : 'justify-start'}
      `}>
            <div className={`
          relative max-w-[85%] px-4 py-3 rounded-2xl shadow-sm
          transition-all duration-200 ease-in-out
          ${type === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white ml-auto rounded-tr-none'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 mr-auto rounded-tl-none border border-gray-100'
                }
          hover:shadow-md
          ${type === 'assistant' ? 'hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200' : ''}
        `}>
                {/* Avatar for assistant */}
                {type === 'assistant' && (
                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                )}

                {/* Message content */}
                <pre
                    className={`
                    font-[__Vazirmatn_abcc1e] /* اطمینان از نام صحیح فونت */
                    text-justify
                    text-sm md:text-base
                    leading-relaxed
                    break-words
                    whitespace-pre-wrap
                    ${type === 'assistant' ? 'selection:bg-green-200' : 'selection:bg-green-300'}
                    direction-rtl
                `}
                    style={{ fontFamily: '"__Vazirmatn_abcc1e", sans-serif' }} /* تعریف دستی فونت */
                >
                    {response}
                </pre>


                {/* Time indicator - optional */}
                <div className={`
            absolute -bottom-5 
            text-xs text-gray-400
            ${type === 'user' ? 'left-0' : 'right-0'}
          `}>
                    {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};



