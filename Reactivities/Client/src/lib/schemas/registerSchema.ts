import Z from 'zod'
import { requiredString } from '../type/util/util'



export const registerSchema = Z.object({
  displayName: requiredString('displayName'),
  email: Z.string().email(),
  password: requiredString('password'),
})

export type RegisterSchema = Z.infer<typeof registerSchema>