"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const DetailsPage = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    console.log(useSearchParams());
    const encodedData = useSearchParams().get("data");
    console.log("encoded data: ", encodedData);

    useEffect(() => {
        // Get the encoded data from the query parameter

        if (encodedData) {
            console.log("data to hai");

            // Parse the JSON string to obtain the object
            const parsedData = JSON.parse(encodedData);
            console.log(parsedData)

            // Set the parsed data to the state
            setData(parsedData);
        }
    }, []);

    return (
        <div>
            <h1>Details Page</h1>
            {data && (
                <div>
                    <p>{data.title}</p>
                    <p>{data.author}</p>
                    <p>{data.description}</p>
                    <p>{data.url}</p>
                    <p>{data.urlToImage}</p>
                    <p>{data.content}</p>
                    <p>{data.publishedAt}</p>
                    <p></p>
                </div>
            )}
        </div>
    );
};

export default DetailsPage;
