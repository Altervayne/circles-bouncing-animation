/* Getting necessary elements */
const canvas = document.getElementById("backgroundCanvas")
const addButton = document.getElementById("addBallButton")
const ctx = canvas.getContext("2d")

/* Setting canvas dimensions */
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* Declaring all physics variables */
const gravity = 0.5                     /* Default to 0.5 */
const drag = 0.005                      /* Default to 0.001 */
const elasticity = 1.3                  /* Default to 1.3 */

/* Initializing the circles array and asking user how many circles to create */
const maxCircles = 10                   /* Default to 10 */
let circles = []
const circleAmount = prompt("How many circles ?", "0")



/* --------------------------------------------------------------------------------------------- */


/* Initializing createCircle function, adding event listener to button and creating base circles */
function addCircle(x, y) {
    const radius = Math.random() * 50 + 10

    if(x + radius >= canvas.width) {
        x -= radius
    } else if(x - radius <= 0) {
        x += radius
    }

    if(y + radius >= canvas.height) {
        y -= radius
    } else if(y - radius <= 0) {
        y += radius
    }

    const circle = {
        x: x,
        y: y,
        radius: radius,
        dx: Math.random() * 16 - 8,
        dy: Math.random() * -16,
        color: `rgba(255, 255, 255, ${Math.random()})`,
        deleted: false
    }

    circles.push(circle)

    if(circles.length >= maxCircles) {
        circles.shift()
    }
}

/* Initializing interaction functions to interact with the canvas directly */
function recolorCircle(clickX, clickY) {
    for(let circle of circles) {
        if(Math.pow((clickX - circle.x), 2) + Math.pow((clickY - circle.y), 2) <= Math.pow(circle.radius, 2)) {
            circle.color = "rgba(255, 0, 0, 1)"
        }
    }
}
function removeCircle(clickX, clickY) {
    for(let circle of circles) {
        if(Math.pow((clickX - circle.x), 2) + Math.pow((clickY - circle.y), 2) <= Math.pow(circle.radius, 2)) {
            circle.deleted = true
        }
    }

    circles = circles.filter(circle => circle.deleted === false)
}

/* Initializing canvas interaction base event handler */
function canvasInteraction(event) {
    event.stopPropagation()

    const clickX = event.offsetX
    const clickY = event.offsetY



    addCircle(clickX, clickY)
    /* recolorCircle(clickX, clickY)
    removeCircle(clickX, clickY) */
}

/* Adding event listener on button to add a circle on click */
addButton.addEventListener("click", (event) => {
    event.stopPropagation()

    let x = Math.random() * canvas.width
    let y = Math.random() * canvas.height

    addCircle(x, y)
})

/* Drawing all initial circles */
for(let i = 0; i < circleAmount; i++) {
    let x = Math.random() * canvas.width
    let y = Math.random() * canvas.height

    addCircle(x, y)
}

/* Adding event listener on canvas to call for canvas event handler on click */
canvas.addEventListener("click", (event) => canvasInteraction(event))


/* --------------------------------------------------------------------------------------------- */



/* Initializing canvas drawing function */
function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for(let circle of circles) {

        if(circle.dx < 0) {
            circle.dx += drag
        } else if(circle.dx > 0) {
            circle.dx -= drag
        }

        circle.dy += gravity

        circle.x += circle.dx
        circle.y += circle.dy

        if(circle.x + circle.radius > canvas.width) {
            circle.x = canvas.width - circle.radius
            circle.dx *= -1
            circle.dx /= elasticity
        } else if(circle.x - circle.radius < 0) {
            circle.x = circle.radius
            circle.dx *= -1
            circle.dx /= elasticity
        }

        if(circle.y + circle.radius > canvas.height) {
            circle.y = canvas.height - circle.radius
            circle.dy *= -1
            circle.dy /= elasticity
        } else if(circle.y - circle.radius < 0) {
            circle.y = circle.radius
            circle.dy *= -1
            circle.dy /= elasticity
        }



        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fillStyle = circle.color
        ctx.fill()
    }
}

/* Initializing animate function then starting animation */
function animate() {
    requestAnimationFrame(animate)
    drawCircles()
}

animate()