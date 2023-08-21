"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsGrid3X3GapFill, BsHeart, BsSearch } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { collection, addDoc, getDocs, where, query, deleteDoc, updateDoc, doc } from 'firebase/firestore';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NewsDashboard = ({ initialData }) => {
    const router = useRouter();
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

    const [details, setDetails] = useState(null);
    const [isGrid, setIsGrid] = useState(false);
    const [searchFor, setSearchFor] = useState("top-headlines");
    const [searchParam, setSearchParam] = useState({
        country: "us",
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
                if (newData.status === "error") {
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
    const showDetails = (article) => {
        if (details && details.title == article.title) {
            setDetails(null);
        }
        else {
            setDetails(article);
        }
    }

    return (
        <div className='min-h-screen main-content px-4 py-10'>
            <form className='py-4 flex flex-row font-bold  bg-black opacity-70 text-white h-fit p-2 rounded-lg'>
                <div className='flex flex-row flex-wrap flex-initial flex-grow'>
                    <div className='m-auto flex-initial'>
                        <label htmlFor='search'>Search For: </label>
                        <select className='text-black' onChange={(e) => {setSearchFor(e.target.value);(e.target.value==="everything")?setSearchParam({...searchParam, country: ""}):setSearchParam({...searchParam, country: "us"}) }} defaultValue="top-headlines" id="search" name="search">
                            <option value="everything">Everything</option>
                            <option value="top-headlines">Top-Headlines</option>
                        </select>
                    </div>
                    <div className='m-auto flex-initial'>
                        <label htmlFor='country'>Country: </label>
                        <select className='text-black' id="country" value={searchParam.country}  onChange={(e) => (setSearchParam({ ...searchParam, country: e.target.value }))}>
                            <option value="">--default--</option>
                            <option value="au">Australia</option>
                            <option value="br">Brazil</option>
                            <option value="ch">China</option>
                            <option value="fr">France</option>
                            <option value="in">India</option>
                            <option value="us">USA</option>
                        </select>
                    </div>
                    <div className='m-auto flex-initial'>
                        <label htmlFor='keyword'>Keyword: </label>
                        <input className='text-black' id="keyword" type="text" value={searchParam.q} onChange={(e) => (setSearchParam({ ...searchParam, q: e.target.value }))} />
                    </div>
                    <div className='m-auto flex-initial'>
                        <label htmlFor='sortBy'>Sort By:</label>
                        <select className='text-black' defaultValue={searchParam.sortBy} id="sortBy" onChange={(e) => (setSearchParam({ ...searchParam, sortBy: e.target.value }))}>
                            <option value="popularity">Popularity</option>
                            <option value="relevancy">Relevancy</option>
                            <option value="publishedAt">Date</option>
                        </select>
                    </div>
                    {
                        (searchFor === "top-headlines") ?
                            <div className='m-auto flex-initial'>
                                <label htmlFor='category'>Category: </label>
                                <select className='text-black' id="category" defaultValue="default" onChange={(e) => (setSearchParam({ ...searchParam, category: e.target.value }))}>
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
                <button className='' onClick={searchSubmit}><BsSearch /></button>
            </form>
            <div>
                <button onClick={changeGrid} ><BsGrid3X3GapFill /></button>
            </div>
            <div className='md:flex'>

                <div className='md:flex-1 p-4 w-1/2 ' >

                    <div className='flex'>
                        <div className={classNames(isGrid ? "grid-cols-4 gap-4" : "grid-cols-2 gap-4", "p-4 grid ")}>
                            {data && data.articles.map((article) => {
                                return (
                                    <div onClick={() => showDetails(article)} className={classNames(isGrid ? "h-60" : "h-40", (details && details.title == article.title) ? "border border-red-500" : "border border-white", 'special rounded-md  p-2 text-white')}>
                                        <div className={classNames(isGrid ? "overflow-hidden mx-auto h-4/5" : "grid h-4/5 overflow-hidden grid-cols-7 gap-2")}>
                                            <img className={classNames(isGrid ? "h-1/3" : "h-full", ' w-full col-span-2')} src={article.urlToImage} />
                                            <div className='col-span-5'>
                                                <p className='font-bold text-center h-3/4'>{article.title}</p>
                                                <p className='text-right h-1/4'><cite>{article.source.name}</cite></p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-center m-auto h-1/5 p-4'>
                                            <button className='' ><BsHeart className='h-6 w-6' /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='flex md:flex-1 w-1/3 mx-auto relative top-0 h-100% text-white p-8 justify-center '>
                    <div className={classNames(details?"block":"hidden",'card w-1/3 fixed h-96')}>
                        <div className={classNames('box animated-border front rounded-lg flex items-center ')}>
                            <p className='font-bold text-white w-full text-center underline underline-offset-4 '>Hover To View Details ! </p>
                        </div>
                        {details && 
                        <div className='animated-border box p-4 back rounded-lg my-auto overflow-hidden'>
                            <div className='h-4/5 overflow-hidden'>
                            <p className='p-2'><span className='font-bold underline mr-2'>Title: </span>{details.title}</p>
                            <p className='p-2'><span className='font-bold underline mr-2'>Description: </span>{details.description}</p>
                            <p className='p-2'><span className='font-bold underline mr-2'>Source: </span>{details.source.name}</p>
                            <p className='p-2'><span className='font-bold underline mr-2'>Author: </span>{details.author}</p>
                            <p className='p-2'><span className='font-bold underline mr-2'>Published On: </span>{details.publishedAt}</p>
                            </div>
                            <div className='h-1/5 flex items-center justify-center'>
                                <p className='p-2 font-bold text-center'><a className='bg-red-500 p-2 rounded-md' href={details.url} target="_blank">Read Full Content</a></p>
                            </div>
                        </div>}
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