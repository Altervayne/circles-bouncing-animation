/* Getting necessary elements */
const canvas = document.getElementById("backgroundCanvas")
/* const addButton = document.getElementById("addBallButton") */
const ctx = canvas.getContext("2d")

/* Setting canvas dimensions */
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* Declaring all physics variables */
const defaultGravity = 0.5
let gravityModifier = 1
let gravity = defaultGravity*gravityModifier

const defaultDrag = 0.005   
let dragModifier = 1
let drag = defaultDrag*dragModifier

const defaultElasticity = 0.77
let elasticity = defaultElasticity


function updateVariables() {
    gravity = defaultGravity*gravityModifier
    drag = defaultDrag*dragModifier
    elasticity = elasticityModifier
}

function getRandomInRange(min, max) {
    return Math.random() * (max-min) + min
}



/* Initializing the circles array and asking user how many circles to create */
let maxCircles = 20                     /* Default to 20 */
let circles = []
const circleAmount = prompt(`How many circles would you like to begin with ? (default maximum is ${maxCircles})`, "0")














/* ------User Input Block Start----------------------------------------------------------------- */


/* Getting radio input elements to select click type */
const clickTypeInputs = document.getElementsByName("clickType")
let selectedClickType = ''

/* Listening for selection change */
clickTypeInputs.forEach(input => {
    input.addEventListener("change", (event) => {
        event.stopPropagation()

        clickTypeInputs.forEach(input => {
            if(input.checked) {
                selectedClickType = input.value
            }
        })
    })
})


/* Getting radio input elements to select border behavior */
const borderBehaviorInputs = document.getElementsByName("borderBehavior")
const borderBounceInput = document.getElementById("borderBounce")
borderBounceInput.checked = true
let selectedBehavior = 'borderBounce'

/* Listening for selection change */
borderBehaviorInputs.forEach(input => {
    input.addEventListener("change", (event) => {
        event.stopPropagation()

        borderBehaviorInputs.forEach(input => {
            if(input.checked) {
                selectedBehavior = input.value
            }
        })
    })
})


/* Getting range input to get max circles amount */
const maxCirclesInput = document.getElementById("maxCircles")
const maxCirclesDisplay = document.getElementById("currentMaxCircles")
maxCirclesInput.value = maxCircles
maxCirclesDisplay.innerHTML = maxCircles

maxCirclesInput.addEventListener("change", (event) => {
    event.stopPropagation()

    maxCircles = maxCirclesInput.value
    maxCirclesDisplay.innerHTML = maxCirclesInput.value

    while(circles.length > maxCircles) {
        circles.pop()
    }

    updateCounter()
})


/* Getting range inputs to get physics variables modifiers and setting listeners to update them accordingly */
const gravityModifierInput = document.getElementById("gravityModifier")
gravityModifierInput.value = gravityModifier*100
const gravityModifierDisplay = document.getElementById("currentGravityModifier")
function updateGravityDisplay() {
    gravityModifierDisplay.innerHTML = gravityModifier 
}
gravityModifierInput.addEventListener("change", (event) => {
    event.preventDefault()

    gravityModifier = gravityModifierInput.value/100
    updateGravityDisplay()
    updateVariables()
})


const dragModifierInput = document.getElementById("dragModifier")
dragModifierInput.value = dragModifier*100
const dragModifierDisplay = document.getElementById("currentDragModifier")
function updateDragDisplay() {
    dragModifierDisplay.innerHTML = dragModifier
}
dragModifierInput.addEventListener("change", (event) => {
    event.preventDefault()

    dragModifier = dragModifierInput.value/100
    updateDragDisplay()
    updateVariables()
})


const elasticityModifierInput = document.getElementById("elasticityModifier")
elasticityModifierInput.value = defaultElasticity*100
const elasticityModifierDisplay = document.getElementById("currentElasticityModifier")
elasticityModifierDisplay.innerHTML = defaultElasticity
function updateElasticityDisplay() {
    elasticityModifierDisplay.innerHTML = elasticityModifier
}
elasticityModifierInput.addEventListener("change", (event) => {
    event.preventDefault()

    elasticityModifier = elasticityModifierInput.value/100
    updateElasticityDisplay()
    updateVariables()
})



/* Getting circle counter id to display amount of circles */
const circleCounter = document.getElementById("circleCounter")

function updateCounter() {
    circleCounter.innerHTML = circles.length
}


/* Dealing with window being resized */
function windowResizeHandler() {
    console.log("window resize detected")

    const previousWidth = canvas.width
    const previousHeight = canvas.height
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    const xRatio = previousWidth/newWidth
    const yRatio = previousHeight/newHeight

    canvas.width = newWidth
    canvas.height = newHeight


    for(let circle of circles) {
        circle.x /= xRatio
        circle.y /= yRatio
    }
}

window.addEventListener('resize', windowResizeHandler, true)


/* ------User Input Block End------------------------------------------------------------------- */












/* ------Circle Drawing & Interaction Block Start----------------------------------------------- */


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
        color: `rgba(255, 255, 255, ${getRandomInRange(0.4, 1)})`,
        deleted: false
    }

    circles.push(circle)

    if(circles.length > maxCircles) {
        circles.shift()
    }

    updateCounter()
}

/* Initializing interaction functions to interact with the canvas directly */
function recolorCircle(clickX, clickY) {
    for(let circle of circles) {
        if(Math.pow((clickX - circle.x), 2) + Math.pow((clickY - circle.y), 2) <= Math.pow(circle.radius, 2)) {
            circle.color = `rgba(${getRandomInRange(0, 255)}, ${getRandomInRange(0, 255)}, ${getRandomInRange(0, 255)}, ${Math.random()})`
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

    updateCounter()
}

/* Initializing canvas interaction base event handler */
function canvasInteraction(event) {
    event.stopPropagation()

    const clickX = event.offsetX
    const clickY = event.offsetY



    switch(selectedClickType) {
        case '':
            console.log("No action selected.")
            break
        case 'addCircle':
            addCircle(clickX, clickY)
            break
        case 'recolorCircle':
            recolorCircle(clickX, clickY)
            break
        case 'removeCircle':
            removeCircle(clickX, clickY)
            break
    }
}

/* Drawing all initial circles */
for(let i = 0; i < circleAmount; i++) {
    let x = Math.random() * canvas.width
    let y = Math.random() * canvas.height

    addCircle(x, y)
}

/* Adding event listener on canvas to call for canvas event handler on click */
canvas.addEventListener("click", (event) => canvasInteraction(event))



/* Initializing border collision behavior functions */
function borderBounce(circle) {
    if(circle.x + circle.radius > canvas.width) {
        circle.x = canvas.width - circle.radius
        circle.dx *= -1
        circle.dx *= elasticity
    } else if(circle.x - circle.radius < 0) {
        circle.x = circle.radius
        circle.dx *= -1
        circle.dx *= elasticity
    }

    if(circle.y + circle.radius > canvas.height) {
        circle.y = canvas.height - circle.radius
        circle.dy *= -1
        circle.dy *= elasticity
    } else if(circle.y - circle.radius < 0) {
        circle.y = circle.radius
        circle.dy *= -1
        circle.dy *= elasticity
    }
}
function borderWarp(circle) {
    if(circle.x - circle.radius > canvas.width) {
        circle.x = -circle.radius
    } else if(circle.x + circle.radius < 0) {
        circle.x = canvas.width + circle.radius
    }

    if(circle.y - circle.radius > canvas.height) {
        circle.y = -circle.radius
    } else if(circle.y + circle.radius < 0) {
        circle.y = canvas.height + circle.radius
    }
}


/* ------Circle Drawing & Interaction Block End------------------------------------------------- */













/* ------Animation Block Start------------------------------------------------------------------ */


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

        

        switch(selectedBehavior) {
            case 'borderBounce':
                borderBounce(circle)
                break
            case 'borderWarp':
                borderWarp(circle)
                break
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


/* ------Animation Block End-------------------------------------------------------------------- */