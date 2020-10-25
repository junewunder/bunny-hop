import {
    Body,
    Engine,
    Render,
    Runner,
    Composite,
    Composites,
    Common,
    Events,
    MouseConstraint,
    Mouse,
    World,
    Bodies,
    Query,
} from "matter-js";

import { makeCharacter } from './src/character'
import { makePlatform, makePlatformGenerator } from './src/platform'

const WIDTH = window.innerWidth - 50
const HEIGHT = window.innerHeight - 50

var Main = Main || {};

Main.init = function () {
    // create engine
    const engine = Engine.create();
    const world = engine.world;
    world.gravity.y = 2

    // create renderer
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            showAngleIndicator: true,
            showCollisions: true,
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    const character = makeCharacter({ engine, x: WIDTH / 2, y: HEIGHT / 2 })
    
    Events.on(engine, 'collisionActive', (event) => {
    });

    const floor = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 50, { isStatic: true })
    const platformGenerator = makePlatformGenerator({ floor, engine, WIDTH })

    World.add(world, [
        // walls
        // Bodies.rectangle(WIDTH / 2, 0, WIDTH, 50, { isStatic: true }),
        floor,
        Bodies.rectangle(WIDTH, HEIGHT / 2, 50, HEIGHT, { isStatic: true }),
        Bodies.rectangle(0, HEIGHT / 2, 50, HEIGHT, { isStatic: true }),
    ]);

    // add mouse control
    // var mouse = Mouse.create(render.canvas),
    //     mouseConstraint = MouseConstraint.create(engine, {
    //         mouse: mouse,
    //         constraint: {
    //             stiffness: 0.2,
    //             render: {
    //                 visible: false
    //             }
    //         }
    //     });

    // World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    // render.mouse = mouse;

    // fit the render viewport to the scene
    // Render.lookAt(render, {
    //     min: { x: 0, y: 0 },
    //     max: { x: WIDTH, y: HEIGHT }
    // });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        // render: render,
        canvas: render.canvas,
        stop: function () {
            // Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    }
};

Main.init()