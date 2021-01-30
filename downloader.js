const fs = require('fs'),
    request = require('request'),
    jsonData = require('./links');

var __dirname = 'images/';
const timeoutTime = 2000;

const headers = {
    'authority': 'www.instagram.com',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
    'accept': '*/*',
    'origin': 'localhost',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'localhost',
    'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
    "cookie": "**YOUR IG COOKIE**"
};

const callback = function (error, res, body) {

    if (!error && res.statusCode == 200) {
        let response;
        let shortcode;
        response = JSON.parse(body);
        shortcode = response.graphql.shortcode_media.shortcode

        try {
            response.graphql.shortcode_media.edge_sidecar_to_children.edges.forEach(
                (edge, index) => {
                    const images = edge.node.display_resources;
                    const bigImageUrl = images[images.length - 1].src;
                    const filename = __dirname + shortcode + "_" + index + ".jpg"
                    download(bigImageUrl, filename, () => (console.log("Downloaded: ", filename)));
                }
            );
            setTimeout(downloadNext, timeoutTime);
        } catch (e) {
            // console.log("Can't download for url: ",  "https://www.instagram.com/p/"+response.graphql.shortcode_media.shortcode);
            const images = response.graphql.shortcode_media.display_resources;
            const bigImageUrl = images[images.length - 1].src;
            const filename = __dirname + shortcode + "_" + ".jpg"
            download(bigImageUrl, filename, () => (console.log("Downloaded: ", filename)));
            setTimeout(downloadNext, timeoutTime);
        }
    }
}

const parseLinks = function () {
    let links = []
    jsonData.links.tabs.forEach(
        (link) => {
            links.push(link.url + '?__a=1');
        }
    )
    return links;
}

const download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

let currentDownloadIndex = 0;
const downloadNext = function () {
    let options = {
        url: links[currentDownloadIndex++],
        headers: headers
    };

    console.log("Download:", currentDownloadIndex, links[currentDownloadIndex]);
    request(options, callback);
}

const links = parseLinks()
downloadNext();