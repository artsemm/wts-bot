#!/usr/bin/env ts-node-script

import * as os from 'os'

let users: Array<number> = [1, 2, 3, 4, 5, 6]
let previousPairs: number[][] = [
    [1, 2],
    [2, 3],
    [5, 6],
    [2, 4],
    [2, 5],
    [2, 6]
]

function countUserPairs(previousPairs: number[][]): { [key: number]: number } {
    let userCounts: { [key: number]: number } = {}
    previousPairs.forEach(pair => {
        pair.forEach(user => {
            // If the user is in userCounts, increment its count, otherwise initialize it to 1
            userCounts[user] = (userCounts[user] || 0) + 1
        })
    })

    return userCounts
}

function resetPairsForLimitUsers(users: Array<number>, pairs: number[][]): number[][] {
    let userCounts = countUserPairs(pairs)
    let usersToReset: Array<number> = users.filter(user => (userCounts[user] || users.length - 1) === users.length - 1)
    pairs = pairs.filter(pair => 
        !pair.some(user => usersToReset.includes(user))
        )
    return pairs
}

let res = resetPairsForLimitUsers(users, previousPairs)
console.log(res)