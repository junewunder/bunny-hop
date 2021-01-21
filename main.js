import * as PIXI from 'pixi.js'
import { Engine, Runner, Body, Bodies, World } from 'matter-js'
import { makeCharacter } from './src/character'
import { makePlatformGenerator } from './src/platform'

const WIDTH = window.innerWidth * 0.95
const HEIGHT = window.innerHeight * 0.95

const pixi = new PIXI.Application({
    antialias: true,
    height: HEIGHT,
    width: WIDTH,
});
const engine = Engine.create();
const world = engine.world;
const runner = Runner.create();

Runner.run(runner, engine);
world.gravity.y = 2

const floor = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 50, { isStatic: true })
const leftWall = Bodies.rectangle(0, HEIGHT / 2, 50, HEIGHT, { isStatic: true })
const rightWall = Bodies.rectangle(WIDTH, HEIGHT / 2, 50, HEIGHT, { isStatic: true })

makeCharacter({ engine, pixi, x: WIDTH / 2, y: HEIGHT / 2 })
makePlatformGenerator({ pixi, engine, floor, WIDTH })

World.add(world, [
    floor,
    leftWall,
    rightWall,
]);

const graphics = new PIXI.Graphics();
pixi.stage.addChild(graphics);
pixi.ticker.add(() => {
    graphics.clear()
    graphics.beginFill(0xDE3249);
    for (const body of [floor, leftWall, rightWall]) {
        graphics.drawRect(
            body.bounds.min.x,
            body.bounds.min.y,
            body.bounds.max.x - body.bounds.min.x,
            body.bounds.max.y - body.bounds.min.y
        );
    }
    graphics.endFill();
})

document.body.appendChild(pixi.view);