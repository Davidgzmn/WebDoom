/*
 * Camera class for Raytrace Demo
 *
 * Based on an original work by XXXXXXXXXXXX.  All due credits to him for the
 * original concept and algorithms
 *
 * @author: Scott Henshaw
 * @link mailto:shenshaw@vfs.com
 * @version: 1.1.0
 *
 */
const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent );

class Camera {

	constructor( canvas, resolution, focalLength ) {

		canvas.width = window.innerWidth * 0.5;
		canvas.height = window.innerHeight * 0.5;

        let m = app.private.members( this, {

            ctx:    canvas.getContext( '2d' ),
    	    width:  canvas.width,
    	    height: canvas.height,

    	    resolution: resolution,
    	    spacing:    canvas.width / resolution,

    	    focalLength: focalLength || 0.8,
    	    lightRange:  8,
    	    scale:       (canvas.width + canvas.height) / 1200,
    	    range:       MOBILE ? 8 : 14,

    	    rainEnabled: true,
    	    lighteningEnabled: false
        });
	}

	render( player, map ) {

	    this.drawSky( player.direction, map.skybox, map.light );
	    this.drawColumns( player, map );
	    this.drawWeapon( player.weapon, player.paces );
	}

	drawSky( direction, sky, ambient ) {
	    let m = app.private.members( this );

		let local = {
			width: sky.width * (m.height / sky.height) * 2,
			left: (direction / (Math.PI * 2.0)) * -m.width
		}

	    m.ctx.save();

	    m.ctx.drawImage( sky.image, local.left, 0, local.width, m.height );
	    if (local.left < local.width - m.width) {
	        m.ctx.drawImage( sky.image, local.left + local.width, 0, local.width, m.height );
	    }

	    // lightning aka a fill on the rectangle
	    if (m.lighteningEnabled) {
	        if (ambient > 0) {

	            m.ctx.fillStyle = '#ffffff';
	            m.ctx.globalAlpha = ambient * 0.3;
	            m.ctx.fillRect( 0, m.height * 0.5, local.width, m.height * 0.5 );
	        }
	    }
	    m.ctx.restore();
	}

    drawWeapon( weapon, paces ) {
        let m = app.private.members( this );

        let bobX = Math.cos( paces * 2 ) * m.scale * 6;
        let bobY = Math.sin( paces * 4 ) * m.scale * 6;

        let left = m.width * 0.66 + bobX;
        let top = m.height * 0.6 + bobY;

        m.ctx.drawImage( weapon.image, left, top, weapon.width * m.scale, weapon.height * m.scale );
    }

	drawColumns( player, map ) {
        let m = app.private.members( this );

	    m.ctx.save();

	    for (let column = 0; column < m.resolution; column++) {

	        let x = column / m.resolution - 0.5;
	        let angle = Math.atan2( x, m.focalLength );
	        let ray = map.cast( player, player.direction + angle, m.range );

	        this.drawSingleColumn( column, ray, angle, map );
	    }

	    m.ctx.restore();
	}

	drawSingleColumn( column, ray, angle, map ) {
        let m = app.private.members( this );

	    let texture = map.wallTexture;
	    let left = Math.floor( column * m.spacing );
	    let width = Math.ceil( m.spacing );
	    let hit = -1;

	    while (++hit < ray.length && ray[hit].height <= 0);

	    for (let s = ray.length - 1; s >= 0; s--) {

	        let step = ray[s];
	        if (s === hit) {
	            let textureX = Math.floor( texture.width * step.offset );
	            let wall = this.project( step.height, angle, step.distance );

	            m.ctx.globalAlpha = 1;
	            m.ctx.drawImage( texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height );

	            // Lighting darken with distance
	            let mapLightFactor = 0.4;
	            if (m.lighteningEnabled) {
	                mapLightFactor = map.light;
	            }
                m.ctx.fillStyle = '#000000';
                m.ctx.globalAlpha = Math.max( (step.distance + step.shading) / m.lightRange - mapLightFactor, 0 );
                m.ctx.fillRect( left, wall.top, width, wall.height );
	        }
	        m.ctx.fillStyle = '#ffffff';
	        m.ctx.globalAlpha = 0.15;

	        if (m.rainEnabled) {
	            let rainDrops = Math.pow( Math.random(), 3 ) * s;
	            let rain = (rainDrops > 0) && this.project( 0.1, angle, step.distance );
	            while (--rainDrops > 0) {
	                m.ctx.fillRect( left, Math.random() * rain.top, 1, rain.height );
	            }
	        }
	    }
	}

	project( height, angle, distance ) {
        let m = app.private.members( this );

	    var z = distance * Math.cos( angle );
	    var wallHeight = m.height * height / z;
	    var bottom = m.height / 2 * (1 + 1 / z);

	    return {
	        top : bottom - wallHeight,
	        height : wallHeight
	    };
	}

}
