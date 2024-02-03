# Web Crawler

Console application that given an URL performs a Depth-First Search on all the URLs in the same domain and generates a report about the crawled pages.

## Quick Start

Install `npm` dependencies and run using `npm start <url_to_crawl>`. This tools expects one parameter to run, the URL to crawl

## Report Generated

- All unique pages
- Total count of the pages found

## Limitations

- The URL normalization function doesn't consider the following cases:
    - Removal of standard ports for http and https
    - Sorting of query parameters
    - Path is not converted to its canonical form.
- `getAbsoluteURL` assumes that if an url starts with '/', it should be appended to the base URL. No edge cases are considered.
- A queue system or worker pool would help control concurrency
- No content hashing

## Known Issues

- This implemenation does not respect the rules inside Robots.txt