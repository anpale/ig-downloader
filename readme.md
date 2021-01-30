1. Find your Instagram cookie `F12->Network->Select XHR` pick one of the request and find your cookie string in Headers tab in Request Headers section. Copy cookie into `headers` object in `downloader.js`.
2. Generate URLs with IG Posts you want to download. Install Session Buddy Chrome Extension and export opened tabs to JSON (`Gear icon > Export`).
3. Copy JSON to `links.js`
4. Install modules 
    ```npm install fs```, 
    ```npm install request```
5. Run `node downloader.js`