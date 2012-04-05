/**
  A canvas based renderer for 2D tile games. Displays information
  in layered canvases
  
  Based off of the BrowserQuest renderer (http://browserquest.mozilla.com)
 **/
function Renderer(opts) {
    
    this.container = $('#' + opts.container);
    this.layers = {};
    this.tilesize = opts.tileSize || 16;
    this.tilesets = opts.tilesets;

    this.FPS = opts.FPS || 50;
    this.lastTime = new Date();
    this.frameCount = 0;
    this.maxFPS = this.FPS;
    this.realFPS = 0;
    
}

/**
  Initialises the renderer
 **/
Renderer.prototype.init = function() {
    this.layers.terrain = addLayer('terrain');
    this.layers.sprites = addLayer('sprites');
    this.layers.foreground = addLayer('foreground');
    
    this.upscaledRendering = this.layers.terrain.context.mozImageSmoothingEnabled !== undefined;
}

/**
  Adds a canvas to the renderer
 **/
Renderer.prototype.addLayer = function(id) {
    this.container.append('<canvas id="layer' + id + '" class="rendered"></canvas>');
    var layer = $('#layer' + id);
    return {
        layer: layer,
        context: (layer && layer.getContext) ? layer.getContext("2d") : null
    };
}

/**
  Returns the scale factor to be used in rendering the grid
 **/
Renderer.prototype.getScaleFactor = function() {
    var w = window.innerWidth,
        h = window.innerHeight,
        scale;

    this.mobile = false;

    if(w <= 1000) {
        scale = 2;
        this.mobile = true;
    }
    else if(w <= 1500 || h <= 870) {
        scale = 2;
    }
    else {
        scale = 3;
    }

    return scale;
}

/**
  Rescales the map
 **/
Renderer.prototype.rescale = function(factor) {
    this.scale = this.getScaleFactor();

    this.createCamera();
    
    _.each(this.layers, function(value, key) {
        value.context.mozImageSmoothingEnabled = false;
    });

    this.initFont();
    this.initFPS();

    if (!this.upscaledRendering && this.tilesets) {
        this.setTileset(this.tilesets[this.scale - 1]);
    }
}

/**
  Creates the camera
 **/
Renderer.prototype.createCamera = function() {
    this.camera = new Camera(this);
    this.camera.rescale();
    
    var width = this.camera.gridW * this.tilesize * this.scale,
        height = this.camera.gridH * this.tilesize * this.scale;
        
    _.each(this.layers, function(value, key) {
        value.layer.width = width;
        value.layer.height = height;
    });
}

/**
  Returns the width of the canvases (in pixels)
 **/
Renderer.prototype.getWidth = function() {
    return this.layers.terrain.layer.width;
}

/**
  Returns the height of the canvases (in pixels)
 **/
Renderer.prototype.getHeight = function() {
    return this.canvas.height;
}

/**
  Sets the tileset
 **/
Renderer.prototype.setTileset = function(tileset) {
    this.tileset = tileset;
}