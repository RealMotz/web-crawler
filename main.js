const {
    crawlPage,
    normalizeURL
} = require("./crawl")
const { printReport } = require("./report")
const { argv } = require('node:process');

function main() {
    if (argv.length != 3) {
        console.log("Invalid arguments");
        return;
    }
    const url = argv[2];
    const baseUrl = normalizeURL(url);
    let pages = {};
    pages[baseUrl] = 1;
    crawlPage(url, url, pages).then(() => {
        printReport(pages);
    });
}

main();