# web-crawler
A simple web crawler that retrieves all the links from a starting URL (within the same domain) and stores it in form of an N-ary tree (stored in a `results.json` file).

## Problem statement
Build a web crawler with the following specifications:
- The crawler should have a starting (base) URL.
- The crawler should visit each URL it finds on the same domain. 
- It should print each URL visited, and a list of links found on that page. 
- The crawler should be limited to one subdomain.


## Getting started
These instructions will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites
System requirements for this project to work includes:
- Node.js( >= v14).
- Node Package Manager (NPM) or Yarn.
- Typescript globally installed.

### Installation
To install the dependencies in the package.json file, run the following command: 

```bash
yarn install
```

### Running the project
To run the project on your local machine, run the following commands sequentially on your computer's terminal:  


```bash
yarn build
yarn start
```

To run the project in development mode, run the following commands separately:
```bash
yarn watch
yarn start:dev
```

## Automated Tests
I didn't include unit tests as a result of time constraint.

## Performance optimization strategies
- concurrency & batch processing (higher batch sizes leads to faster crawling).
- retries for failed requests.
- handled duplicate links.
- each node is visited only once.
- `randomDelay` to mimick human behaviour when visiting sites. (and bypass rate limiters)
- built as a library

## Possible improvements
- unit & integration tests.
- rate limiter for maximum number of sites to be visited. (per node or total nodes in the tree).
- provide backwards compactibility for old websites relative links e.g `www.example.com/careers.html`
- check for 404 errors when making requests and set `count = maxRetries` so it can skip immediately (whch would save some milliseconds)
- add time range for `randomDelay` to config

## Unit testing
- test everything in `fetch.ts` to ensure that it fetches html correctly and retries correctly
- test `getLinksFromWebsite` to ensure that it performs as expected and returns the appropriate result in success and failure modes
- test `splitToChunks` in success and failure modes
- test `asyncSeriesLoop` and `asyncParallelLoop` to ensure that it performs as expected in success and failure modes


## Built with
- [Node.js](https://nodejs.org) - JavaScript runtime for backend development.
- [TypeScript](https://www.typescriptlang.org/) - The language used.
- [Yarn](https://yarnpkg.com/) - Package Manager for Node.js.
- [Cheerio](https://cheerio.js.org/) - Library for DOM traversal.
- [Axios](https://axios-http.com/) - HTTP client for Node.js.



