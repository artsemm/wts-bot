#!/usr/bin/env ts-node-script

import * as os from 'os'

function countUserPairs(previousPairs: number[][], users?: Array<number>): { [key: number]: number } {
    let userCounts: { [key: number]: number } = {}
    previousPairs.forEach(pair => {
        pair.forEach(user => {
            // If the user is in userCounts, increment its count, otherwise initialize it to 1
            userCounts[user] = (userCounts[user] || 0) + 1
        })
    })
    if (users) {
        for (let user of users) {
            if (userCounts[user] === undefined) {
                userCounts[user] = 0
            }
        }
    }

    return userCounts
}

function resetPairsForLimitUsers(userCounts:  { [key: number]: number }, pairs: number[][]): number[][] {
    let usersToReset: Array<number> = users.filter(user => (userCounts[user] || users.length - 1) === users.length - 1)
    pairs = pairs.filter(pair => 
        !pair.some(user => usersToReset.includes(user))
        )
    return pairs
}

function getResettedPairs(previousPairs: number[][], users?: Array<number>): number[][] {
    let userCounts = countUserPairs(previousPairs, users)
    return resetPairsForLimitUsers(userCounts, previousPairs)
}

function generateRandomPairs(previousPairs: number[][], users: number[]) {
    const allPossiblePairs = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            allPossiblePairs.push([users[i], users[j]])
        }
    }

    const availablePairs = allPossiblePairs.filter(pair => {
        return !previousPairs.some(prevPair => {
            return pair[0] === prevPair[0] && pair[1] === prevPair[1]
        })
    })

    const numPairsToGenerate = Math.min(availablePairs.length, Math.floor(users.length / 2))
    const randomPairs = []
    for (let i = 0; i < numPairsToGenerate; i++) {
        const randomIndex = Math.floor(Math.random() * availablePairs.length)
        randomPairs.push(availablePairs[randomIndex])
        availablePairs.splice(randomIndex, 1)
    }

    return randomPairs
}

let users: Array<number> = [1, 2, 3, 4, 5, 6]
let previousPairs: number[][] = [
    [1, 2],
    // [2, 3],
    [5, 6],
    [2, 4],
    [2, 5],
    [2, 6]
]

let resettedPairs = getResettedPairs(previousPairs)
let randomPairs = generateRandomPairs(resettedPairs, users)
console.log(randomPairs)