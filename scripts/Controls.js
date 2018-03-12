/*
 * Controls class for Raytrace Demo
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
class Controls {

	constructor() {
	    let m = app.private.members( this, {
            codes: {
	            37: 'left',    // Left Arrow
	            65: 'left',    // A
			    39: 'right',   // Right Arrow
	            68: 'right',   // D
			    38: 'forward', // up Arrow
		     	87: 'forward', // W
			    40: 'backward',// Back Arrow
			    83: 'backward' // S
	        },
            states: {
			    'left':     false,
	            'right':    false,
			    'forward':  false,
			    'backward': false
		    }
		});

		$(document).on('keydown',    event => { this.onKey( true, event ); });
		$(document).on('keyup',      event => { this.onKey( false, event ); });
		$(document).on('touchstart', event => { this.onTouch( event ); });
		$(document).on('touchmove',  event => { this.onTouch( event ); });
		$(document).on('touchend',   event => { this.onTouchEnd( event ); });
	}

    get states() { return app.private.members( this ).states; }

	onTouch( event ) {
		let t = event.touches[0];
		this.onTouchEnd( event );

		if (t.pageY < window.innerHeight * 0.5)
			this.onKey( true, { keyCode: 38 } );

		else if (t.pageX < window.innerWidth * 0.5)
			this.onKey( true, { keyCode: 37 });

		else if (t.pageY > window.innerWidth * 0.5)
			this.onKey( true, { keyCode: 39 } );
	}

	onTouchEnd( event ) {
        event.preventDefault();
        event.stopPropagation();

        let m = app.private.members( this );

		m.states = {
			'left' : false,
			'right' : false,
			'forward' : false,
			'backward' : false
		};
	}

	onKey( val, event ) {
        event.preventDefault();
        event.stopPropagation();

        let m = app.private.members( this );
        let state = m.codes[event.keyCode];

		if (typeof state === 'undefined')
			return;

		m.states[state] = val;
	}
}
