#!/usr/bin/env ts-node-script

import * as os from 'os'

let users: Array<number> = [1, 2, 3, 4, 5, 6]
let previousPairs: number[][] = [
    [1, 2],
    [5, 6],
    [2, 4]
]

let userCounts: { [key: number]: number } = {}


previousPairs.forEach(pair => {
    pair.forEach(user => {
        // If the user is in userCounts, increment its count, otherwise initialize it to 1
        userCounts[user] = (userCounts[user] || 0) + 1
        // If someone met each and every user, we will reset the counter
        if (userCounts[user] == users.length) {
            userCounts[user] = 0
        }
    })
})

let usersToReset: Array<number> = users.filter(user => (userCounts[user] || 0) === 0)

previousPairs = previousPairs.filter(pair => 
        !pair.some(user => usersToReset.includes(user))
        )

for (let user of users) {
    let count = userCounts[user] || 0
    console.log(`User ${user}: ${count}`)
}