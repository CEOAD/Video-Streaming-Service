import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = ({ token }) => {
    const [selectedFile, setSelectedFile] =  useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);

    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            const response = await axios.post('http://localhost:3002/videos', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Upload successful')
            console.log('Upload successful', response);
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    return (
        <div>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadPage;
