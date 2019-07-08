import * as React from "react"
import { useState, useEffect } from "react"
import { Dynamic } from "monobase"
import { motion } from "framer-motion"

const spring = {
    type: "spring",
    damping: 20,
    stiffness: 300,
}

function StaticPositionTransition() {
    const [colors, setColors] = useState(initialColors)

    useEffect(() => {
        setTimeout(() => setColors(shuffle(colors)), 1000)
    }, [colors])

    return (
        <ul className="position-container">
            {colors.map(background => (
                <motion.li key={background} positionTransition={spring} style={{ background }} />
            ))}
            <style>{`
ul.position-container,
.position-container li {
  list-style: none !important;
  padding: 0!important;
  margin: 0!important;
}

ul.position-container {
  position: relative;
  display: flex;
  width: 220px;
  flex-wrap: wrap;
}

.position-container li:before { display: none; }
.position-container li {
  border-radius: 10px;
  margin-bottom: 10px!important;
  margin-right: 10px!important;
  width: 100px;
  height: 100px;
}`}</style>
        </ul>
    )
}

export const PositionTransition = Dynamic(StaticPositionTransition)

const initialColors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"]

// Taken from lodash
function shuffle<T>([...array]: T[], size?: number): T[] {
    var index = -1,
        length = array.length,
        lastIndex = length - 1

    size = size === undefined ? length : size
    while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand]

        array[rand] = array[index]
        array[index] = value
    }
    array.length = size
    return array
}
function baseRandom(lower: number, upper: number) {
    return lower + Math.floor(Math.random() * (upper - lower + 1))
}
