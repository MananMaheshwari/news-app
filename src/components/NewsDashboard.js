"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsGrid3X3GapFill, BsHeart, BsSearch } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../connections/auth";

import { collection,addDoc, getDocs, where, query, deleteDoc, updateDoc, doc } from 'firebase/firestore';


const {isLoading, authUser, setAuthUser, signOut} =useAuth();

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NewsDashboard = ({ initialData }) => {
    const router=useRouter();
    console.log("initial data: ", initialData);
    console.log("next public key: ", process.env.NEXT_PUBLIC_KEY);
    const [data, setData] = useState(initialData);

    useEffect(() => {
        console.log("useEffect");
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_KEY}`
        const storedData = sessionStorage.getItem(JSON.stringify(url));

        console.log("fetched data");
        fetchData(url).then((newData) => {
            if (newData.status === "error") {
                toast.error(newData.message, {
                    position: "top-center"
                })
                return;
            }
            setData(newData);
            sessionStorage.setItem(JSON.stringify(url), JSON.stringify(newData));
        });
        
    }, []);

    const [isGrid, setIsGrid] = useState(true);
    const [searchFor, setSearchFor] = useState("top-headlines");
    const [searchParam, setSearchParam] = useState({
        country: "",
        category: "",
        // sources: null,
        q: "",
        // searchIn: null,
        sortBy: "publishedAt",
    })
    const changeGrid = () => {
        setIsGrid(!isGrid);
    }

    const searchSubmit = async (e) => {
        e.preventDefault();

        let query = "https://newsapi.org/v2/";
        query += `${searchFor}?`
        if (searchFor === "top-headlines" && searchParam.country === "") {
            toast.error("mention the country", {
                position: "top-center"
            })
            return;
        }
        for (const key in searchParam) {
            if (searchParam.hasOwnProperty(key)) {
                if (searchParam[key].length > 0) {
                    query += `${key}=${searchParam[key]}&`
                }
            }
        }

        query += `apiKey=${process.env.NEXT_PUBLIC_KEY}`
        console.log(query);
        const storedData = sessionStorage.getItem(JSON.stringify(query));
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setData(parsedData);
        }
        else {
            fetchData(query).then((newData) => {
                if(newData.status==="error"){
                    toast.error(newData.message, {
                        position: "top-center"
                    })
                    return;
                }
                setData(newData);
                sessionStorage.setItem(JSON.stringify(query), JSON.stringify(newData));
            });
        }
    }
    const showDetails=(article)=>{
        const encodedData=encodeURIComponent(JSON.stringify(article));
        const url=`/details?data=${encodedData}`;
        window.open(url, '_blank');
    }

    const addFavorite=()=>{
        await 
    }
    return (
        <div>
            <form className='flex mt-10 bg-red-600 h-fit p-2 rounded-lg'>
                <div className='flex flex-1 flex-wrap'>
                    <div className='flex-1'>
                        <label htmlFor='search'>Search For: </label>
                        <select onChange={(e) => setSearchFor(e.target.value)} defaultValue="top-headlines" id="search" name="search">
                            <option value="everything">Everything</option>
                            <option value="top-headlines">Top-Headlines</option>
                        </select>
                    </div>
                    <div className='flex-1 flex-wrap'>
                        <label htmlFor='country'>Country: </label>
                        <select id="country" defaultValue="" onChange={(e) => (setSearchParam({ ...searchParam, country: e.target.value }))}>
                            <option value="">--default--</option>
                            <option value="au">Australia</option>
                            <option value="br">Brazil</option>
                            <option value="ch">China</option>
                            <option value="fr">France</option>
                            <option value="in">India</option>
                            <option value="us">USA</option>
                        </select>
                    </div>
                    <div className='flex-1 flex-wrap'>
                        <label htmlFor='keyword'>Keyword: </label>
                        <input id="keyword" type="text" value={searchParam.q} onChange={(e) => (setSearchParam({ ...searchParam, q: e.target.value }))} />
                    </div>
                    <div className='flex-1 flex-wrap'>
                        <label htmlFor='sortBy'>Sort By:</label>
                        <select defaultValue={searchParam.sortBy} id="sortBy" onChange={(e) => (setSearchParam({ ...searchParam, sortBy: e.target.value }))}>
                            <option value="popularity">Popularity</option>
                            <option value="relevancy">Relevancy</option>
                            <option value="publishedAt">Date</option>
                        </select>
                    </div>
                    {
                        (searchFor === "top-headlines") ?
                            <div className='flex-1 flex-wrap'>
                                <label htmlFor='category'>Category: </label>
                                <select id="category" defaultValue="default" onChange={(e) => (setSearchParam({ ...searchParam, category: e.target.value }))}>
                                    <option value="default">--default--</option>
                                    <option value="business">Business</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="general">General</option>
                                    <option value="health">Health</option>
                                    <option value="science">Science</option>
                                    <option value="sports">Sports</option>
                                    <option value="technology">Technology</option>
                                </select>
                            </div> :
                            <div></div>
                    }
                </div>
                <button onClick={searchSubmit}><BsSearch /></button>
            </form>
            <div className='p-4 w-2/3 mx-auto' >
                <div>

                </div>
                <div>
                    <button onClick={changeGrid} ><BsGrid3X3GapFill /></button>
                </div>

                <div className='flex'>
                    <div className={classNames(isGrid ? "grid-cols-4 gap-4" : "grid-cols-2 gap-4", "p-4 grid ")}>
                        {data && data.articles.map((article) => {
                            return (
                                <div onClick={()=>showDetails(article)} className='rounded-md border-2 border-gray-200 p-2 bg-gray-100'>
                                    <div className={classNames(isGrid ? "mx-auto h-full" : "grid grid-cols-7 gap-2")}>
                                        <img className='h-16 w-full col-span-2' src={article.urlToImage} />
                                        <div className='col-span-4'>
                                            <p className='font-bold text-center h-3/4'>{article.title}</p>
                                            <p className='text-right h-1/4'><cite>{article.source.name}</cite></p>
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            <button onClick={addFavorite} className='' ><BsHeart className='h-6 w-6' /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export async function getServerSideProps() {
    // console.log("server side props", process.env.news_api_key)
    const initialData = await fetchData(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_KEY}`);

    return {
        props: {
            initialData,
        },
    };
}

async function fetchData(url) {
    console.log("fetch happened")
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export default NewsDashboard