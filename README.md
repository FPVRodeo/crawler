# Running Crawlers and Scrapers
* Run `yarn`
* Run locally via `handler.js` for now.
* ???
* PROFIT

`crawler.js` and `scraper.js` are the serverless Lambda integrations of the
respective crawler and scraper classes. These are managed by `serverless.yml`
This will be thrown into a CI/CD solution at some point to auto-deploy to AWS.

# Running ElasticSearch locally
See notes inside `docker-compose.yml` that contains all the info you need to get it running
locally.

## Loading Elastic Search with records.
There's an example inside `handler.js` using the hobbyrc scraper lines 101-117 (as of this commit).
This just uses axios to POST to AppSearch Documents, Make sure to update the Auth header with your private-token from AppSearch.
Will need to change the `localhost:3002` to reflect the `3123` port specified in `docker-compose.yml`

If you've already got a bunch of json files in a directory you can run the cheeky bash one-liner below, this will POST all files in the current directory to ElasticSearch. Just make sure to update the Auth header, search-engine-name, and potentially the host:port
```
find ./ -name '*' -type f -exec curl -s -XPOST -H 'Authorization: Bearer private-token' localhost:3123/api/as/v1/engines/search-engine-name/documents --data-binary @{} \;
```

## Notes / Todos
* Still need to attach this repo to a CI/CD solution to auto deploy using serverless.
* Currently been running locally using Node 12, need to confirm it works with Node 14.
* Write a solution that updates elasticsearch once a scrape is complete. Can probably use S3 Events for this, i.e. trigger lambda function whenever new json file is added to S3, and post to ElasticSearch

# FPV Rodio - Website Datatypes

## UK
Some SRCs https://www.facebook.com/DroneCircle/photos/a.149722949063895/563333437702842/?type=3&theater

* Quadcopters.co.uk - JSON LD - https://www.quadcopters.co.uk/sitemap.xml
* HobbyRC - Microdata - https://www.hobbyrc.co.uk/sitemap.xml
* UnmannedTech - JSON LD - https://www.unmannedtechshop.co.uk/image-sitemap-index-1.xml
* MakeItBuildIt - Microdata - https://www.makeitbuildit.co.uk/sitemap.xml
* Droneislife - JSON LD & Microdata - https://droneislife.co.uk/sitemap.xml
* HobbyKing - Microdata (will need some extra jank) - HTML Sitemap https://hobbyking.com/en_us/catalog/seo_sitemap/product

## USA
* RDQ - JSON LD - https://www.racedayquads.com/sitemap.xml
* GetFPV - JSON LD - NO SITEMAP - Need to scrape https://www.getfpv.com/catalog/seo_sitemap/product/?p=[page no.]
* Pyrodrone - Microdata - https://pyrodrone.com/sitemap.xml
* heli-nation.com - Microdata - https://www.heli-nation.com/catalog/seo_sitemap/product
