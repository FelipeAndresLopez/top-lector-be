import { Router } from 'express'
import { TestingController } from '../controllers/testing.js'

export const createTestingRouter = () => {
  const testingController = new TestingController()
  const testingRouter = Router()
  testingRouter.post('/reset', testingController.resetDatabase)
  return testingRouter
}
