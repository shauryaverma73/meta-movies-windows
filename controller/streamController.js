const fs = require('fs');
const Movie = require('./../model/movieModel');
const path = require('path');

exports.stream = async (req, res) => {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // console.log(req.link);

    // get video stats (about 61MB)
    const videoPath = path.join(__dirname, `../public/movies/${req.params.slug}`);
    const videoSize = fs.statSync(path.join(__dirname, `../public/movies/${req.params.slug}`)).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
};

// exports.findMovie = async (req, res, next) => {
//     const movie = await Movie.findOne({ slug: req.params.slug });
//     req.link = movie.movieLink;
//     next();
// };
