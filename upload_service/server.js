require('dotenv').config();
const express = require('express');
const multer = require('multer'); // For handling file uploads
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const axios = require('axios');
const CORS = require('cors');
const {createReadStream} = require("fs");
const app = express();
const FormData = require('form-data');
// Configure multer to save uploaded files to /uploads
// and extract the original name for the title
app.use(CORS());
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'video/mp4') {
      return cb(new Error('Only mp4 files are allowed'), false);
    }
    cb(null, true);
  }

});

app.post('/videos', upload.single('video'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No video uploaded");
    }
  
    const videoTitle = req.file.originalname; // Use the original file name as the title
    const videoPath = req.file.path; // The path where the video is stored
  
    // Prepare the form data to send to the external service
    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('file', createReadStream(videoPath));
  
    try {
      // Send the request to the external service
      const fileServiceResponse = await axios.post('http://localhost:3003/upload', formData, {
        headers: {
        },
      });
  
      //the service returns the URL of the uploaded video
      const videoUrl = fileServiceResponse.data.url;
  
      // Now, store the title and URL in the MySQL database
      const [result] = await pool.query(
        'INSERT INTO videos (title, path) VALUES (?, ?)',
        [videoTitle, videoUrl]
      );
  
      // Respond with success
      res.status(200).json({ message: 'Video uploaded and stored successfully', videoId: result.insertId, videoUrl });
    } catch (error) {
      console.error('Error communicating with the file service:', error);
      res.status(500).send('Error processing video upload');
    }
  });

app.get('/download', async (req, res) => {
try {
    //Query the database for video titles and URLs
    const [videos] = await pool.query('SELECT title, path FROM videos');
    console.log(videos);
    //the external service expects a POST request with video info

    // and returns URLs to access the videos
    const downloadPromises = videos.map(video =>
        axios.get('http://localhost:3003/download', {
            params: {
                blobName: video.path.split('/').pop()// Assuming video.path contains the blobName
            }
        })
    );

    //Wait for all download requests to complete
    const downloadResults = await Promise.all(downloadPromises);
    console.log(downloadResults);
    //Prepare the data to return to the frontend

    const responseData = downloadResults.map((response, index) => ({
    title: videos[index].title,
    downloadUrl: response.data.downloadUrl,
    source: videos[index].path    // Assuming this is what the service returns
    }));

    // Send the response back to the frontend
    res.json(responseData);
} catch (error) {
    console.error('Error processing download request:', error);
    res.status(500).send('Error fetching videos');
}
});


// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});



// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Upload Video Service is running on port ${PORT}`);
});
