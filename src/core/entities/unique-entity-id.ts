import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  to_string() {
    return this.value
  }

  to_value() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(id: UniqueEntityID) {
    return id.to_value() === this.value
  }
}
