import { connectAutoComplete } from 'react-instantsearch-dom'

const Autocomplete = connectAutoComplete(
  ({
    currentRefinement,
    refine,
    onFocus,
    handleSubmit,
    inputRef,
    id = 'search',
    name = 'search',
    placeholder = 'Search',
    label = 'Search',
    formClassName = '',
    inputClassName = 'shadow-sm block sm:text-sm rounded-md md:h-full pt-5px pb-3px pl-8 max-w-full border-0 focus-visible:ring focus-visible:ring-4'
  }) => (
    <form
      noValidate
      action=""
      role="search"
      className={`h-full relative ${formClassName}`}
      onSubmit={handleSubmit}
    >
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <div className="inline-block bg-gradient-to-br from-blue-1 to-indigo p-3px rounded-9px max-w-full">
        <input
          autoComplete="off"
          id={id}
          name={name}
          type="search"
          className={inputClassName}
          value={currentRefinement}
          placeholder={placeholder}
          onFocus={onFocus}
          onChange={(event) => refine(event.currentTarget.value)}
        />
      </div>
      <SearchIcon />
    </form>
  )
)

export default Autocomplete

function SearchIcon() {
  return (
    <div className="absolute top-9px left-8px">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.28571 0C3.26193 0 0 3.26193 0 7.28571C0 11.3095 3.26193 14.5714 7.28571 14.5714C8.83322 14.5714 10.268 14.089 11.448 13.2662L15.8051 17.6234C16.3072 18.1255 17.1213 18.1255 17.6234 17.6234C18.1255 17.1213 18.1255 16.3072 17.6234 15.8051L13.2662 11.448C14.089 10.268 14.5714 8.83322 14.5714 7.28571C14.5714 3.26193 11.3095 0 7.28571 0ZM2.57143 7.28571C2.57143 4.68209 4.68209 2.57143 7.28571 2.57143C9.88934 2.57143 12 4.68209 12 7.28571C12 9.88934 9.88934 12 7.28571 12C4.68209 12 2.57143 9.88934 2.57143 7.28571Z"
          fill="url(#paint0_linear_63_52)"
        />
      </svg>
    </div>
  )
}
