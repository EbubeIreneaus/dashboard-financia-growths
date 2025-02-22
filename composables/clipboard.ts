import { Notify } from 'quasar'
import { NotifyToastSuccess } from '~/lib/notify'

export async function useCopy(content: string){
  await navigator.clipboard.writeText(content)
  NotifyToastSuccess('copied successfully')
  
} 