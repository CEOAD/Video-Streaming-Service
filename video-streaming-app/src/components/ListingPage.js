import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const ListingsPage = ({ token }) => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    useEffect(() => {
        const getVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3002/download', { timeout: 10000 },{
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data);
                setVideos(response.data);
            } catch (err) {
                // If the backend is down or network error occurs, handle it here
                setError('No videos available');
            }
        };
        getVideos().then(r => console.log(r));
    }, [token]);

    const handleUploadButoon = () => {
        navigate('/upload');
    }
    return (
        <div>
            <div>
                <h2>Want to Upload Video?</h2>
                <button onClick={handleUploadButoon}>Upload</button>
            </div>
            <h2>Video Library</h2>

            {videos?.map(video => (
                <div key={video.title}>
                    {/*<h4>{video.name}</h4>*/}
                    <video width="320" height="240" controls>
                        <source src={video.source} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )) || <div>No videos available</div>}
        </div>
    );
};

export default ListingsPage;
