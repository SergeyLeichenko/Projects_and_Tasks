import { useToast } from 'primevue/usetoast'

export const useAppToast = () => {
  const toast = useToast()

  const showToast = ({
    severity = 'success',
    summary = 'Success',
    detail = 'Message Content',
    life = 3000,
  }: {
    severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
    summary?: string
    detail?: string
    life?: number
  }) => {
    toast.add({
      severity,
      summary,
      detail,
      life,
    })
  }

  return {
    showToast,
  }
}
