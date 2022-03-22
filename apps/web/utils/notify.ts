import { toast } from 'react-toastify'
import { ToastOptions } from 'react-toastify/dist/types'

export const send = (
  message: string,
  duration = 2500,
  type = 'default',
  opts = {}
) => {
  const options: ToastOptions = {
    position: 'top-center',
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...opts,
  }

  if (type === 'default') {
    toast.dark(message, options)
  }

  if (type === 'success') {
    toast.success(message, options)
  }

  if (type === 'error') {
    toast.error(message, options)
  }
}

export const clear = () => toast.dismiss()

export const notify = {
  send,
  clear,
}
