import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'No content.'
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data
    const title = data?.title
    const detail = data?.detail
    if (typeof title === 'string' && title.length > 0) {
      errMsg = title
    } else if (typeof detail === 'string' && detail.length > 0) {
      errMsg = detail
    }
  }

  toast.error(errMsg)
}
