#!/usr/bin/env ts-node-script

import { addPairsState, getLatestState } from "@/models/Pair"
import { FunnelStep, User, findUser, getAllUserIds } from "@/models/User"
import { Bot } from 'grammy'
import Context from '@/models/Context'
import { isUserAvailable } from "./checkUser"

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

export async function sendPairs(bot: Bot<Context>) {
    const state = await getLatestState()
    if (state === null) {
        throw new Error('No state was found!')
    }
    // check all available users TODO
    const dbUsers = await getAllUserIds()
    let usersToPair: number[] = []
    for (let i = 0; i < dbUsers.length; i += 1) {
        const userId = dbUsers[i]
        const isAvailable = await isUserAvailable(userId)
        const isRoleToPair = "user" === (await findUser(userId))?.role // checks if the role of the user is "user"
        const isRegistered = FunnelStep.Done === (await findUser(userId))?.funnelStep
        if ( isAvailable && isRoleToPair && isRegistered) {
            usersToPair.push(userId)
        }
    }

    const newPairsInfo = getNewPairsInfo(state.rows, usersToPair)
    const newPairs = newPairsInfo.newPairs
    await addPairsState(newPairs) // what state is now after creating new pairs
    for (let i = 0; i < newPairs.length; i += 1) {
        const p1 = await findUser(newPairs[i][1])
        const p2 = await findUser(newPairs[i][0])
        if (p1 === null || p2 == null) {
            throw new Error('sendPairs error: users were not found')
        }
        await bot.api.sendMessage(newPairs[i][0], `${getPairText(p1)}`)
        await bot.api.sendMessage(newPairs[i][1], `${getPairText(p2)}`)
    }
    // handling unpaired user
    if (newPairsInfo.unpairedUser) {
        const p1 = await findUser(newPairsInfo.unpairedUser)
        const p2 = await findUser(219411361) // community manager, hardcoded
        if (p1 === null || p2 == null) {
            throw new Error('sendPairs error: users were not found')
        }
        await bot.api.sendMessage(newPairsInfo.unpairedUser, `${getPairText(p2)}`)
        await bot.api.sendMessage(219411361, `${getPairText(p1)}`)
    }
    
}

export function getPairText(user: User) {
    if (user === null) {
        console.log('empty user was passed to getPairText!')
        return 
    }
    return `Привет! Присылаем тебе мэтч:

${user.name} 👋
@${user.username} 
Город ${user.city} 
Три впечатлившие книги: ${user.review} 
`
  }
  