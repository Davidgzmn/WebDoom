/**
 * Game MAIN
 *
 * @copyright: (C) 2016-2017 Kibble Games Inc in cooperation with Vancouver Film School.
 * All Rights Reserved.
 *
 * Based on an original work by XXXXXXXXXXXX.  All due credits to him for the
 * original concept and algorithms
 *
 * @author: Scott Henshaw
 * @link mailto:shenshaw@vfs.com
 * @version: 1.1.0
 * @summary: Framework Singleton Class to contain a web app
 *
 */
//const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

// Constants
const COUNTER       = 1;
const SECONDS_AS_MS = 1000;
const TARGET_FPS    = 60;
const TARGET_MS_PER_TICK = SECONDS_AS_MS / TARGET_FPS;

class Game {

    constructor() {

    	let m = app.private.members( this, {

	        // Start with tick 0
	    	tick: 0,
	    	lastTime: 0,

	    	theMap: null,
            theCharacter: null,
            theControls: null,
            theCamera: null
    	});

    	let interval = setInterval( () => {
    	    m.tick++;
    	    if (m.tick > 240)
    	        m.tick = 0;
	    }, TARGET_MS_PER_TICK );

	    let res = MOBILE ? 768 : 1024;
	    m.theMap =       new Map( 200 );
	    m.theCharacter = new Player( 15.3, -1.2, Math.PI * 0.3 );
	    m.theControls =  new Controls();
	    m.theCamera =    new Camera( $('#display').get(0), res, 0.9 );

	    $('#start-button').on('click', ( event ) =>{
            $('#start-button').fadeOut( 1 * SECONDS_AS_MS );
	        $('#splash-screen').fadeOut( 3 * SECONDS_AS_MS );
            $('#game-area').fadeIn( 1 * SECONDS_AS_MS );
            $('#hud-overlay').fadeIn( 2 * SECONDS_AS_MS );
	    });

        $('#the-button').on('click', () => {
            $.post('server.php', "cmd=update")
            	.then( ( resultString ) => {
            		// Do something with the obj
    		    });
        });
        //this.profiler = new Profiler();
    }

    run() {
        let m = app.private.members( this );

		for (let i = 0; i < COUNTER; i++) {
			$('#splash-screen').hide();
			$('#splash-screen').show();
		}

        //let cp = this.profiler.addTimer('counter');
        //this.profiler.startTimer( cp );
        for (let i = 0; i < 1000000; i++) {
            if ((i % 10000) == 0) {
                console.log("+10,000...");
            }
        }
        //this.profiler.stopTimer( cp );
        //this.profiler.logTimer( cp );
		m.theMap.randomize();
        this._start( this._renderFrame );
	}

	_start( callback ) {
	    let m = app.private.members( this );
        window.requestAnimationFrame( ( TARGET_MS_PER_TICK ) => { this._frame( TARGET_MS_PER_TICK ); } );
    }

	_frame( time ) {
        let m = app.private.members( this );

        let seconds = (time - m.lastTime) / SECONDS_AS_MS;
        m.lastTime = time;

        //$('#debug-area').html('Counting to a big number: ' + counter );
        this._update( seconds );
        this._render( seconds );

        window.requestAnimationFrame( ( seconds ) => { this._frame( seconds ); } );
    }

	_update( seconds ) {
        let m = app.private.members( this );

        m.tick++;
        if (m.tick > 240)
            m.tick = 0;

        m.theMap.update( seconds );
    	m.theCharacter.update( m.theControls.states, m.theMap, seconds );
	}

	_render( seconds ) {
	    let m = app.private.members( this );
		m.theCamera.render( m.theCharacter, m.theMap );
	}
}


$(document).ready( () => {

    let game = new Game();
    game.run();
});
