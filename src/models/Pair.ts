import { prop, getModelForClass } from '@typegoose/typegoose'

// Define a schema for the inner array
class Pair {
    @prop({ default: Date.now })
    public createdAt?: Date;
    @prop({ required: true, validate: /\d+/ })
    values!: number[]

  // Custom validator to ensure two numbers and swap if necessary
  static validatePair(arr: number[]) {
    if (arr.length !== 2) {
      return false
    }

    // Swap if the first number is greater than the second number
    if (arr[0] > arr[1]) {
      [arr[0], arr[1]] = [arr[1], arr[0]]
    }

    return true;
  }
}

// Define a schema for the outer array
export class PairStates {
  @prop({ type: Pair })
  public rows!: Pair[]
}

// Create a Mongoose model
const PairStatesModel = getModelForClass(PairStates)