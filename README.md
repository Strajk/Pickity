# Pickity

Searching for geolocations inside the webpage and showing for how much you can get there.

**Hardcore WIP, travel hackaton test project to try out Chrome Extension development**

**Do not use, I mean it**

![](screenshot-instagram.png)

![](screenshot-flickr.png)


### How to run
Check Gruntfile

```
grunt debug
```

### Technical dept
* Libs are downloaded directly to libs folder
* Mocks are inline, enabled just by local flag `mock = true`
* No modules, everything in one file to avoid build system
* Not possible to set origin airport, hardcoded to BRQ
* Config in global variable
* Config is not editable without editing code
* Google API key hardcoded: AIzaSyDXgxOiMO6iDTG-SN_DL_Wv7uFwm_Wk7sY
* setInterval to find out if there are new images loaded on the page (e.g. on Instagram lazyloading)
* Finding and selecting target elements is to verbose
* Extension is loaded on all pages, should be white-listed
* No tests - YOLO!
