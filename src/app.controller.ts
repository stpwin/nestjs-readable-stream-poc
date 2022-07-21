import { Controller, Get, Req, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    //
  }

  @Get()
  getHello(@Req() request: Request): string {
    console.log({ sessionId: request.sessionID })
    return 'hello sid: ' + request.sessionID
  }

  @Get('start')
  async start() {
    await this.appService.startProcess()
  }

  @Get('reset')
  async reset() {
    this.appService.reset()
  }

  @Get('initial')
  async initial() {
    return this.appService.getInitial()
  }

  @Get('stream')
  async getPolling(@Req() req: Request, @Res() rep: Response) {
    const id = uuid()
    console.log('polling', id)

    rep.writeHead(200, {
      'Content-Type': 'text/plain',
    })
    let connectionClosed = false
    req.on('close', () => {
      console.log('connection closed', id)
      connectionClosed = true
      this.appService.stopStream(id)
    })
    await this.appService.stream(id, (piece) => {
      if (!connectionClosed) rep.write(piece, 'utf8')
    })

    console.log('polling done', id)
    rep.end()
  }
}
