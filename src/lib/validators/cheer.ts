import { z } from 'zod'
import { findForbiddenWord } from '@/lib/forbidden-words'

/**
 * Nickname rule (per spec):
 *   - starts with a letter
 *   - 2~18 of letters / digits / underscores in the middle
 *   - ends with a letter or digit
 *   - total length 4~20
 */
const NICKNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,18}[a-zA-Z0-9]$/

export const cheerFormSchema = z.object({
  nickname: z
    .string()
    .min(4, '닉네임은 4~20자여야 해요')
    .max(20, '닉네임은 4~20자여야 해요')
    .regex(NICKNAME_REGEX, '영문으로 시작하고 영문·숫자·언더스코어(_)만 사용해주세요'),
  content: z
    .string()
    .min(1, '응원 한마디를 입력해주세요')
    .max(100, '100자 이내로 작성해주세요')
    .refine((v) => findForbiddenWord(v) === null, {
      message: '사용할 수 없는 표현이 포함되어 있어요',
    }),
  agree: z.literal(true, {
    errorMap: () => ({ message: '운영원칙에 동의해주세요' }),
  }),
})

export type CheerFormValues = z.infer<typeof cheerFormSchema>

export const REPORT_REASONS = [
  { value: 'abuse', label: '욕설·비방' },
  { value: 'spam', label: '스팸·광고' },
  { value: 'fake', label: '허위 사실' },
  { value: 'etc', label: '기타' },
] as const

export type ReportReason = (typeof REPORT_REASONS)[number]['value']

export const reportFormSchema = z.object({
  reason: z.enum(['abuse', 'spam', 'fake', 'etc'], {
    errorMap: () => ({ message: '신고 사유를 선택해주세요' }),
  }),
})

export type ReportFormValues = z.infer<typeof reportFormSchema>
