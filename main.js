import * as PIXI from 'pixi.js'

// import * as assets from './assets/*.json'
// import * as pngassets from './assets/*.png'

import World from './src/world'
import Room from './src/room'
import Collider from './src/blah/collider'

const WIDTH = window.innerWidth * 0.95
const HEIGHT = window.innerHeight * 0.95

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const app = new PIXI.Application({
  antialias: false,
  height: HEIGHT,
  width: WIDTH,
});
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

// console.log('assets', assets)
// console.log('assets', pngassets)

app.loader
  .add('bunnysprite', 'bunnyhop/bunnysprite.json')
  .add('happie', 'bunnyhop/happie.json')
  .add('turtle', 'bunnyhop/turtle.json')
  .add('platforms', 'bunnyhop/platforms.json')
  .add('leveltest', 'bunnyhop/leveltest.json')
  .add('levelbox', 'bunnyhop/levelbox.json')
  .add('signs', 'bunnyhop/signs.json')
  .add('death', 'bunnyhop/death.json')
  // .add(assets.bunnysprite) //'bunnysprite.json')
  // .add(assets.happie) //'happie.json')
  // .add(assets.turtle) //'turtle.json')
  // .add(assets.platforms) //'platforms.json')
  // .add(assets.leveltest) //'leveltest.json')
  // .add(assets.levelbox) //'levelbox.json')
  // .add(assets.signs) //'signs.json')
  // .add(assets.death) //'death.json')
  .load(onAssetsLoaded);

function onAssetsLoaded ({resources}) {  
  const world = new World(app, resources)
  app.ticker.add(() => {

    world.update()

    graphics.clear()
    graphics.beginFill(0xDE3249);
    // for (const body of [floor, leftWall, rightWall]) {
    //   graphics.drawRect(
    //     body.bounds.min.x,
    //     body.bounds.min.y,
    //     body.bounds.max.x - body.bounds.min.x,
    //     body.bounds.max.y - body.bounds.min.y
    //   );
    // }
    graphics.endFill();
  })
}
