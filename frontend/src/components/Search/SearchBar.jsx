const SearchBar = ({ searchWord, searchChange }) => {
    return (
        <input
            type='text'
            placeholder='Search posts or users...'
            value={searchWord}
            onChange={(e) => searchChange(e.target.value)}
            className='search-input'
        />
    );
};

export default SearchBar;
