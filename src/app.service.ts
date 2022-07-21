import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

const dataToProcessing = [
  'hello world',
  'early morning',
  'richard stallman',
  'chunky bacon',
  'the meaning of life',
  'nestjs',
  'nestjs is awesome',
  'some more text',
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipisicing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'end',
]

@Injectable()
export class AppService {
  private processed = []
  private processing = false
  private connections = new Map<string, boolean>()
  constructor(private readonly eventEmitter: EventEmitter2) {}

  reset() {
    this.processed = []
  }

  async getInitial() {
    return this.processed
  }

  async startProcess() {
    if (this.processing)
      throw new UnprocessableEntityException('queue is processing')
    this.processing = true
    this.processed = []
    for (const piece of dataToProcessing) {
      this.eventEmitter.emit(`processing.${piece}`, piece)
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))
      this.processed.push(piece)
      this.eventEmitter.emit(`processed.${piece}`, piece)
    }
    this.eventEmitter.emit('success')
    this.processing = false
  }

  async stopStream(requestId: string) {
    this.connections.delete(requestId)
  }

  async stream(requestId: string, callback: (peace: any) => void) {
    this.connections.set(requestId, true)
    let success = false
    const listenerFn = () => {
      success = true
      this.eventEmitter.off('success', listenerFn)
    }
    if (this.processing) {
      this.eventEmitter.on('success', listenerFn)
    }
    while (!success && this.processing) {
      if (!this.connections.get(requestId)) {
        this.eventEmitter.off('success', listenerFn)
        break
      }
      try {
        const [piece] = await this.eventEmitter.waitFor('processed.*', 1000)
        console.log({ piece })
        callback(piece)
      } catch (e) {}
    }
  }
}
