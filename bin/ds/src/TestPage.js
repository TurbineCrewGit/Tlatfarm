import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/data")
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div>
            <h1 style={{color:'black'}}>Spring 연동하기</h1>
            {data ? (
                <div style={{color:'black'}}>
                    <p>{data.message}</p>
                    <p>{data.value}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TestPage;
