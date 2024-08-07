import { useState, useEffect } from "react";
import { getPosts } from "../../services/posts";
import Post from "../Post/Post";
import SearchBar from "./SearchBar";

const Search = ({ navigate, token, sampleImage, setIsSearching }) => {
    const [posts, setPosts] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        if (token) {
            getPosts(token)
                .then((data) => {
                    if (data === null || !data.posts.length) {
                        setPosts([]);
                    } else {
                        setPosts(data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                        localStorage.setItem("token", data.token);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    navigate("/login");
                });
        }
    }, [token, navigate]);

    const handleChange = (value) => {
        setSearchWord(value);
        setIsSearching(value.length > 0); // value.length because it will always return true when there is an input. if it was just value then you could input 0 which is a falsy value
    };

    const filteredPosts = posts.filter((post) => {
        // the below is a more simple way to match search words with posts or users compared to regex matching which does a case-insensitive search - regex will be more useful if you want to match more complex patterns
        // filtering can happen outside the useEffect hook so that it runs every time the searchWord changes instead of relying on useEffect
        const lowerSearchWord = searchWord.toLowerCase();
        return (
            post.message.toLowerCase().includes(lowerSearchWord) ||
            post.user_id.name.toLowerCase().includes(lowerSearchWord)
        );
    });

    return (
        <div className="search-container">
            <SearchBar searchWord={searchWord} searchChange={handleChange} />
            <br />
            {searchWord && (
                <div className='search-results'>
                    <div className='feed' role='feed'>
                        {filteredPosts.map((post) => (
                            <Post
                                post={post}
                                key={post._id}
                                filepath={sampleImage}
                            />
                        ))}
                    </div>
                    <br />
                    {filteredPosts.length === 0 && (
                        <p style={{ color: "grey" }}>
                            {searchWord
                                ? "No matching posts found"
                                : "No posts to display"}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
