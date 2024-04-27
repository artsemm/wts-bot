#!/usr/bin/env ts-node-script

import { getLatestState } from "@/models/Pair"
import { User, findUser } from "@/models/User"
import { Context } from "grammy"

function countUserPairs(previousPairs: number[][], users?: number[]): { [key: number]: number } {
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

function resetPairsForLimitUsers(userCounts:  { [key: number]: number }, pairs: number[][], users: number[]): number[][] {
    let usersToReset: Array<number> = users.filter(user => (userCounts[user] || users.length - 1) === users.length - 1)
    pairs = pairs.filter(pair => 
        !pair.some(user => usersToReset.includes(user))
        )
    return pairs
}

function generateRandomPairs(previousPairs: number[][], users: number[]) {
    users = users.sort()
    const oddUser = users.length % 2 !== 0 ? users.splice(Math.floor(Math.random() * users.length), 1)[0] : null

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

    // Shuffle the available pairs randomly
    for (let i = availablePairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availablePairs[i], availablePairs[j]] = [availablePairs[j], availablePairs[i]]
    }

    const pairedUsers = new Set<number>()
    const randomPairs = []
    while (availablePairs.length > 0) {
        const pair = availablePairs.pop()
        if (pair) {
            const [user1, user2] = pair
            // Check if both users in the pair have not been paired before
            if (!pairedUsers.has(user1) && !pairedUsers.has(user2)) {
                randomPairs.push(pair)
                // Mark both users as paired
                pairedUsers.add(user1)
                pairedUsers.add(user2)
            }
        }
    }

    // If there was an odd user, return it
    return oddUser ? { pairs: randomPairs, unpairedUser: oddUser } : { pairs: randomPairs, unpairedUser: null }
}

export function getNewPairsInfo(previousPairs: number[][], users: Array<number>) {
    let userCounts = countUserPairs(previousPairs, users)
    previousPairs = resetPairsForLimitUsers(userCounts, previousPairs, users)
    let newPairs = generateRandomPairs(previousPairs, users)
    let info = {newPairs: newPairs.pairs, unpairedUser: newPairs.unpairedUser, previousPairs: previousPairs.concat(newPairs.pairs)}
    return info
}

export async function sendPairs(ctx: Context) {
    const state = await getLatestState()
    if (state) {
        for (let i = 0; i < state.rows.length; i += 1) {
            const p1 = await findUser([i][1])
            const p2 = await findUser([i][0])
            await ctx.api.sendMessage(state.rows[i][0], `${getPairText(p1)}`)
            await ctx.api.sendMessage(state.rows[i][1], `${getPairText(p2)}`)
        }
    }
}

export function getPairText(user: User | null) {
    if (user === null) {
        console.log('empty user was passed to getPairText!')
        return 
    }
    return `Привет! Сегодня первое число месяца. А вот и ваш мэтч:
${user.name} 
@
${user.city} 
Три любимые книги: ${user.review} 
`
  }