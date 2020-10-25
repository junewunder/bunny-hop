import {
    Body,
    Bodies,
    Bounds,
    Composite,
    Events,
    Query,
    World,
} from "matter-js";

const bound = (upper, lower) => x => Math.min(Math.max(x, lower), upper)
const boundAbs = lim => bound(lim, -lim)

let holdingUp = false
let holdingDown = false
let holdingRight = false
let holdingLeft = false
let holdingSpace = false
document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowUp" || e.keyCode === 87) holdingUp = true
    if (e.code === "ArrowDown" || e.keyCode === 83) holdingDown = true
    if (e.code === "ArrowLeft" || e.keyCode === 65) holdingRight = true
    if (e.code === "ArrowRight" || e.keyCode === 68) holdingLeft = true
    if (e.keyCode === 32) holdingSpace = true
});
document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowUp" || e.keyCode === 87) holdingUp = false
    if (e.code === "ArrowDown" || e.keyCode === 83) holdingDown = false
    if (e.code === "ArrowLeft" || e.keyCode === 65) holdingRight = false
    if (e.code === "ArrowRight" || e.keyCode === 68) holdingLeft = false
    if (e.keyCode === 32) holdingSpace = false
});

let NUM_JUMPS = 2
let NUM_DASHES = 1
let SPRITE_TICK_COOLDOWN = 10
let WIDTH_WALK = 80
let HEIGHT_WALK = 40

// sprites
// walk, wallgrab, dash

export function makeCharacter ({engine, x, y}) {
    let spriteTickCooldown = 0
    const body = Bodies.rectangle(x, y, WIDTH_WALK, HEIGHT_WALK, {
        isStatic: false,
        mass: 0,
        frictionAir: 0.01,
        friction: 1,
        label: 'Character',
    })

    let currentSprite = 'walk'
    let jumpsRemaining = NUM_JUMPS
    let dashesRemaining = NUM_DASHES
    const moveVelBound = 10
    const jumpVelBound = moveVelBound * 1.5

    const addVelocity = ({ x = 0, y = 0 }) => Body.setVelocity(body, {
        x: boundAbs(moveVelBound)(body.velocity.x + x),
        y: boundAbs(jumpVelBound)(body.velocity.y + y)
    })

    let canQueueJump = true
    let shouldJump = false
    let canQueueDash = true
    let shouldDash = false
    Events.on(engine, 'beforeUpdate', e => {
        const velIncrement = 5

        if (holdingUp && canQueueJump) { shouldJump = true }
        if (!holdingUp) { canQueueJump = true }
        if (shouldJump && jumpsRemaining > 0) {
            jumpsRemaining--
            shouldJump = false
            canQueueJump = false
            addVelocity({ y: -velIncrement * 10 })
        }
        if (holdingSpace && canQueueDash) { shouldDash = true }
        if (!holdingSpace) { canQueueDash = true }
        if (shouldDash && dashesRemaining > 0) {
            dashesRemaining--
            shouldDash = false
            canQueueDash = false
            addVelocity({
                x: body.velocity.x,
                y: body.velocity.y,
            })
        }

        if (holdingLeft) addVelocity({ x: velIncrement })
        if (holdingRight) addVelocity({ x: -velIncrement })

        Body.setAngularVelocity(body, 0)
    })

    function spriteWalking () {
        if (currentSprite !== 'walk') {
            console.log('walk');
            currentSprite = 'walk'
            Body.scale(body, 2, 0.5)
        }
    }

    function spriteWallgrab (other) {
        console.log('wallgrab');
        currentSprite = 'wallgrab'
        Body.scale(body, 0.5, 2)
        let offset = other.position.x < body.x ? -10 : 10
        Body.setPosition(body, {
            x: body.position.x + (WIDTH_WALK / 4) + offset,
            y: body.position.y,
        })
    }

    function resetJumps () {
        jumpsRemaining = NUM_JUMPS
        dashesRemaining = NUM_DASHES
    }

    Events.on(engine, 'beforeUpdate', e => {
        const collisions = Query.collides(body, Composite.allBodies(engine.world))

        let shouldWallgrab = false
        let wallToGrab = null
        // if (holdingSpace) console.log('logging collisions');
        for (let collision of collisions) {
            if (collision.bodyB.id === body.id) { continue }
            // if (holdingSpace) {
            //     console.log(collision);
            // }
            if (collision.axisNumber === 1) {
                shouldWallgrab = true
                wallToGrab = collision.bodyB
            }

            resetJumps()
        }
        
        if (spriteTickCooldown === 0) {
            if (shouldWallgrab && currentSprite !== 'wallgrab') { 
                spriteWallgrab(wallToGrab)
                spriteTickCooldown = SPRITE_TICK_COOLDOWN
            }
            if (!shouldWallgrab && currentSprite !== 'walking') {
                spriteWalking()
                spriteTickCooldown = SPRITE_TICK_COOLDOWN
            }
        } else {
            spriteTickCooldown--
        }
    })

    World.add(engine.world, [ body ])

    return {
        body,
        resetJumps,
    }
}