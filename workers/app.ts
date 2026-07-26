import { handleWorkerRequest, type WorkerEnv } from './handler'

export default {
  fetch: (request: Request, env: WorkerEnv) =>
    handleWorkerRequest(request, env),
}
