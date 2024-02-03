const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHtml, getAbsoluteURL } = require('./crawl');

test('Checks paths with / at the end', () => {
    const expected = "test.dev/path"
    expect(normalizeURL("https://test.dev/path/")).toBe(expected)
    expect(normalizeURL("https://test.dev/path")).toBe(expected)
    expect(normalizeURL("http://test.dev/path/")).toBe(expected)
    expect(normalizeURL("http://test.dev/path")).toBe(expected)
    expect(normalizeURL("http://test.dev/path//")).toBe(expected)
    expect(normalizeURL("https://test.dev/path//")).toBe(expected)
    expect(normalizeURL("http://test.dev/path///")).toBe(expected)
    expect(normalizeURL("https://test.dev/path///")).toBe(expected)
    expect(normalizeURL("http://test.dev/path/")).toBe(expected)
});

test('Checks that multiple // before the path are removed', () => {
    const expected = "test.dev/path"
    expect(normalizeURL("http://test.dev//path/")).toBe(expected)
    expect(normalizeURL("https://test.dev//path")).toBe(expected)
});

test('Checks paths with username and password', () => {
    const expected = "usr:pass@test.dev/path"
    expect(normalizeURL("http://usr:pass@test.dev/path")).toBe(expected)
    expect(normalizeURL("https://usr:pass@test.dev/path/")).toBe(expected)
});


test('Checks paths for port', () => {
    const expected = "test.dev:8080/path"
    expect(normalizeURL("http://test.dev:8080/path")).toBe(expected)
    expect(normalizeURL("https://test.dev:8080/path/")).toBe(expected)
});


test('Checks paths for params', () => {
    const expected = "test.dev/path?q=awsd"
    expect(normalizeURL("http://test.dev/path?q=awsd")).toBe(expected)
    expect(normalizeURL("https://test.dev/path?q=awsd")).toBe(expected)
});

test('Gets all the anchors in the html', () => {
    const url = "http://test.dev"
    const html = `<html>
    <body>
        <a href="https://test.dev"><span>Go to Boot.dev</span></a>
        <a href="https://test.dev/h1"><span>Go to Boot.dev 2</span></a>
        <a href="https://test.dev/h2"><span>Go to Boot.dev 3</span></a>
        <a href="   https://test.dev/h3"><span>Go to Boot.dev 3</span></a>
    </body>
    </html>
    `;
    let expected = ["https://test.dev/",
                    "https://test.dev/h1",
                    "https://test.dev/h2",
                    "https://test.dev/h3",]
    let actual = getURLsFromHtml(html, url);
    expect(actual).toStrictEqual(expected);
});

test('Gets the absolute url given a path only', () => {
    const path = "/blog";
    const baseUrl = "https://test.dev/";
    let expected = "https://test.dev/blog";
    let actual = getAbsoluteURL(baseUrl, path);
    expect(actual).toStrictEqual(expected);
});

test('Returns the url it is valid', () => {
    const path = "https://test.dev/blog";
    const baseUrl = "https://test.dev/";
    let expected = "https://test.dev/blog";
    let actual = getAbsoluteURL(baseUrl, path);
    expect(actual).toStrictEqual(expected);
});