import {
    Body,
    Bodies,
    Events,
    Query,
    World,
} from "matter-js";

export function makePlatform({x, y, isVertical, engine}) {

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
    
    const clearEvents = () => {
        Events.off(engine, 'beforeUpdate', onBeforeUpdate)
    }
    Body.set(body, { clearEvents })

    return {
        body,
        clearEvents,
    }
}

export function makePlatformGenerator({ floor, engine, WIDTH }) {
    let platforms = []
    Events.on(engine, 'beforeUpdate', e => {
        if (Math.random() < .01) {
            const platform = makePlatform({
                engine,
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
            World.remove(engine.world, collision.bodyB)
        }
    })
}