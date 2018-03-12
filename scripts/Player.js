/*
 * Player class for Raytrace Demo
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
class Player {

    constructor( x, y, direction ) {
        let m = app.private.members( this, {
            direction: direction,
            weapon: new Bitmap('images/knife_hand.png', 319, 320 ),
            paces: 0
        });
        this.x = x;
        this.y = y;
        this.rotate( 0 );
	}

    get direction() { return app.private.members( this ).direction; }
    get weapon()    { return app.private.members( this ).weapon; }
    get paces()     { return app.private.members( this ).paces; }

	rotate( angle ) {
        
		let m = app.private.members( this );
		m.direction = (m.direction + angle + Math.PI * 2) % (Math.PI * 2);
	}

	walk( distance, map ) {
		let m = app.private.members( this );

		if (map.wallGrid.tile( this.x + (Math.cos( m.direction ) * distance), this.y ) <= 0)
			this.x += Math.cos( m.direction ) * distance;

		if (map.wallGrid.tile( this.x, this.y + (Math.sin( m.direction ) * distance)) <= 0)
			this.y += Math.sin( m.direction ) * distance;

		m.paces += distance;
	}

	update( controls, map, seconds ) {

		if (controls.left)
			this.rotate( -Math.PI * seconds );

		if (controls.right)
			this.rotate( Math.PI * seconds );

		if (controls.forward)
			this.walk( 3 * seconds, map );

		if (controls.backward)
			this.walk( -3 * seconds, map );
	}
}
