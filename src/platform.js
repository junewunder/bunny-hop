import * as PIXI from 'pixi.js'
import {
    Body,
    Bodies,
    Events,
    Query,
    World,
} from "matter-js";

export function makePlatform({engine, pixi, x, y, isVertical}) {

    const [width, height] = isVertical ? [10, 200] : [200, 10]

    const body = Bodies.rectangle(x, y, width, height, {
        isStatic: false,
        mass: 0,
        frictionAir: .5,
        friction: 1
    })

    const onBeforeUpdate = e => {
        Body.setAngularVelocity(body, 0)
    }
    Events.on(engine, 'beforeUpdate', onBeforeUpdate)
    
    const graphics = new PIXI.Graphics();
    pixi.stage.addChild(graphics);
    const graphicsTick = () => {
        graphics.clear()
        graphics.beginFill(0xDE3249);
        graphics.drawRect(
            body.bounds.min.x,
            body.bounds.min.y,
            body.bounds.max.x - body.bounds.min.x,
            body.bounds.max.y - body.bounds.min.y
        );
        graphics.endFill();
    }
    pixi.ticker.add(graphicsTick)

    const clear = () => {
        pixi.stage.removeChild(graphics)
        World.remove(engine.world, body)
        Events.off(engine, 'beforeUpdate', onBeforeUpdate)
    }
    Body.set(body, { clear })

    return {
        body,
        clear,
    }
}

export function makePlatformGenerator({ engine, pixi, floor, WIDTH }) {
    let platforms = []
    Events.on(engine, 'beforeUpdate', e => {
        if (Math.random() < .01) {
            const platform = makePlatform({
                engine,
                pixi,
                x: Math.random() * (WIDTH - 50) + 25,
                y: 100,
                isVertical: Math.random() > .5,
            })
            platforms.push(platform.body)
            World.add(engine.world, platform.body)
        }

        const collisions = Query.collides(floor, platforms)
        for (let collision of collisions) {
            const idx = platforms.indexOf(collision.bodyB)
            platforms.splice(idx, 1)
            collision.bodyB.clear()
        }
    })
}