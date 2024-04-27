import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class PairStates {
  @prop({ type: Array<Array<number>> })
  public rows!: number[][]
}

// Create a Mongoose model
const PairStatesModel = getModelForClass(PairStates)

export async function getLatestState() {
    return PairStatesModel.findOne({}).sort({ createdAt: -1 }).exec()
}

export function addPairsState(pairs: number[][]) {
    return PairStatesModel.create(pairs)
}