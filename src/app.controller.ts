import { Controller, Get, Req, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Request, Response } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    //
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  counter = 0

  @Get('stream')
  async getPolling(@Req() req: Request, @Res() rep: Response) {
    this.counter++
    const counter = this.counter
    console.log('polling', counter)
    var body = [
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
      'in',
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
      'in',
      'culpa',
      'qui',
      'officia',
      'deserunt',
      'mollit',
      'anim',
      'id',
      'est',
      'laborum',
      'some additional text',
    ]
    // send headers
    rep.writeHead(200, {
      'Content-Type': 'text/plain',
    })
    let connectionClosed = false
    req.on('close', () => {
      console.log('connection closed', counter)
      connectionClosed = true
    })

    // send data in chunks
    for (const piece of body) {
      if (connectionClosed) break
      rep.write(piece, 'utf8')
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))
    }

    // close connection
    rep.end()
    console.log('polling done', counter)
  }
}
