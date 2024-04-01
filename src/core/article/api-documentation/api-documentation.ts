import {
  FIND_ALL_COMMON_DOCUMENTATION,
  FIND_ONE_COMMON_DOCUMENTATION,
  REMOVE_COMMON_DOCUMENTATION,
  UPDATE_COMMON_DOCUMENTATION,
} from 'src/api-documentation/common-documentation'
import { CREATE_COMMON_DOCUMENTATION } from 'src/api-documentation/common-documentation/create.documentation'

import { ArticleMessage } from './messages'
import { ArticleEntity } from '../entities/article.entity'

export const CREATE_DOCUMENTATION = CREATE_COMMON_DOCUMENTATION({
  entity: ArticleEntity,
  entityName: 'article',
  message: ArticleMessage.CREATED,
})

export const FIND_ALL_DOCUMENTATION = FIND_ALL_COMMON_DOCUMENTATION({
  entity: ArticleEntity,
  entityName: 'articles',
})

export const FIND_ONE_DOCUMENTATION = FIND_ONE_COMMON_DOCUMENTATION({
  entity: ArticleEntity,
  entityName: 'article',
})

export const UPDATE_DOCUMENTATION = UPDATE_COMMON_DOCUMENTATION({
  entity: ArticleEntity,
  entityName: 'article',
  message: ArticleMessage.UPDATED,
})

export const REMOVE_DOCUMENTATION = REMOVE_COMMON_DOCUMENTATION({
  entityName: 'article',
  message: ArticleMessage.DELETED,
})
