import { SetMetadata } from '@nestjs/common'

export const RESPONSE_MESSAGE = 'responseMessage'

export const Message = (message: string) => SetMetadata(RESPONSE_MESSAGE, message)

export const DefaultMessage = {
  CREATED: (entityName: string) => `${entityName} has been created successfully.`,
  UPDATED: (entityName: string) => `${entityName} has been updated successfully.`,
  DELETED: (entityName: string) => `${entityName} has been deleted successfully.`,

  SUCCESS: 'Success',
}
