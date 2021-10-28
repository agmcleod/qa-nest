import { Injectable } from '@nestjs/common'
import DataLoader = require('dataloader')

import { CommentsService } from './comments.service'

@Injectable()
export class CommentsLoader {
  loader: DataLoader<number, { count: number }>

  constructor(commentsService: CommentsService) {
    this.loader = new DataLoader((keys) =>
      commentsService.getCountByQuestionIds(keys),
    )
  }

  load(id: number) {
    return this.loader.load(id)
  }
}
