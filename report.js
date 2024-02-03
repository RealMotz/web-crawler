function printReport(pages) {
    console.log("Crawl Report");
    console.log(`Total links found: ${Object.keys(pages).length}`);
    console.log("============");
    const sorted = sort(pages);
    for (var p of sorted) {
        console.log(`Found ${p[1]} internal links to ${p[0]}`);
    }
    console.log("============");
}

function sort(object) {
    return Object.entries(object).sort((a, b) => {
        return b[1]-a[1]
    })
}

module.exports = {
    printReport,
    sort
}