require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const app = express();
const port = 3003; // Port number for the server
const axios = require('axios');
// Multer will store the files temporarily in memory
const upload = multer({ storage: multer.memoryStorage() });

// Set up the blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const containerClient = blobServiceClient.getContainerClient('acit3495-container');
    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        // Upload to Azure Blob Storage
        await blockBlobClient.uploadData(req.file.buffer);

        // Construct the URL of the uploaded blob
        const url = `https://acit3495.blob.core.windows.net/acit3495-container/${blobName}`;
        // Send the URL back to the client
        res.status(200).send({ message: 'File uploaded successfully.', url });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Endpoint to download a file
app.get('/download', async (req, res) => {
    const blobName = req.query.blobName; // Get the blob name from query string
    const containerName = 'acit3495-container';

    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        // Download the blob content
        const downloadBlockBlobResponse = await blobClient.download(0);
        const readableStream = downloadBlockBlobResponse.readableStreamBody;

        // Set the content type and content disposition for file download
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${blobName}"`);

        // Stream the blob to the client
        readableStream.pipe(res);
    } catch (error) {
        console.error(`Error downloading blob "${blobName}":`, error.message);
        res.status(500).send('Error downloading file.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
