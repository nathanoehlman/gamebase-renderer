/**
  The Camera that displays the terrain
  
  Based off of the BrowserQuest renderer camera
 **/
function Camera(renderer) {
    this.renderer = renderer;
    this.x = 0;
    this.y = 0;
    this.gridX = 0;
    this.gridY = 0;
    this.offset = 0.5;
    this.rescale();
}

/**
  Rescales the camera viewport
 **/
Camera.prototype.rescale = function() {
    var factor = this.renderer.mobile ? 1 : 2;

    this.gridW = 15 * factor;
    this.gridH = 7 * factor;

    log.debug("---------");
    log.debug("Factor:"+factor);
    log.debug("W:"+this.gridW + " H:" + this.gridH);
}

/**
  Sets the position of the camera
 **/
Camera.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    this.gridX = Math.floor( x / 16 );
    this.gridY = Math.floor( y / 16 );
}

/**
  Sets the grid position for the camera
 **/
Camera.prototype.setGridPosition = function(x, y) {
    this.gridX = x;
    this.gridY = y;

    this.x = this.gridX * 16;
    this.y = this.gridY * 16;
}

/**
  Instructs the camera to focus on a particular entity
 **/
Camera.prototype.lookAt = function(entity) {
    var r = this.renderer,
    x = Math.round( entity.x - (Math.floor(this.gridW / 2) * r.tilesize) ),
    y = Math.round( entity.y - (Math.floor(this.gridH / 2) * r.tilesize) );

    this.setPosition(x, y);
}

/**
  Performs something for each visible position
 **/
Camera.prototype.forEachVisiblePosition = function(callback, extra) {
    var extra = extra || 0;
    for(var y=this.gridY-extra, maxY=this.gridY+this.gridH+(extra*2); y < maxY; y += 1) {
        for(var x=this.gridX-extra, maxX=this.gridX+this.gridW+(extra*2); x < maxX; x += 1) {
            callback(x, y);
        }
    }
}
    
/**
  Returns true if an entity is visible to the camera
 **/
Camera.prototype.isVisible = function(entity) {
    return this.isVisiblePosition(entity.gridX, entity.gridY);
}
 
/**
  Returns true if the grid position given by x,y is visible to the camera
 **/   
Camera.prototype.isVisiblePosition = function(x, y) {
    if(y >= this.gridY && y < this.gridY + this.gridH
    && x >= this.gridX && x < this.gridX + this.gridW) {
        return true;
    } else {
        return false;
    }
}

/**
  Focuses the camera position to the given entity
 **/
Camera.prototype.focusEntity = function(entity) {
    var w = this.gridW - 2,
        h = this.gridH - 2,
        x = Math.floor((entity.gridX - 1) / w) * w,
        y = Math.floor((entity.gridY - 1) / h) * h;

    this.setGridPosition(x, y);
}