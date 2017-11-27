# PROPS MÁQUINA

3D Software Renderer Engine Demo. 

## Getting Started



### Prerequisites

I only tested in Chrome, but I think it should work on any browser that supports a canvas element.

### Installing

Clone the repo and start a local server on your project root folder.

Example:
If you have php installed type this in terminal:
`php -S localhost:8000`

If not, try installing a server extension on your chrome browser:
[example](https://www.youtube.com/watch?v=AK6swHiPtew)


## Trying stuff around

There is absolutely no documentation except for a few comments that wont make your life easier.
You should know the basics on how a 3d render engine works. May God guide you through this code...

While developing, load the "editor" (the main `index.html` file) and play around with Maquina.js and PropsCamera.js files, which is where everything happens.

## Deployment

I'm using uglifyjs to minimize the project into a single .js file (`build/pm.js`), and [this site](https://cssminifier.com/) to minify the final css (`build/styles_prod.css`).
Then I copy/paste everything into the build/index.html `<style>` and `<script>` tags.

## Built With

* Pure JavaScript
* [uglifyjs](https://www.npmjs.com/package/uglify-js-es6) - To generate the final js code.
* [Blender](https://www.blender.org/) - For the 3d models.
* [Affinity Designer](https://affinity.serif.com/en-gb/) - For the graphics.


## Authors

* **cc2017 (Bruno Perry)** - *Code and GFX* - [brunoperry.net](https://brunoperry.net)
* **EviL** - *Music and SFX* - [glenz.org](http://glenz.org/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
