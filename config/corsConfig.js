
const whiteList = [
    "https://www.yoursite.com",
    "https://www.yoursite.com/",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/",
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8080/",
];

const corsOptions = {
    origin: (origin, cb) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            cb(null, true)
        } else {
            cb(new Error('Not allowed by Api(CORS)'))
        }
    },
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

module.exports.corsOptions = corsOptions;
module.exports.allowedOrigins = whiteList