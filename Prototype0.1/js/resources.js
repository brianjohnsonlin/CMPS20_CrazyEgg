game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
	{name: "area01_level_tiles",  type:"image", src: "data/img/map/area01_level_tiles.png"},
	{name: "eggy", type:"image", src: "data/img/sprite/eggy.png"},
	{name: "metatiles32x32",  type:"image", src: "data/img/map/metatiles32x32.png"},
	{name: "title_screen",  type:"image", src: "data/img/gui/title_screen.png"},
	
	// the parallax background
    {name: "area01_bkg0",         type:"image", src: "data/img/area01_bkg0.png"},
    {name: "area01_bkg1",         type:"image", src: "data/img/area01_bkg1.png"},
    {name: "fire",       		  type:"image", src: "data/img/sprite/fire.png"},
    {name: "icicle",       		  type:"image", src: "data/img/sprite/icicle.png"},
    {name: "platform",       	  type:"image", src: "data/img/sprite/platform.png"},
     // game font
    {name: "32x32_font",          type:"image", src: "data/img/font/32x32_font.png"},
     
	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
 	{name: "area01", type:"tmx", src:"data/map/area01.tmx"},
 	{name: "area02", type:"tmx", src:"data/map/area02.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/", channel : 1},
	 */	
    {name: "dst-inertexponent", type: "audio", src: "data/bgm/", channel : 1},
     
	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/", channel : 2}
	 */
	{name: "cling", type: "audio", src: "data/sfx/", channel : 2},
    {name: "stomp", type: "audio", src: "data/sfx/", channel : 1},
    {name: "jump",  type: "audio", src: "data/sfx/", channel : 1}
];
