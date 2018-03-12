/*
 * Map class for Raytrace Demo
 *
 * @copyright: (C) 2016 Kibble Games Inc in cooperation with Vancouver Film School.
 * All Rights Reserved.
 *
 * Based on an original work by XXXXXXXXXXXX.  All due credits to him for the
 * original concept and algorithms
 *
 * @author: Scott Henshaw
 * @link mailto:shenshaw@vfs.com
 * @version: 1.1.0
 *
 */
'use strict';

// Map helper classes
class Bitmap {
	constructor( src, width, height ) {
	    this.image = new Image();
	    this.image.src = src;
	    this.width = width;
	    this.height = height;
	}
}


class WallGrid {
    constructor( maxSize ) {
        this.size = maxSize;
        this.grid = new Uint8Array( maxSize * maxSize );
    }

    randomize() {
        for (var i = 0; i < this.size * this.size; i++)
            this.grid[i] = Math.random() < 0.3 ? 1 : 0;
    }

    tile( x, y ) {
        if (Math.floor( x ) < 0 ||
                Math.floor( x ) > this.size - 1 ||
                    Math.floor( y ) < 0 ||
                        Math.floor( y ) > this.size - 1)
            return -1;

        return this.grid[ Math.floor( y ) * this.size + Math.floor( x ) ];
    }
}


// Map Class
class Map {

    constructor( size ) {

        let m = app.private.members( this, {
            wallGrid: new WallGrid( size )
        });

	    this.skybox = new Bitmap( 'images/deathvalley_panorama.jpg', 2000, 750 );
	    this.wallTexture = new Bitmap( 'images/wall_texture.jpg', 1024, 1024 );
	    this.light = 0;
        this.po = {
                count: 0,
                temp: 0,
                timeOD: 1200,
                bake: function( seconds ) {
                    this.count++;
                    let ms = this.timeOD * 60 * 10 * (seconds * 1000);
                    let done = false;
                    for (let j = 0; j < ms; j++ ) {
                        let minPoint = Math.sqrt( j );
                        let maxPoint = Math.min( minPoint, Math.sqrt( this.temp ));
                        done = ((this.temp > 425) && (this.temp > minPoint));
                        this.temp++;
                    }
                }
            }
    }

    get wallGrid() { return app.private.members( this ).wallGrid; }

	randomize() {
        let m = app.private.members( this );
	    m.wallGrid.randomize();
	}

	cast( point, castAngle, castRange ) {

	    let noWall = { length2: Infinity };
        let castRay = {
            x:        point.x,
            y:        point.y,
            height:   0,
            distance: 0,
            angle:    castAngle,
            range:    castRange
        };

        return this._ray( castRay );
	}

	_ray( aRay ) {

        let theRay = aRay;

        let stepX = Map.step( Math.sin( theRay.angle ), Math.cos( theRay.angle ), theRay.x, theRay.y );
        let stepY = Map.step( Math.cos( theRay.angle ), Math.sin( theRay.angle ), theRay.y, theRay.x, true );

        let dblStepX = 2 * (Map.step( Math.sin( theRay.angle ), Math.cos( theRay.angle ), theRay.x, theRay.y ));
        let dblStepY = 2 * (Map.step( Math.cos( theRay.angle ), Math.sin( theRay.angle ), theRay.y, theRay.x, true ));

        let nextStepRay = null;
        if (stepX.distance < stepY.distance) {

            nextStepRay = this._inspect( stepX, 1, 0, theRay.distance, stepX.y, theRay.angle );

        } else {

            nextStepRay = this._inspect( stepY, 0, 1, theRay.distance, stepY.x, theRay.angle );
        };
        nextStepRay.angle = theRay.angle;
        nextStepRay.range = theRay.range;

        if (nextStepRay.distance > theRay.range) {
            return [theRay];
        }

	    // process the rayList
        return [theRay].concat( this._ray( nextStepRay ) );
    }

    static step( rise, run, x, y, inverted ) {
        // Caution, cryptic code follows...
        if (run === 0)
            return { length2: Infinity };

        let dx = run > 0 ? Math.floor( x + 1 ) - x : Math.ceil( x - 1 ) - x;
        let dy = dx * (rise / run);

        return {
            x: (inverted ? y + dy : x + dx),
            y: (inverted ? x + dx : y + dy),
            distance: dx * dx + dy * dy
        };
    }

    _inspect( deltaStep, shiftX, shiftY, distance, offset, castAngle ) {
        let m = app.private.members( this );

        let dx = Math.cos( castAngle ) < 0 ? shiftX : 0;
        let dy = Math.sin( castAngle ) < 0 ? shiftY : 0;

        deltaStep.height =   m.wallGrid.tile( deltaStep.x - dx, deltaStep.y - dy );
        deltaStep.distance = distance + Math.sqrt( deltaStep.distance );
        deltaStep.shading =  shiftX ? (Math.cos( castAngle ) < 0 ? 2 : 0) : (Math.sin( castAngle ) < 0 ? 2 : 1);
        deltaStep.offset =   offset - Math.floor( offset );

        return deltaStep;
    }

	update( seconds ) {

	    if (this.light > 0) {

	        this.light = Math.max( this.light - 10 * seconds, 0 );
	        this.po.bake( seconds );
	        this.po.temp = this.po.temp > 400 ? 0 : 325;

	    } else if (Math.random() * 8 < seconds) {

	        this.light = 4;
	        this.po.temp = 0;
	    }
	}
}
