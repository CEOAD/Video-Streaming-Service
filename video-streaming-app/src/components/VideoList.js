import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = ({ token }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/videos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVideos(data);
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }
        };

        fetchVideos();
    }, [token]);

    return (
        <div>
            {videos.map(video => (
                <div key={video.id}>{video.name}</div>
            ))}
        </div>
    );
};

export default VideoList;
