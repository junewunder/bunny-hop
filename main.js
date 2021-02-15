import * as PIXI from 'pixi.js'

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

app.loader
  .add('bunnysprite', 'bunnyhop/bunnysprite.json')
  .add('happie', 'bunnyhop/happie.json')
  .add('turtle', 'bunnyhop/turtle.json')
  .add('platforms', 'bunnyhop/platforms.json')
  .add('signs', 'bunnyhop/signs.json')
  .add('death', 'bunnyhop/death.json')
  .add('coin', 'bunnyhop/coin.json')
  .add('coincollect', 'bunnyhop/coincollect.json')
  .add('coinbig', 'bunnyhop/coinbig.json')
  .add('coinbigcollect', 'bunnyhop/coinbigcollect.json')
  .add('spike', 'bunnyhop/spike.json')
  .add('platformbumper', 'bunnyhop/platformbumper.json')
  .add('movingplatform', 'bunnyhop/movingplatform.json')
  
  .add('tut_congrats', 'bunnyhop/tut_congrats.png')
  
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
